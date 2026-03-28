export const runtime = "nodejs";

import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth, { type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import {
  checkOtpVerifyLock,
  clearOtpVerifyFailures,
  recordOtpVerifyFailure,
} from "@/lib/otp-throttle";
import { prisma } from "@/lib/prisma";

const recentWelcomeSends = new Map<string, number>();

const MAX_OTP_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000;
const OTP_ATTEMPT_WINDOW_MS = 15 * 60 * 1000;
const WELCOME_DEDUP_MS = 60 * 1000;
const MAX_TRACKED_EMAILS = 10_000;

const EMAIL_REGEX =
  /^(?=.{1,254}$)(?=.{1,64}@)[A-Za-z0-9](?:[A-Za-z0-9._%+-]{0,62}[A-Za-z0-9])?@[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?(?:\.[A-Za-z0-9](?:[A-Za-z0-9-]{0,61}[A-Za-z0-9])?)+$/;
const OTP_REGEX = /^\d{6}$/;

function pruneWelcomeSends(now: number): void {
  for (const [email, sentAt] of recentWelcomeSends.entries()) {
    if (now - sentAt > WELCOME_DEDUP_MS) {
      recentWelcomeSends.delete(email);
    }
  }

  if (recentWelcomeSends.size <= MAX_TRACKED_EMAILS) {
    return;
  }

  for (const [email] of recentWelcomeSends) {
    recentWelcomeSends.delete(email);
    if (recentWelcomeSends.size <= MAX_TRACKED_EMAILS) {
      break;
    }
  }
}

function shouldSendWelcomeEmail(email: string): boolean {
  const now = Date.now();
  pruneWelcomeSends(now);
  const lastSentAt = recentWelcomeSends.get(email);

  if (lastSentAt && now - lastSentAt < WELCOME_DEDUP_MS) {
    return false;
  }

  recentWelcomeSends.set(email, now);
  return true;
}

async function triggerWelcomeEmail(email: string, name?: string | null) {
  if (!shouldSendWelcomeEmail(email)) {
    return;
  }

  try {
    const { sendWelcomeEmail } = await import("@/lib/sendWelcomeEmail");
    await sendWelcomeEmail(email, name ?? undefined);
  } catch (error) {
    console.error("WELCOME_EMAIL_FAILED", error);
  }
}

function getRequiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}

function getFirstEnv(...names: string[]): string | undefined {
  for (const name of names) {
    const value = process.env[name];
    if (value) {
      return value;
    }
  }
  return undefined;
}

function parsePositiveInt(raw: string | undefined, fallback: number): number {
  const parsed = raw ? Number.parseInt(raw, 10) : fallback;
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getAppBaseUrl(): string {
  const raw = process.env.NEXTAUTH_URL?.trim();
  if (!raw) return "http://localhost:3000";

  try {
    const parsed = new URL(raw);
    parsed.pathname = "";
    parsed.search = "";
    parsed.hash = "";
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return "http://localhost:3000";
  }
}

const googleClientId = getFirstEnv("GOOGLE_CLIENT_ID", "GOOGLE_ID");
const googleClientSecret = getFirstEnv("GOOGLE_CLIENT_SECRET", "GOOGLE_SECRET");
const githubClientId = getFirstEnv("GITHUB_CLIENT_ID", "GITHUB_ID");
const githubClientSecret = getFirstEnv("GITHUB_CLIENT_SECRET", "GITHUB_SECRET");
const oauthHttpTimeoutMs = parsePositiveInt(
  process.env.NEXTAUTH_OAUTH_TIMEOUT_MS,
  15_000,
);
const appBaseUrl = getAppBaseUrl();

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    CredentialsProvider({
      name: "OTP",
      credentials: {
        email: { label: "Email", type: "text" },
        otp: { label: "OTP", type: "text" },
      },
      async authorize(credentials) {
        const email =
          typeof credentials?.email === "string"
            ? credentials.email.trim().toLowerCase()
            : "";
        const otp =
          typeof credentials?.otp === "string" ? credentials.otp.trim() : "";

        if (!EMAIL_REGEX.test(email) || !OTP_REGEX.test(otp)) {
          throw new Error("INVALID_OTP");
        }

        const attemptCheck = await checkOtpVerifyLock(email);
        if (!attemptCheck.allowed) {
          throw new Error(`ACCOUNT_LOCKED_${attemptCheck.remainingSeconds}`);
        }

        const { createHash } = await import("node:crypto");
        const hashedOtp = createHash("sha256").update(otp).digest("hex");

        const otpRecord = await prisma.otpCode.findFirst({
          where: {
            email,
            code: hashedOtp,
            expiresAt: { gt: new Date() },
          },
          orderBy: { createdAt: "desc" },
        });

        if (!otpRecord) {
          await recordOtpVerifyFailure(
            email,
            MAX_OTP_ATTEMPTS,
            OTP_ATTEMPT_WINDOW_MS,
            LOCKOUT_DURATION_MS,
          );
          throw new Error("INVALID_OR_EXPIRED_OTP");
        }

        await prisma.otpCode.delete({ where: { id: otpRecord.id } });
        await clearOtpVerifyFailures(email);

        let user = await prisma.user.findUnique({ where: { email } });
        const isNewUser = !user;

        if (isNewUser) {
          user = await prisma.user.create({
            data: {
              email,
              emailVerified: new Date(),
            },
          });
        }

        if (isNewUser) {
          await triggerWelcomeEmail(email, user?.name);
        }

        if (!user) {
          throw new Error("USER_CREATION_FAILED");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    ...(googleClientId && googleClientSecret
      ? [
          GoogleProvider({
            clientId: googleClientId,
            clientSecret: googleClientSecret,
            allowDangerousEmailAccountLinking: true,
            httpOptions: {
              timeout: oauthHttpTimeoutMs,
            },
          }),
        ]
      : []),
    ...(githubClientId && githubClientSecret
      ? [
          GitHubProvider({
            clientId: githubClientId,
            clientSecret: githubClientSecret,
            allowDangerousEmailAccountLinking: true,
            httpOptions: {
              timeout: oauthHttpTimeoutMs,
            },
          }),
        ]
      : []),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/register",
    error: "/register",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email ?? undefined;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
      }
      return session;
    },
    async redirect({ url, baseUrl }) {
      const normalizedBaseUrl = (() => {
        try {
          const parsed = new URL(baseUrl);
          parsed.pathname = "";
          parsed.search = "";
          parsed.hash = "";
          return parsed.toString().replace(/\/$/, "");
        } catch {
          return appBaseUrl;
        }
      })();

      if (url.startsWith("/")) {
        return `${normalizedBaseUrl}${url}`;
      }

      try {
        const targetUrl = new URL(url);
        if (targetUrl.origin === normalizedBaseUrl) {
          return url;
        }
      } catch {
        // Fall through to safe redirect.
      }

      return `${normalizedBaseUrl}/projects`;
    },
  },
  events: {
    async createUser({ user }) {
      if (!user.email) return;
      await triggerWelcomeEmail(user.email, user.name);
    },
    async signIn({ user, account, isNewUser }) {
      const isOAuthProvider =
        account?.provider === "google" || account?.provider === "github";

      if (!isOAuthProvider || !isNewUser || !user.email) {
        return;
      }

      await triggerWelcomeEmail(user.email, user.name);
    },
  },
  secret: getRequiredEnv("NEXTAUTH_SECRET"),
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
