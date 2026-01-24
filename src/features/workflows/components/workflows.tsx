"use client";
import { ErrorBoundary } from "react-error-boundary";
import { formatDistanceToNow } from "date-fns";
import {
    EmptyView,
    EntityContainer,
    EntityHeader,
    EntityItem,
    EntityPagination,
    EntitySearch,
    ErrorView,
} from "@/components/entity-components";
import { useRemoveWorkflow, useSuspenseWorkflows } from "../hooks/use-workflows";
import { useRouter } from "next/navigation";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useWorkflowsParams } from "../hooks/use-workflows-params";
import type { Workflow } from "@/generated/prisma";
import { Loader2Icon, WorkflowIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { trpc } from "@/trpc/client";
import { useTransition } from "react";

type WorkflowListItem = Workflow & {
    triggerCount: number;
};


export const WorkflowsEmpty = () => {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    
    const handleCreate = () => {
        if (isPending) return;
        startTransition(() => {
            router.push("/workflows/new");
        });
    };

   
    

    return (
        <EmptyView
            onNew={handleCreate}
            message="You haven't created any workflows yet.
              Get started by creating your first workflow."
        />
    );
};

export const WorkflowsItem = ({
    data,
}: {
    data: WorkflowListItem
}) => {
    const removeWorkflow = useRemoveWorkflow();
    const utils = trpc.useUtils();
    const router = useRouter();
    const [isNavigating, startTransition] = useTransition();

    const handleRemove = () => {
        removeWorkflow.mutate({ id: data.id });
    }

    const handlePrefetch = () => {
        // Prefetch workflow data on hover for faster navigation
        void utils.workflows.getOne.prefetch({ id: data.id });
    }
    
    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault();
        // Prevent double-click
        if (isNavigating) return;
        
        // Ensure data is prefetched before navigation
        void utils.workflows.getOne.prefetch({ id: data.id });
        
        startTransition(() => {
            router.push(`/workflows/${data.id}`);
        });
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
                {isNavigating ? (
                    <Loader2Icon className="size-5 text-muted-foreground animate-spin"/>
                ) : (
                    <WorkflowIcon className="size-5 text-muted-foreground"/>
                )}
            </div>
        }
        onClick={handleClick}
        isNavigating={isNavigating}
        onRemove={handleRemove}
        isRemoving={removeWorkflow.isPending}
        onPrefetch={handlePrefetch}
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
    const items = workflows.data.items ?? [];
    
    // Only show empty view if we're certain there are no items (not during loading)
    if (items.length === 0) {
        return (
            <div className="flex-1 flex justify-center items-center">
                <div className="max-w-sm mx-auto">
                    <WorkflowsEmpty />
                </div>
            </div>
        );
    }
    
    return (
        <div className="flex flex-col gap-y-4">
            {items.map((workflow) => (
                <div key={workflow.id}>
                    <WorkflowsItem data={workflow as WorkflowListItem} />
                </div>
            ))}
        </div>
    );
};

export const WorkflowsHeader = ({disabled}: {
    disabled?: boolean}) => {
        const router = useRouter();
        const [isPending, startTransition] = useTransition();
        
        const handleCreate = () => {
            if (isPending) return;
            startTransition(() => {
                router.push("/workflows/new");
            });
        };

    return (
        <EntityHeader 
            title="Workflows" 
            description="Automate your tasks with workflows."
            onNew={handleCreate}
            newButtonLabel="New Workflow"
            disabled={disabled}
            isCreating={isPending}
        />
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

// Shell component - no data fetching, used as outer wrapper
export const WorkflowsShell = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <div className="p-4 md:px-10 md:py-6 h-full">
            <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-8 h-full">
                <WorkflowsHeader />
                <div className="gap-y-4 h-full flex flex-col">
                    <WorkflowsSearch />
                    {children}
                </div>
            </div>
        </div>
    );
};

// Content component - contains all data-fetching components inside Suspense
export const WorkflowsContent = () => {
    return (
        <div className="flex flex-col h-full gap-y-4">
            <WorkflowsList />
            <WorkflowsPagination />
        </div>
    );
};

// Legacy container for backwards compatibility
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
    return (
        <div className="flex flex-col h-full gap-y-4">
            <div className="flex flex-col gap-y-4">
                {/* Skeleton cards matching workflow items */}
                {["skeleton-1", "skeleton-2", "skeleton-3"].map((key) => (
                    <Card key={key} className="p-4 shadow-none">
                        <CardContent className="flex flex-row items-center justify-between p-0">
                            <div className="flex items-center gap-3">
                                <Skeleton className="size-8 rounded" />
                                <div className="space-y-2">
                                    <Skeleton className="h-4 w-32" />
                                    <Skeleton className="h-3 w-48" />
                                </div>
                            </div>
                            <Skeleton className="size-8 rounded" />
                        </CardContent>
                    </Card>
                ))}
            </div>
            {/* Skeleton pagination */}
            <div className="flex justify-between items-center gap-x-2 w-full">
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center space-x-2">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-8 w-16" />
                </div>
            </div>
        </div>
    );
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