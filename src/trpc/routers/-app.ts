import { projectsRouter } from "@/features/projects/server/routers";
import { projectVersionsRouter } from "@/features/projects/server/versions-router";
import { usersRouter } from "@/features/users/server/routers";
import { createTRPCRouter } from "../init";

export const appRouter = createTRPCRouter({
  projects: projectsRouter,
  projectVersions: projectVersionsRouter,
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
