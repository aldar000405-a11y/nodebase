

// import { create } from "domain";
// import {  createTRPCRouter, protectedProcedure } from "../init";
// // import { prisma } from "@/lib/prisma";
// import prisma from '@/lib/db'
// import { promise } from "zod";
// import { resolve } from "path";
// import { setTimeout } from "timers/promises";

// export const appRouter = createTRPCRouter({
// getWorkflows: protectedProcedure.query(({ctx}) => {
//  return prisma.workflow.findMany();
// }),
// createWorkflow: protectedProcedure.mutation(async () 
// => {

// // fetch the video

//   await new promise((resolve) => setTimeout(resolve,
//     5_0000));

// // describe the video

//   await new promise((resolve) => setTimeout(resolve,
//     5_0000));

//     // send the transcription to openAI
//   await new promise((resolve) => setTimeout(resolve,
//     5_0000));
  
  
//   return prisma.workflow.create({
//     data: {
//       name: "test-workflow"
//     },
//   });
// }),

// });

  
//   export type AppRouter = typeof appRouter;



// import { inngest } from "@/inngest/client";
// import { createTRPCRouter, protectedProcedure } from "../init";
// import prisma from "@/lib/db";
// import { email } from "zod";


// export const appRouter = createTRPCRouter({
//   getWorkflows: protectedProcedure.query(() => {
//     return prisma.workflow.findMany();
//   }),

//   createWorkflow: protectedProcedure.mutation(async () => {
// await inngest.send({
//   name: "test/hello.world",
//   data: {
//     email: "mohummad@gmail.com"
//   },
// });

//     return prisma.workflow.create({
//       data: { name: "test-workflow" },
//     });
//   }),
// });

// export type AppRouter = typeof appRouter;


import { inngest } from "@/inngest/client";
import { createTRPCRouter, protectedProcedure } from "../init";
import prisma from "@/lib/db";

export const appRouter = createTRPCRouter({
  getWorkflows: protectedProcedure.query(({ ctx }) => {
    return prisma.workflow.findMany({
      where: {
        userId: ctx.userId,
      },
    });
  }),

  createWorkflow: protectedProcedure.mutation(async ({ ctx }) => {
    await inngest.send({
      name: "test/hello.world",
      data: {
        email: ctx.auth?.user?.email,
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
