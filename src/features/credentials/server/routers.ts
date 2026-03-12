import { prisma } from "@/lib/prisma";
import {
  createTRPCRouter,
  protectedProcedure,
  premiumProcedure,
} from "@/trpc/init";
import z from "zod";
import { PAGINATION } from "@/config/constants";
import { CredentialType } from "@/generated/prisma";
import { encrypt } from "@/lib/encryption";

export const credentialsRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1, "Name is required"),
      type: z.nativeEnum(CredentialType),
      value: z.string().min(1, "Value is required"),
    })
  )
    .mutation(({ ctx, input }) => {
      const { name, value, type } = input;
      return prisma.credential.create({
        data: {
          name,
          userId: ctx.auth.user.id,
          type,
          value: encrypt(value.trim()),
        },
      });
    }),

  remove: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ ctx, input }) => {
        return prisma.credential.delete({
          where: { id: input.id,
             userId: ctx.auth.user.id 
            },
        
    })
  }),

  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1, "Name is required"),
        value: z.string().optional(),
      }),
    )
    .mutation(({ ctx, input }) => {
      const { id, name, value } = input;

      return prisma.credential.update({
        where: {id, userId: ctx.auth.user.id },
        data: {
          name,
          ...(value ? { value: encrypt(value.trim()) } : {}),
        }
      });
    }),
  getOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const credential = await prisma.credential.findUniqueOrThrow({
        where: { id: input.id, userId: ctx.auth.user.id },
        select: {
          id: true,
          name: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
          value: true,
        },
      });
      return {
        ...credential,
        value: undefined,
        hasValue: !!credential.value,
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
      const [workflows, totalCount] = await Promise.all([
        prisma.credential.findMany({
          skip: (page - 1) * pageSize,
          take: pageSize,
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: trimmedSearch,
              mode: "insensitive",
            },
          },
          select: {
            id: true,
            name: true,
            type: true,
            createdAt: true,
            updatedAt: true,
            userId: true,
            _count: {
              select: { Node: true },
            },
          },
          orderBy: {
            updatedAt: "desc",
          },
        }),
        prisma.credential.count({
          where: {
            userId: ctx.auth.user.id,
            name: {
              contains: trimmedSearch,
              mode: "insensitive",
            },
          }
        }),
      ]);

      const items = workflows.map((c) => ({
        ...c,
        triggerCount: c._count.Node,
      }));

      const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
      const totalSize = items.length;
      const hasNextPage = page < totalPages;
      const hasPreviousPage = page > 1;

      return {
        items,
        page,
        pageSize,
        totalSize,
        totalCount,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      };
    }),
    getByType: protectedProcedure
    .input(z.object({ type: z.enum(CredentialType), }))
    .query( ({ ctx, input }) => {
      const { type } = input;
      return prisma.credential.findMany({
        where: { type, userId: ctx.auth.user.id },
        select: {
          id: true,
          name: true,
          type: true,
          createdAt: true,
          updatedAt: true,
          userId: true,
        },
        orderBy: {
          updatedAt: "desc",
        },
      });
     }),
});
