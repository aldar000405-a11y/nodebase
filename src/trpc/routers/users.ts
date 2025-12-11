import { createTRPCRouter, publicProcedure } from "@/trpc/init";

export const usersRouter = createTRPCRouter({
  getUsers: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),
});
