import { generateSlug } from "random-word-slugs";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure, premiumProcedure } from "@/trpc/init";
import { z } from "zod";
import { PAGINATION } from "@/config/constants";


export const workflowsRouter = createTRPCRouter({
  create: premiumProcedure
    .input(z.object({}))
    .mutation(({ ctx }) => {
      return prisma.workflow.create({
        data: {
          name: generateSlug(3),
          userId: ctx.session!.user.id,
          triggers: {
            create: {
              type: "manual",
            },
          },
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
  getMnay: protectedProcedure
    .input(
      z.object({ 
        id: z.string() }))
    .query(({ ctx, input }) => {
      return prisma.workflow.findUnique({
        where: {
          id: input.id,
          userId: ctx.session!.user.id,
        },
      });
    }),
  getMany: protectedProcedure
  .input(
    z.object({
      page: z.number().default(PAGINATION.DEFAULT_PAGE),
      pageSize: z
      .number()
      .min(PAGINATION.MIN_PAGE_SIZE)
      .max(PAGINATION.MAX_PAGE_SIZE).
      default(PAGINATION.DEFAULT_PAGE_SIZE),
      search: z.string().default(""),
    })
  )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const trimmedSearch = search.trim();
      const where = {
        userId: ctx.session!.user.id,
        ...(trimmedSearch
          ? {
              name: {
                contains: trimmedSearch,
                mode: "insensitive" as const,
              },
            }
          : {}),
      };

      const [workflows, totalCount] = await Promise.all([
        prisma.workflow.findMany({
          skip:  (page - 1) * pageSize,
          take: pageSize,
          where,
          include: {
            _count: {
              select: {
                triggers: true,
              },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.workflow.count({
          where,
        }),
      ]);

      const items = workflows.map(({ _count, ...workflow }) => ({
        ...workflow,
        triggerCount: _count.triggers,
      }));

      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
      const totalSize = items.length;
      const hasNextPage =  page < totalPages,
      hasPreviousPage = page > 1;

      return {
        items:items,
        page,
        pageSize,
        totalSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage

      }

    
     
      }),
    });
