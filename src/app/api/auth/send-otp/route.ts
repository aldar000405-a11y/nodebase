export const runtime = "nodejs";

import { randomInt } from "node:crypto";
import { isIP } from "node:net";
import { NextResponse } from "next/server";
import { renderOtpEmailHtml } from "@/lib/email-templates";
import { checkOtpSendRateLimit } from "@/lib/otp-throttle";
import { prisma } from "@/lib/prisma";

const IS_DEVELOPMENT = process.env.NODE_ENV === "development";
const MAX_OTP_REQUESTS = IS_DEVELOPMENT ? 10 : 5;
const RATE_LIMIT_WINDOW_MS = IS_DEVELOPMENT ? 2 * 60 * 1000 : 10 * 60 * 1000;

function getTrustedOrigin(): URL | null {
  const raw = process.env.NEXTAUTH_URL?.trim();
  if (!raw) return null;

  try {
    return new URL(raw);
  } catch {
    return null;
  }
}

function isAllowedDevOrigin(origin: string): boolean {
  try {
    const parsed = new URL(origin);
    return parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1";
  } catch {
    return false;
  }
}

function hasTrustedOrigin(request: Request): boolean {
  const trustedOrigin = getTrustedOrigin();
  const isDevelopment = process.env.NODE_ENV === "development";

  const originHeader = request.headers.get("origin");
  if (originHeader) {
    if (isDevelopment && isAllowedDevOrigin(originHeader)) return true;
    if (!trustedOrigin) return true;

    try {
      return new URL(originHeader).origin === trustedOrigin.origin;
    } catch {
      return false;
    }
  }

  const refererHeader = request.headers.get("referer");
  if (!refererHeader) return !trustedOrigin;

  if (isDevelopment && isAllowedDevOrigin(refererHeader)) return true;
  if (!trustedOrigin) return true;

  try {
    return new URL(refererHeader).origin === trustedOrigin.origin;
  } catch {
    return false;
  }
}

function normalizeClientIp(value: string): string | null {
  const raw = value.trim();
  if (!raw) return null;

  const withoutMappedPrefix = raw.startsWith("::ffff:") ? raw.slice(7) : raw;
  return isIP(withoutMappedPrefix) ? withoutMappedPrefix : null;
}

function getClientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  const forwardedFirst = forwarded?.split(",")[0] ?? "";

  const candidates = [
    request.headers.get("cf-connecting-ip") ?? "",
    request.headers.get("x-real-ip") ?? "",
    forwardedFirst,
  ];

  for (const candidate of candidates) {
    const normalized = normalizeClientIp(candidate);
    if (normalized) return normalized;
  }

  return "unknown";
}

const EMAIL_REGEX =
  /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getSmtpConfig() {
  const host = getRequiredEnv("EMAIL_SERVER_HOST").trim();
  const portRaw = getRequiredEnv("EMAIL_SERVER_PORT").trim();
  const user = getRequiredEnv("EMAIL_SERVER_USER").trim();
  const pass = getRequiredEnv("EMAIL_SERVER_PASSWORD").trim();
  const from = getRequiredEnv("EMAIL_FROM").trim();

  const port = Number(portRaw);
  if (!Number.isFinite(port)) {
    throw new Error("EMAIL_SERVER_PORT must be a valid number.");
  }

  return {
    host,
    port,
    user,
    pass,
    from,
    secure: port === 465,
  };
}

function tooManyRequestsResponse(remainingSeconds?: number) {
  const fallbackSeconds = Math.ceil(RATE_LIMIT_WINDOW_MS / 1000);
  return NextResponse.json(
    {
      error: "TOO_MANY_REQUESTS",
      retryAfterSeconds: remainingSeconds ?? fallbackSeconds,
    },
    { status: 429 },
  );
}

export async function POST(request: Request) {
  try {
    const isDevelopment = process.env.NODE_ENV === "development";

    if (!hasTrustedOrigin(request)) {
      return NextResponse.json({ error: "FORBIDDEN_ORIGIN" }, { status: 403 });
    }

    const body = await request.json();
    const email =
      typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";

    const ip = getClientIp(request);
    const ipRateLimitKey = `ip:${ip}`;

    const ipLimit = await checkOtpSendRateLimit(
      ipRateLimitKey,
      MAX_OTP_REQUESTS,
      RATE_LIMIT_WINDOW_MS,
    );
    if (ipLimit.limited) {
      return tooManyRequestsResponse(ipLimit.remainingSeconds);
    }

    if (!EMAIL_REGEX.test(email)) {
      return NextResponse.json({ error: "INVALID_EMAIL" }, { status: 400 });
    }

    const rateLimitKey = `${ip}:${email}`;

    const pairLimit = await checkOtpSendRateLimit(
      rateLimitKey,
      MAX_OTP_REQUESTS,
      RATE_LIMIT_WINDOW_MS,
    );
    if (pairLimit.limited) {
      return tooManyRequestsResponse(pairLimit.remainingSeconds);
    }

    const emailLimit = await checkOtpSendRateLimit(
      email,
      MAX_OTP_REQUESTS,
      RATE_LIMIT_WINDOW_MS,
    );
    if (emailLimit.limited) {
      return tooManyRequestsResponse(emailLimit.remainingSeconds);
    }

    const code = randomInt(0, 1_000_000).toString().padStart(6, "0");
    const { createHash } = await import("node:crypto");
    const hashedCode = createHash("sha256").update(code).digest("hex");
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await prisma.$transaction([
      prisma.otpCode.deleteMany({ where: { email } }),
      prisma.otpCode.create({
        data: {
          email,
          code: hashedCode,
          expiresAt,
        },
      }),
    ]);

    const bypassDevOtp = isDevelopment && process.env.OTP_DEV_BYPASS === "true";
    if (bypassDevOtp) {
      return NextResponse.json({
        success: true,
        smtpBypassed: true,
        bypassReason: "DEV_BYPASS",
        debugCode: code,
      });
    }

    const smtp = getSmtpConfig();
    const nodemailer = require("nodemailer") as typeof import("nodemailer");
    const codeDigits = code.split("");

    const transport = nodemailer.createTransport({
      host: smtp.host,
      port: smtp.port,
      secure: smtp.secure,
      auth: {
        user: smtp.user,
        pass: smtp.pass,
      },
    });

    await transport.sendMail({
      to: email,
      from: smtp.from,
      subject: "MONOLITH_AI // SECURITY_PROTOCOL",
      text: `MONOLITH_AI // SECURITY_PROTOCOL\n\nACCESS REQUEST\n\nYOUR ONE-TIME CODE: ${code}\n\nENTER THIS CODE IN THE APP TO CONTINUE.`,
      html: renderOtpEmailHtml({ codeDigits, email }),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("SEND_OTP_FAILED", error);

    const errorCode =
      error && typeof error === "object" && "code" in error
        ? String((error as { code?: unknown }).code ?? "")
        : "";
    const responseCode =
      error && typeof error === "object" && "responseCode" in error
        ? Number((error as { responseCode?: unknown }).responseCode ?? NaN)
        : NaN;

    if (
      ["EENVELOPE", "EENVELOPEFROM", "EENVELOPETO"].includes(errorCode) ||
      [550, 551, 553].includes(responseCode)
    ) {
      return NextResponse.json({ error: "WRONG_EMAIL" }, { status: 400 });
    }

    return NextResponse.json({ error: "FAILED_TO_SEND_OTP" }, { status: 500 });
  }
}
