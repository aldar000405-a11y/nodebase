import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";

export const createTRPCContext = async () => {
  let session = null;
  let dbConnected = true;
  
  try {
    // Test database connection first
    await prisma.$queryRaw`SELECT 1`;
    
    // Get session from auth
    session = await auth.api.getSession({
      headers: await headers(),
    });
  } catch (error) {
    dbConnected = false;
    console.error("Database or session error:", error instanceof Error ? error.message : error);
    // Continue without session if database is unavailable
  }

  return {
    session,
    userId: session?.user?.id ?? null,
    prisma,
    dbConnected,
  };
};

type TRPCContext = Awaited<ReturnType<typeof createTRPCContext>>;

const t = initTRPC.context<TRPCContext>().create({});

// tRPC exports
export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

// Protected procedure
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  // تمرير session و userId إلى ctx للـ procedures اللاحقة
  return next({
    ctx: {
      ...ctx,
      userId: ctx.session.user.id,
      auth: ctx.session,
    },
  });
});


