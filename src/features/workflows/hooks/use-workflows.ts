// hook to fetch all workflows using suspense

import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useWorkflowsParams } from "./use-workflows-params";

export const useSuspenseWorkflows = () => {
  const trpc = useTRPC();
  const [params] = useWorkflowsParams();
  return useSuspenseQuery(trpc.workflows.getMany.queryOptions(params));
};

import { generateSlug } from "random-word-slugs"; // Added import

export const useCreateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const [params] = useWorkflowsParams(); // Assuming useWorkflowsParams provides filter/sort for getMany

  return useMutation(
    trpc.workflows.create.mutationOptions({
      // Optimistically update the workflows list
      onMutate: async (newWorkflowData) => {
        // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
        await queryClient.cancelQueries(
          trpc.workflows.getMany.queryOptions(params),
        );

        // Snapshot the previous value
        const previousWorkflows = queryClient.getQueryData(
          trpc.workflows.getMany.queryOptions(params),
        );

        // Optimistically update to the new value
        queryClient.setQueryData(
          trpc.workflows.getMany.queryOptions(params),
          (old) => {
            if (!old) return old;
            // Generate a temporary ID and slug for the optimistic item
            const tempId = `temp-${Date.now()}`;
            const tempName = `New Workflow ${generateSlug(1)}`; // Client-side slug gen
            return {
              ...old,
              items: [
                {
                  id: tempId,
                  name: tempName,
                  triggerCount: 0,
                  /* other defaults */ updatedAt: new Date(),
                  createdAt: new Date(),
                },
                ...old.items,
              ],
            };
          },
        );
        return { previousWorkflows }; // Context for onError
      },
      onError: (err, newWorkflowData, context) => {
        toast.error(`Failed to create workflow: ${err.message}`);
        // If the mutation fails, use the context for a rollback
        queryClient.setQueryData(
          trpc.workflows.getMany.queryOptions(params),
          context?.previousWorkflows,
        );
      },
      onSuccess: (data, variables, context) => {
        // After success, invalidate and let React Query refetch the real data.
        // The refetch will replace the optimistic entry with the server-confirmed one.
        void queryClient.invalidateQueries(
          trpc.workflows.getMany.queryOptions(params),
        );
        // The toast is now in NewWorkflowClient.tsx, which is fine.
      },
      onSettled: () => {
        // Ensure all workflows are up-to-date after mutation
        void queryClient.invalidateQueries(
          trpc.workflows.getMany.queryOptions(params),
        );
      },
    }),
  );
};

export const useRemoveWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.workflows.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflow "${data.name}" removed`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryFilter({ id: data.id }),
        );
      },
    }),
  );
};

// hook to fetch a single workflow using suspense

export const useSuspenseWorkflow = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.workflows.getOne.queryOptions({ id }));
};

export const useUpdateWorkflowName = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.workflows.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflows "${data.name}" updated successfully`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to update workflow: ${error.message}`);
      },
    }),
  );
};

export const useUpdateWorkflow = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  return useMutation(
    trpc.workflows.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflows "${data.name}" saved successfully`);
        queryClient.invalidateQueries(trpc.workflows.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.workflows.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to save workflow: ${error.message}`);
      },
    }),
  );
};

// hook to execute a workflow
export const useExecuteWorkflow = () => {
  const trpc = useTRPC();
  return useMutation(
    trpc.workflows.execute.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Workflows "${data.name}" executed successfully`);
      },
      onError: (error) => {
        toast.error(`Failed to execute workflow: ${error.message}`);
      },
    }),
  );
};
