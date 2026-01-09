// hook to fetch all workflows using suspense

import { useTRPC } from "@/trpc/client"
import { useSuspenseQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

export const useSuspenseWorkflows = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();
    
    return useSuspenseQuery({
        queryKey: ["workflows", "getMany"],
        queryFn: () => trpc.workflows.getMany.query(),
    });
};

// hook to create a new workflow

export const useCreateWorkflow = () => {
    const trpc = useTRPC();
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: () => trpc.workflows.create.mutate({}),
        onSuccess: (data: any) => {
            toast.success(`workflow "${data.name}" created`);
            queryClient.invalidateQueries(
                { queryKey: ["workflows", "getMany"] },
            );
        },
        onError: (error) => {
            toast.error(`Failed to create workflow: ${error.message}`);
        },
    });
};