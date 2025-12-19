import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

export const appRouter = createTRPCRouter({
  testAI: protectedProcedure.mutation(async () => {
    const { text } = await generateText({
  model: google('gemini-2.5-flash'),
  prompt: 'Write a vegetarian lasagna recipe for 4 people.',
});

return text;
  }),
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany({
      where: {
        userId: ctx.userId,
      },
    });
  }),

  createWorkflow: protectedProcedure.mutation(async ({ ctx }) => {
    if (!ctx.auth?.user?.email) {
      throw new Error("User email is required to create a workflow");
    }

    await inngest.send({
      name: "test/hello.world",
      data: {
        email: ctx.auth.user.email,
      },
    });

    return prisma.workflow.create({
      data: {
        name: "test-workflow",
        userId: ctx.userId,
      },
    });
  }),
});

export type AppRouter = typeof appRouter;
