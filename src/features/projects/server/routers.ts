import { TRPCError } from "@trpc/server";
import { generateSlug } from "random-word-slugs";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import {
  createTRPCRouter,
  premiumProcedure,
  protectedProcedure,
} from "@/trpc/init";
import { uxBriefSchema } from "./schema";

const canvasNodeSchema = z.object({
  id: z.string(),
  type: z.string().optional(),
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.string(), z.unknown()).optional(),
});

const canvasEdgeSchema = z.object({
  id: z.string().optional(),
  source: z.string(),
  target: z.string(),
  sourceHandle: z.string().nullish(),
  targetHandle: z.string().nullish(),
  data: z.record(z.string(), z.unknown()).optional(),
});

export const projectsRouter = createTRPCRouter({
  create: protectedProcedure.input(z.void()).mutation(async ({ ctx }) => {
    if (!ctx.hasPremium) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "You must have an active subscription to create projects.",
      });
    }

    return prisma.project.create({
      data: {
        name: generateSlug(3),
        platform: "DESKTOP",
        status: "QUEUED",
        healthScore: 100,
        userId: ctx.userId,
        journeyNodes: [],
        journeyEdges: [],
      },
    });
  }),

  remove: premiumProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.id,
          userId: ctx.userId,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const deletedProject = await prisma.project.update({
        where: { id: project.id },
        data: { deletedAt: new Date() },
      });

      return deletedProject;
    }),

  updateName: protectedProcedure
    .input(z.object({ id: z.string(), name: z.string().min(1) }))
    .mutation(({ ctx, input }) => {
      return prisma.project.update({
        where: { id: input.id, userId: ctx.auth.user.id },
        data: { name: input.name },
      });
    }),

  updateCanvas: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        nodes: z.array(canvasNodeSchema),
        edges: z.array(canvasEdgeSchema),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.findUnique({
        where: { id: input.id, userId: ctx.auth.user.id },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return prisma.project.update({
        where: { id: input.id, userId: ctx.auth.user.id },
        data: {
          journeyNodes: input.nodes as unknown as Prisma.InputJsonValue,
          journeyEdges: input.edges as unknown as Prisma.InputJsonValue,
        },
      });
    }),

  saveUxBrief: protectedProcedure
    .input(
      z.object({
        projectId: z.string().min(1),
        uxBrief: uxBriefSchema,
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.projectId,
          userId: ctx.auth.user.id,
        },
        select: { id: true },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return prisma.project.update({
        where: { id: project.id },
        data: {
          uxBrief: input.uxBrief as unknown as Prisma.InputJsonValue,
        },
        select: {
          id: true,
          updatedAt: true,
        },
      });
    }),

  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await prisma.project.findUniqueOrThrow({
        where: { id: input.id, userId: ctx.auth.user.id },
      });

      const nodes = Array.isArray(project.journeyNodes)
        ? project.journeyNodes
        : [];
      const edges = Array.isArray(project.journeyEdges)
        ? project.journeyEdges
        : [];

      return {
        ...project,
        nodes,
        edges,
      };
    }),

  getMany: protectedProcedure
    .input(
      z.object({
        page: z.number().default(PAGINATION.DEFAULT_PAGE),
        pageSize: z
          .number()
          .min(PAGINATION.MIN_PAGE_SIZE)
          .max(PAGINATION.MAX_PAGE_SIZE)
          .default(PAGINATION.DEFAULT_PAGE_SIZE),
        search: z.string().default(""),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { page, pageSize, search } = input;

      const trimmedSearch = search.trim();
      const where = {
        userId: ctx.auth.user.id,
        deletedAt: null,
        ...(trimmedSearch
          ? {
              name: {
                contains: trimmedSearch,
                mode: "insensitive" as const,
              },
            }
          : {}),
      };

      const [projects, totalCount] = await Promise.all([
        prisma.project.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where,
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.project.count({ where }),
      ]);

      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
      const totalSize = projects.length;

      return {
        items: projects,
        page,
        pageSize,
        totalSize,
        totalCount,
        totalPages,
        hasNextPage: page < totalPages,
        hasPreviousPage: page > 1,
      };
    }),
});
