// hook to fetch all workflows using suspense

import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import {
  useSuspenseQuery
} from "@tanstack/react-query";
import { useExecutionsParams } from "./use-executions-params";


export const useSuspenseExecutions = () => {
  const trpc = useTRPC();
  const [params] = useExecutionsParams();
  return useSuspenseQuery(trpc.executions.getMany.queryOptions(params));
};


// hook to fetch a single execution using suspense

export const useSuspenseExecution = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.executions.getOne.queryOptions({ id }));
};


