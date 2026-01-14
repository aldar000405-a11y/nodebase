"use client";
import { ErrorBoundary } from "react-error-boundary";
import { formatDistanceToNow } from "date-fns";
import { 
    EmptyView,
    EntityContainer, 
    EntityHeader, 
    EntityList, 
    EntityItem,
    EntityPagination, 
    EntitySearch, 
    ErrorView, 
    LoadingView
} from "@/components/entity-components";
import { useCreateWorkflow, useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { useUpgradeModel } from "@/hooks/use-upgrade-model";
import { useRouter } from "next/navigation";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import type { Workflow } from "@prisma/client";
import { WorkflowIcon } from "lucide-react";
import { trpc } from "@/trpc/client";

type WorkflowListItem = Workflow & {
    triggerCount: number;
};


export const WorkflowsEmpty = () => {
    const router = useRouter();
    const utils = trpc.useUtils();
    const createWorkflow = useCreateWorkflow();
    const { handleError, model } = useUpgradeModel();
    const handleCreate = () => {
        createWorkflow.mutate({}, {
            onError: (error) => {
                handleError(error);
            },
            onSuccess: async (data) => {
                await utils.workflows.getMany.invalidate();
                router.push(`/workflows/${data.id}`);
            }
        });
    };

   
    

    return (
        <>
            {model}
            <EmptyView
                onNew={handleCreate}
                message="You haven't created any workflows yet.
                 Get started by creating your first workflow."
            />
        </>
    );
};

export const WorkflowsItem = ({
    data,
}: {
    data: WorkflowListItem
}) => {
    const removeWorkflow = useRemoveWorkflow();

    const handleRemove = () => {
        removeWorkflow.mutate({ id: data.id });
    }
    return (
        <EntityItem 
        href={`/workflows/${data.id}`}
        title={data.name}
        subtitle={
            <>
            Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
            &bull; Created {formatDistanceToNow(data.createdAt, { addSuffix: true })}{" "}
            &bull; {data.triggerCount} trigger{data.triggerCount === 1 ? "" : "s"}
            </>
        }
        image={
            <div className="size-8 flex items-center justify-center">
                <WorkflowIcon className="size-5 text-muted-foreground"/>

            </div>
        }
        onRemove={handleRemove}
        isRemoving={removeWorkflow.isPending}
        />
    )
}

export const WorkflowsSearch = () => {
    const [params, setParams] = useWorkflowsParams();
    const { searchValue, onSearchChange } = useEntitySearch({
        params,
        setParams,

    })
    return (
        <EntitySearch 
        value={searchValue}
        onChange={onSearchChange}
        placeholder="Search Workflows"
        />
    )
}

export const WorkflowsList = () => {
    const workflows = useSuspenseWorkflows();
    return (
        <EntityList 
        items={workflows.data.items ?? []}
        getKey={(workflow) => workflow.id}
        renderItem={(workflow) => <WorkflowsItem data={workflow as WorkflowListItem} />}
        emptyView={<WorkflowsEmpty />} 
        />
    )
};

export const WorkflowsHeader = ({disabled}: {
    disabled?: boolean}) => {
        const createWorkflow = useCreateWorkflow();
        const router = useRouter();
        const utils = trpc.useUtils();
        const { handleError, model } = useUpgradeModel();
        const handleCreate = async () => {
            try {
                const data = await createWorkflow.mutateAsync({});
                await utils.workflows.getMany.invalidate();
                router.push(`/workflows/${data.id}`);
            } catch (error) {
                handleError(error);
            }
        };

    return (
        <>
            {model}
            <EntityHeader 
                title="Workflows" 
                description="Automate your tasks with workflows."
                onNew={handleCreate}
                newButtonLabel="New Workflow"
                disabled={disabled}
                isCreating={createWorkflow.isPending}
            />
        </>
    );
};

export const WorkflowsPagination = () => {
    const workflows = useSuspenseWorkflows();
    const [params, setParams] = useWorkflowsParams();

    return (
        <EntityPagination 
        disabled={workflows.isFetching}
        totalPages={workflows.data.totalPages}
        page={workflows.data.page}
        onPageChange={(page) => setParams({...params, page})}
        />
    );
};

export const WorkflowsContainer = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <EntityContainer
        header={<WorkflowsHeader />}
        search={<WorkflowsSearch />}
        pagination={<WorkflowsPagination />}
        >
        {children}

        </EntityContainer>
    );
};

export const WorkflowsLoading = () => {
    return <LoadingView message="Loading workflows..."  />;
};
export const WorkflowsError = ({ message }: { message?: string }) => {
    return <ErrorView message={message ?? "Error loading workflows."}  />;
};



export const WorkflowsErrorBoundary = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <ErrorBoundary
            fallbackRender={({ error }) => <WorkflowsError message={error.message} />}
        >
            {children}
        </ErrorBoundary>
    );
};