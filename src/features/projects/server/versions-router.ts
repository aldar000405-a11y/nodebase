import { TRPCError } from "@trpc/server";
import z from "zod";
import type { Prisma } from "@/generated/prisma";
import { prisma } from "@/lib/prisma";
import { createTRPCRouter, protectedProcedure } from "@/trpc/init";

export const projectVersionsRouter = createTRPCRouter({
  createVersion: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
        name: z.string().min(1).optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.projectId,
          userId: ctx.userId,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const lastVersion = await prisma.projectVersion.findFirst({
        where: { projectId: input.projectId },
        orderBy: { versionNum: "desc" },
        select: { versionNum: true },
      });

      const nextVersionNum = (lastVersion?.versionNum ?? 0) + 1;

      return prisma.projectVersion.create({
        data: {
          projectId: input.projectId,
          versionNum: nextVersionNum,
          name: input.name,
        },
      });
    }),

  getVersions: protectedProcedure
    .input(
      z.object({
        projectId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const project = await prisma.project.findFirst({
        where: {
          id: input.projectId,
          userId: ctx.userId,
        },
        select: { id: true },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return prisma.projectVersion.findMany({
        where: { projectId: input.projectId },
        orderBy: { versionNum: "desc" },
        include: {
          uxInputs: {
            select: {
              id: true,
              fileName: true,
              fileType: true,
              createdAt: true,
            },
            orderBy: { createdAt: "desc" },
          },
        },
      });
    }),

  addUxInput: protectedProcedure
    .input(
      z.object({
        projectVersionId: z.string(),
        fileName: z.string().min(1),
        fileType: z.string().min(1),
        fileUrl: z.string().url().optional(),
        extractedText: z.string().optional(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const version = await prisma.projectVersion.findFirst({
        where: {
          id: input.projectVersionId,
          project: {
            userId: ctx.userId,
          },
        },
        select: { id: true },
      });

      if (!version) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project version not found",
        });
      }

      return prisma.uxInput.create({
        data: {
          projectVersionId: input.projectVersionId,
          fileName: input.fileName,
          fileType: input.fileType,
          fileUrl: input.fileUrl,
          extractedText: input.extractedText,
        },
      });
    }),

  getUiSchema: protectedProcedure
    .input(
      z.object({
        projectVersionId: z.string(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const version = await prisma.projectVersion.findFirst({
        where: {
          id: input.projectVersionId,
          project: {
            userId: ctx.userId,
          },
        },
        select: { id: true },
      });

      if (!version) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project version not found",
        });
      }

      return prisma.uiSchema.findFirst({
        where: { projectVersionId: input.projectVersionId },
        orderBy: { createdAt: "desc" },
      });
    }),

  generateMockUiSchema: protectedProcedure
    .input(
      z.object({
        projectVersionId: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const version = await prisma.projectVersion.findFirst({
        where: {
          id: input.projectVersionId,
          project: {
            userId: ctx.userId,
          },
        },
        include: {
          project: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!version) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project version not found",
        });
      }

      const dashboardSchema = {
        id: "root-dashboard",
        type: "container",
        props: {
          className: "space-y-4",
        },
        children: [
          {
            id: "ai-insight-card",
            type: "card",
            props: {
              title: "AI Insights",
              description:
                "Based on UX data, users abandon the flow before final confirmation. The highest-impact fix is simplifying the checkout summary and reducing form friction.",
              className: "shadow-none",
            },
          },
          {
            id: "conversion-chart",
            type: "chart",
            props: {
              chartType: "conversion-funnel",
              className:
                "rounded-md border bg-muted/30 p-6 text-sm text-muted-foreground",
            },
          },
          {
            id: "prototype-container",
            type: "container",
            props: {
              className: "space-y-2 rounded-md border p-4",
            },
            children: [
              {
                id: "prototype-title",
                type: "typography",
                props: {
                  variant: "h1",
                  text: `${version.project.name} - Improved Checkout`,
                  className: "text-lg font-semibold",
                },
              },
              {
                id: "prototype-description",
                type: "typography",
                props: {
                  variant: "p",
                  text: "A streamlined checkout with reduced fields and clearer pricing summary.",
                  className: "text-sm text-muted-foreground",
                },
              },
              {
                id: "prototype-button",
                type: "button",
                props: {
                  text: "Complete Purchase",
                  variant: "default",
                },
              },
            ],
          },
        ],
      };

      return prisma.uiSchema.create({
        data: {
          projectVersionId: input.projectVersionId,
          screenName: "AI Dashboard Preview",
          screenPath: "/ai-dashboard",
          jsonSchema: dashboardSchema as Prisma.InputJsonValue,
        },
      });
    }),
});
