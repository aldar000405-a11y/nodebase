import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
import { z } from "zod";

export const usersRouter = createTRPCRouter({
  getUsers: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(10),
        offset: z.number().min(0).default(0),
      })
    )
    .query(async ({ ctx, input }) => {
      const users = await ctx.prisma.user.findMany({
        select: {
          id: true,
          name: true,
          email: true,
        },
        take: input.limit,
        skip: input.offset,
      });

      const total = await ctx.prisma.user.count();

      return { users, total };
    }),
});
