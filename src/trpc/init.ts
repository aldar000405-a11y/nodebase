// src/trpc/init.ts
import { initTRPC } from "@trpc/server";
import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
import { TRPCError } from "@trpc/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// 👇 ctx الذي يصل لكل procedure
export async function createTRPCContext(
  opts?: FetchCreateContextFnOptions
) {
  let userId: string | null = null;

  if (opts?.req) {
    try {
      const session = await auth.api.getSession({
        headers: opts.req.headers,
      });
      userId = session?.user?.id ?? null;
    } catch {
      userId = null;
    }
  }

  return {
    prisma,
    userId,
  };
}

// 👇 أنشئ tRPC instance مع context
const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create();

// 👇 Export tools
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }

  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId,
    },
  });
});
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
