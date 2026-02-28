// hook to fetch all workflows using suspense

import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useCredentialsParams } from "./use-credentials-params";
import type { CredentialType } from "@/generated/prisma";


export const useSuspenseCredentials = () => {
  const trpc = useTRPC();
  const [params] = useCredentialsParams();
  return useSuspenseQuery(trpc.credentials.getMany.queryOptions(params));
};


export const useCreateCredentials = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.create.mutationOptions({
     onSuccess: (data) => {
        toast.success(`Credential "${data.name}" created successfully`);
       queryClient.invalidateQueries(
          trpc.credentials.getMany.queryOptions({}),
       );
      },
      onError: (error) => {
        toast.error(`Failed to create credential: ${error.message}`);
      },
    }),
  );
};

export const useRemoveCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.remove.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" removed`);
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryFilter({ id: data.id }),
        );
      },
    }),
  );
};

// hook to fetch a single credential using suspense

export const useSuspenseCredential = (id: string) => {
  const trpc = useTRPC();
  return useSuspenseQuery(trpc.credentials.getOne.queryOptions({ id }));
};



export const useUpdateCredential = () => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  return useMutation(
    trpc.credentials.update.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Credential "${data.name}" saved successfully`);
        queryClient.invalidateQueries(trpc.credentials.getMany.queryOptions({}));
        queryClient.invalidateQueries(
          trpc.credentials.getOne.queryOptions({ id: data.id }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to save credential: ${error.message}`);
      },
    }),
  );
};

export const useCredentialsByType = (type: CredentialType) => {
  const trpc = useTRPC();
  return useQuery(trpc.credentials.getByType.queryOptions({ type }));
};

