import { inngest } from "@/inngest/client";
import { baseProcedure, createTRPCRouter, protectedProcedure } from "../init";
import { prisma } from "@/lib/prisma";
import { TRPCError } from "@trpc/server";

export const appRouter = createTRPCRouter({
  testAI: baseProcedure.mutation(async () => {
    try {
      console.log("testAI mutation called - publishing event to Inngest");
      // Send event to Inngest in background, completely non-blocking
      setImmediate(() => {
        inngest.send({
          name: "execute/ai",
          data: { 
            prompt: "Write a vegetarian lasagna recipe for 4 people.",
          },
        }).then(() => {
          console.log("Event published successfully to Inngest");
        }).catch((err: any) => {
          console.error("Inngest send error:", err);
        });
      });

      return { success: true, message: "AI execution triggered" };
    } catch (error: any) {
      console.error("testAI error:", error);
      throw error;
    }
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

    // Send event to Inngest in background, completely non-blocking
    setImmediate(() => {
      inngest.send({
        name: "test/hello.world",
        data: {
          email: ctx.auth.user.email,
        },
      }).catch((err: any) => {
        console.error("Inngest send error:", err);
      });
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
