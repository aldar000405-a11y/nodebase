import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { polarClient } from "@/lib/polar";
import { headers } from "next/headers";
import SuperJSON from "superjson";
import { getFromCache, setInCache } from "@/lib/cache"; // Import cache utility

// Initialize tRPC

export const createTRPCContext = async () => {
  const requestHeaders = await headers();
  const session = await auth.api.getSession({
    headers: requestHeaders,
  });

  let hasPremium = false;
  const userId = session?.user?.id;

  if (userId) {
    const cacheKey = `premiumStatus-${userId}`;
    let cachedStatus = getFromCache<{ hasPremium: boolean }>(cacheKey);

    if (cachedStatus) {
      hasPremium = cachedStatus.hasPremium;
    } else {
      try {
        const customer = await polarClient.customers.getStateExternal({
          externalId: userId,
        });
        hasPremium =
          customer.activeSubscriptions &&
          customer.activeSubscriptions.length > 0;
        setInCache(cacheKey, { hasPremium }, 1000 * 10); // Cache for 10 seconds
      } catch (error) {
        console.warn(
          `Failed to check premium status for user ${userId} in context:`,
          error,
        );
        hasPremium = false;
      }
    }
  }

  return {
    session,
    userId,
    prisma,
    hasPremium, // Added hasPremium to context
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
  const user = ctx.session?.user;

  if (!userId || !user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  return next({
    ctx: {
      ...ctx,
      userId,
      auth: {
        user: {
          ...user,
          id: userId,
        },
      },
    },
  });
});

// Premium procedure - only users with active subscriptions
export const premiumProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    if (!ctx.hasPremium) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message:
          "You must have an active subscription to access this resource",
      });
    }

    return next({ ctx });
  },
);
