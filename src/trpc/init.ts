import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { polarClient } from "@/lib/polar";
import { headers } from "next/headers";
import SuperJSON from "superjson";

// Initialize tRPC

export const createTRPCContext = async () => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  return {
    session,
    userId: session?.user?.id,
    prisma,
  };
};

export type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create({
  transformer: SuperJSON,
});

// tRPC exports
export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

// Protected procedure - only logged in users
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  const userId = ctx.userId ?? ctx.session?.user?.id;
  if (!userId) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId,
    },
  });
});

// Premium procedure - only users with active subscriptions
export const premiumProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  try {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.userId,
    });

    if (!customer.activeSubscriptions || customer.activeSubscriptions.length === 0) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You must have an active subscription to access this resource",
      });
    }
  } catch (error: unknown) {
    // If customer not found in Polar or any other error, treat as no subscription
    if (!(error instanceof TRPCError) && (error as { code?: unknown } | null)?.code !== "FORBIDDEN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You must have an active subscription to access this resource",
      });
    }

    throw error;
  }

  return next({ ctx });
});