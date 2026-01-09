import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";
import { polarClient } from "@/lib/polar";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { cache } from "react";

export const createTRPCContext = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  
  return {
    session,
    userId: session?.user?.id ?? null,
  };
});

type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create();

// tRPC exports
export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

// Protected procedure - only logged in users
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session?.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }
  return next({ ctx });
});

// Premium procedure - only users with active subscriptions
export const premiumProcedure = protectedProcedure.use(async ({ ctx, next }) => {
  try {
    const customer = await polarClient.customers.getStateExternal({
      externalId: ctx.session!.user.id,
    });
    if (!customer.activeSubscriptions || customer.activeSubscriptions.length === 0) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You must have an active subscription to access this resource",
      });
    }
  } catch (error: any) {
    // If customer not found in Polar or any other error, treat as no subscription
    if (error.code !== "FORBIDDEN") {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You must have an active subscription to access this resource",
      });
    }
    throw error;
  }
  return next({ ctx });
});