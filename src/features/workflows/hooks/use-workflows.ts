// hook to fetch all workflows using suspense

import { trpc } from "@/trpc/client"
import { toast } from "sonner";
import { useWorkflowsParams } from "./use-workflows-params";
import { PAGINATION } from "@/config/constants";
import { useMemo } from "react";

export const useSuspenseWorkflows = () => {
    const [params] = useWorkflowsParams();

    const input = useMemo(
        () => ({
            page: params.page ?? PAGINATION.DEFAULT_PAGE,
            pageSize: params.pageSize ?? PAGINATION.DEFAULT_PAGE_SIZE,
            search: params.search ?? "",
        }),
        [params.page, params.pageSize, params.search],
    );

    const [data, query] = trpc.workflows.getMany.useSuspenseQuery(input, {
        staleTime: 30_000,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        refetchOnReconnect: false,
    });
    return { ...query, data };
};

// hook to create a new workflow

export const useCreateWorkflow = () => {
    const utils = trpc.useUtils();

    return trpc.workflows.create.useMutation({
        onSuccess: async (data) => {
            toast.success(`workflow "${data.name}" created successfully`);
            await utils.workflows.getMany.invalidate();
        },
        onError: (error) => {
            toast.error(`Failed to create workflow: ${error.message}`);
        },
    });
};