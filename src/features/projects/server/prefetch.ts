import type { inferInput } from "@trpc/tanstack-react-query";
import { prefetch, trpc } from "@/trpc/server";

type ProjectsInput = inferInput<typeof trpc.projects.getMany>;

//  prefetch all projects

export const prefetchProjects = (params: ProjectsInput) => {
  return prefetch(trpc.projects.getMany.queryOptions(params));
};

//  prefetch a single project

export const prefetchProject = (id: string) => {
  return prefetch(trpc.projects.getOne.queryOptions({ id }));
};
