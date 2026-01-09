import { generateSlug } from "random-word-slugs";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure, premiumProcedure } from "@/trpc/init";
import { z } from "zod";

export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure
    .input(z.object({}))
    .mutation(({ ctx }) => {
      return prisma.workflow.create({
        data: {
          name: generateSlug(3),
          userId: ctx.session!.user.id,
        },
      });
    }),
  remove: premiumProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
      return prisma.workflow.delete({
        where: {
          id: input.id,
          userId: ctx.session!.user.id,
        },
      });
    }),
  updateName: premiumProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return prisma.workflow.update({
        where: {
          id: input.id,
          userId: ctx.session!.user.id,
        },
        data: {
          name: input.name,
        },
      });
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ ctx, input }) => {
      return prisma.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.session!.user.id,
        },
      });
    }),
  getMany: protectedProcedure
    .query(({ ctx }) => {
      return prisma.workflow.findMany({
        where: {
          userId: ctx.session!.user.id,
        },
      });
    }),
});