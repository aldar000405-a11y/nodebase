// src/features/users/server/routers.ts
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const usersRouter = createTRPCRouter({
  getPremiumStatus: protectedProcedure.query(async ({ ctx }) => {
    // ctx.hasPremium is already efficiently calculated and available here
    return { hasPremium: ctx.hasPremium };
  }),
});
