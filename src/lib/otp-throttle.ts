import { createId } from "@paralleldrive/cuid2";
import { prisma } from "@/lib/prisma";

const OTP_SEND_SCOPE = "OTP_SEND";
const OTP_VERIFY_SCOPE = "OTP_VERIFY";

type ThrottleRow = {
  count: number;
  windowEnd: Date;
  lockedUntil: Date | null;
};

export type OtpSendRateLimitStatus = {
  limited: boolean;
  remainingSeconds?: number;
};

function getRemainingSeconds(windowEnd: Date): number {
  return Math.max(1, Math.ceil((windowEnd.getTime() - Date.now()) / 1000));
}

async function getThrottleRow(
  scope: string,
  key: string,
): Promise<ThrottleRow | null> {
  const rows = await prisma.$queryRaw<ThrottleRow[]>`
    SELECT "count", "windowEnd" AS "windowEnd", "lockedUntil" AS "lockedUntil"
    FROM "auth_throttle"
    WHERE "scope" = ${scope} AND "key" = ${key}
    LIMIT 1
  `;

  return rows[0] ?? null;
}

async function upsertFreshWindow(scope: string, key: string, windowMs: number) {
  const now = new Date();
  const windowEnd = new Date(now.getTime() + windowMs);

  await prisma.$executeRaw`
    INSERT INTO "auth_throttle" (
      "id",
      "scope",
      "key",
      "count",
      "windowStart",
      "windowEnd",
      "lockedUntil",
      "createdAt",
      "updatedAt"
    )
    VALUES (
      ${createId()},
      ${scope},
      ${key},
      1,
      ${now},
      ${windowEnd},
      NULL,
      ${now},
      ${now}
    )
    ON CONFLICT ("scope", "key")
    DO UPDATE SET
      "count" = 1,
      "windowStart" = ${now},
      "windowEnd" = ${windowEnd},
      "lockedUntil" = NULL,
      "updatedAt" = ${now}
  `;
}

export async function checkOtpSendRateLimit(
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<OtpSendRateLimitStatus> {
  const now = new Date();
  const row = await getThrottleRow(OTP_SEND_SCOPE, key);

  if (!row || now >= row.windowEnd) {
    await upsertFreshWindow(OTP_SEND_SCOPE, key, windowMs);
    return { limited: false };
  }

  if (row.count >= maxRequests) {
    return {
      limited: true,
      remainingSeconds: getRemainingSeconds(row.windowEnd),
    };
  }

  const updatedRows = await prisma.$queryRaw<{ count: number }[]>`
    UPDATE "auth_throttle"
    SET "count" = "count" + 1, "updatedAt" = ${now}
    WHERE
      "scope" = ${OTP_SEND_SCOPE}
      AND "key" = ${key}
      AND "windowEnd" > ${now}
      AND "count" < ${maxRequests}
    RETURNING "count"
  `;

  if (updatedRows.length > 0) {
    return { limited: false };
  }

  const fallbackRow = await getThrottleRow(OTP_SEND_SCOPE, key);
  return {
    limited: true,
    remainingSeconds: fallbackRow
      ? getRemainingSeconds(fallbackRow.windowEnd)
      : Math.ceil(windowMs / 1000),
  };
}

export async function isOtpSendRateLimited(
  key: string,
  maxRequests: number,
  windowMs: number,
): Promise<boolean> {
  const status = await checkOtpSendRateLimit(key, maxRequests, windowMs);
  return status.limited;
}

export async function checkOtpVerifyLock(email: string): Promise<{
  allowed: boolean;
  remainingSeconds?: number;
}> {
  const row = await getThrottleRow(OTP_VERIFY_SCOPE, email);
  if (!row?.lockedUntil) {
    return { allowed: true };
  }

  const nowMs = Date.now();
  const lockedUntilMs = row.lockedUntil.getTime();

  if (nowMs >= lockedUntilMs) {
    return { allowed: true };
  }

  return {
    allowed: false,
    remainingSeconds: Math.ceil((lockedUntilMs - nowMs) / 1000),
  };
}

export async function recordOtpVerifyFailure(
  email: string,
  maxAttempts: number,
  attemptWindowMs: number,
  lockoutMs: number,
): Promise<void> {
  const now = new Date();
  const row = await getThrottleRow(OTP_VERIFY_SCOPE, email);

  if (!row || now >= row.windowEnd) {
    await upsertFreshWindow(OTP_VERIFY_SCOPE, email, attemptWindowMs);
    return;
  }

  const updatedRows = await prisma.$queryRaw<{ count: number }[]>`
    UPDATE "auth_throttle"
    SET
      "count" = "count" + 1,
      "lockedUntil" = CASE
        WHEN "count" + 1 >= ${maxAttempts}
          THEN ${now} + (${lockoutMs} * interval '1 millisecond')
        ELSE NULL
      END,
      "updatedAt" = ${now}
    WHERE
      "scope" = ${OTP_VERIFY_SCOPE}
      AND "key" = ${email}
      AND "windowEnd" > ${now}
    RETURNING "count"
  `;

  // If the window expired between read and update, reset window and record this failure.
  if (updatedRows.length === 0) {
    await upsertFreshWindow(OTP_VERIFY_SCOPE, email, attemptWindowMs);
  }
}

export async function clearOtpVerifyFailures(email: string): Promise<void> {
  await prisma.$executeRaw`
    DELETE FROM "auth_throttle"
    WHERE "scope" = ${OTP_VERIFY_SCOPE} AND "key" = ${email}
  `;
}
