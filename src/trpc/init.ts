// src/trpc/init.ts
import { initTRPC } from "@trpc/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// 👇 ctx الذي يصل لكل procedure
export async function createTRPCContext(opts?: { req?: Request }) {
  let session = null;
  if (opts?.req) {
    session = await auth.api.getSession({ headers: opts.req.headers });
  } else {
    // For server components
    const { headers } = await import("next/headers");
    const headersList = await headers();
    session = await auth.api.getSession({ headers: headersList });
  }
  return {
    prisma,
    userId: session?.user?.id || null,
  };
}

// 👇 أنشئ tRPC instance مع context
const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create();

// 👇 Export tools
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new Error("Unauthorized");
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
