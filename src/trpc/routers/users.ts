import { createTRPCRouter, publicProcedure } from "@/trpc/init";
import { z } from "zod";
import { randomUUID } from "crypto";

export const usersRouter = createTRPCRouter({
  getUsers: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.user.findMany();
  }),

  create: publicProcedure
    .input(
      z.object({
        email: z.string().email(),
        password: z.string().min(6),
        name: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const id = randomUUID();
      // NOTE: password should be hashed in production. This is a demo.
      return ctx.prisma.user.create({
        data: {
          id,
          email: input.email,
          name: input.name ?? "",
        },
      });
    }),
});
