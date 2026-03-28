import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { toast } from "sonner";
import { useTRPC } from "@/trpc/client";

export const useSuspenseProjects = () => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.projects.getMany.queryOptions({}));
};

export const useCreateProject = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.projects.create.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Project "${data.name}" created successfully`);
        queryClient.invalidateQueries({
          queryKey: trpc.projects.getMany.queryOptions({}).queryKey,
          refetchType: "all",
        });
      },
      onError: (error) => {
        toast.error(`Failed to create project: ${error.message}`);
      },
    }),
  );
};

export const useRemoveProject = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.projects.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Project "${data.name}" removed`);
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.projects.getOne.queryFilter({ id: data.id }),
        );
      },
    }),
  );
};

export const useSuspenseProject = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.projects.getOne.queryOptions({ id }));
};

export const useUpdateProjectName = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.projects.updateName.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Project "${data.name}" updated successfully`);
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.projects.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to update project: ${error.message}`);
      },
    }),
  );
};

export const useUpdateProjectCanvas = ({
  silent = false,
}: {
  silent?: boolean;
} = {}) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.projects.updateCanvas.mutationOptions({
      onSuccess: (data) => {
        if (!silent) {
          toast.success(`Project "${data.name}" saved successfully`);
        }
        queryClient.invalidateQueries(trpc.projects.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.projects.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to save project: ${error.message}`);
      },
    }),
  );
};
