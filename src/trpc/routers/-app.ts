import { createTRPCRouter } from "../init";
import { workflowsRouter } from "@/features/workflows/server/routers";
import { usersRouter } from "@/features/users/server/routers"; // Import usersRouter

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  users: usersRouter, // Add usersRouter here
});

export type AppRouter = typeof appRouter;
