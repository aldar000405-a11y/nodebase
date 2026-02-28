import { createTRPCRouter } from "../init";
import { workflowsRouter } from "@/features/workflows/server/routers";
import { credentialsRouter } from "@/features/credentials/server/routers";
import { usersRouter } from "@/features/users/server/routers";

export const appRouter = createTRPCRouter({
  workflows: workflowsRouter,
  credentials: credentialsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
