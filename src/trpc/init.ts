// src/trpc/init.ts
import { initTRPC } from "@trpc/server";
import { prisma } from "@/lib/prisma";

// 👇 ctx الذي يصل لكل procedure
export async function createTRPCContext() {
  return {
    prisma,
    userId: "user_123",
  };
}

// 👇 أنشئ tRPC instance مع context
const t = initTRPC.context<Awaited<ReturnType<typeof createTRPCContext>>>().create();

// 👇 Export tools
export const createTRPCRouter = t.router;
export const publicProcedure = t.procedure;
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
