import { createTRPCRouter, protectedProcedure } from "@/trpc/init";
export const usersRouter = createTRPCRouter({
  getUsers: protectedProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }),
});
