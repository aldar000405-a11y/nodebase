CREATE TABLE "auth_throttle" (
  "id" TEXT NOT NULL,
  "scope" TEXT NOT NULL,
  "key" TEXT NOT NULL,
  "count" INTEGER NOT NULL DEFAULT 0,
  "window_start" TIMESTAMP(3) NOT NULL,
  "window_end" TIMESTAMP(3) NOT NULL,
  "locked_until" TIMESTAMP(3),
  "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updated_at" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "auth_throttle_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "auth_throttle_scope_key_key" ON "auth_throttle"("scope", "key");
CREATE INDEX "auth_throttle_scope_window_end_idx" ON "auth_throttle"("scope", "window_end");
