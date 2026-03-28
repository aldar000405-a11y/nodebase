"use client";
import { formatDistanceToNow } from "date-fns";
import { FolderOpenIcon, Loader2Icon } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  type MouseEvent as ReactMouseEvent,
  type ReactNode,
  useState,
  useTransition,
} from "react";
import { ErrorBoundary } from "react-error-boundary";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityPagination,
  EntitySearch,
  ErrorView,
} from "@/components/entity-components";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { UpgradeModel } from "@/components/upgrade-model";
import { useHasActiveSubscription } from "@/features/subscriptions/hooks/use-subscription";
import type { Project } from "@/generated/prisma";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { trpc } from "@/trpc/client";
import { useRemoveProject, useSuspenseProjects } from "../hooks/use-projects";
import { useProjectsParams } from "../hooks/use-projects-params";

type ProjectListItem = Project;

export const ProjectsEmpty = () => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { hasActiveSubscription, isLoading, isFetching } =
    useHasActiveSubscription();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const handleCreate = () => {
    // Disabled per user request
    return;
  };

  return (
    <>
      <UpgradeModel open={upgradeOpen} onOpenChange={setUpgradeOpen} />
      <EmptyView
        onNew={handleCreate}
        message="You haven't created any projects yet.
              Get started by creating your first project."
      />
    </>
  );
};

export const ProjectsItem = ({ data }: { data: ProjectListItem }) => {
  const removeProject = useRemoveProject();
  const utils = trpc.useUtils();
  const router = useRouter();
  const [isNavigating, startTransition] = useTransition();

  const handleRemove = () => {
    removeProject.mutate({ id: data.id });
  };

  const handlePrefetch = () => {
    // Prefetch project data on hover for faster navigation
    void utils.projects.getOne.prefetch({ id: data.id });
  };

  const handleClick = (e: ReactMouseEvent) => {
    e.preventDefault();
    // Prevent double-click
    if (isNavigating) return;

    // Ensure data is prefetched before navigation
    void utils.projects.getOne.prefetch({ id: data.id });

    startTransition(() => {
      router.push(`/projects/${data.id}`);
    });
  };

  return (
    <EntityItem
      href={`/projects/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          {isNavigating ? (
            <Loader2Icon className="size-5 text-muted-foreground animate-spin" />
          ) : (
            <FolderOpenIcon className="size-5 text-muted-foreground" />
          )}
        </div>
      }
      onClick={handleClick}
      isNavigating={isNavigating}
      onRemove={handleRemove}
      isRemoving={removeProject.isPending}
      onPrefetch={handlePrefetch}
    />
  );
};

export const ProjectsSearch = () => {
  const [params, setParams] = useProjectsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Projects"
    />
  );
};

export const ProjectsList = () => {
  const projects = useSuspenseProjects();
  const items = projects.data.items ?? [];

  // Only show empty view if we're certain there are no items (not during loading)
  if (items.length === 0) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="max-w-sm mx-auto">
          <ProjectsEmpty />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-4">
      {items.map((project) => (
        <div key={project.id}>
          <ProjectsItem data={project as ProjectListItem} />
        </div>
      ))}
    </div>
  );
};

export const ProjectsHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const { hasActiveSubscription, isLoading, isFetching } =
    useHasActiveSubscription();
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  const handleCreate = () => {
    // Disabled per user request
    return;
  };

  return (
    <>
      <UpgradeModel open={upgradeOpen} onOpenChange={setUpgradeOpen} />
      <EntityHeader
        title="Projects"
        description="Create and manage AI-generated UX-to-UI prototype projects."
        onNew={handleCreate}
        newButtonLabel="New Project"
        disabled={true}
      />
    </>
  );
};

export const ProjectsPagination = () => {
  const projects = useSuspenseProjects();
  const [params, setParams] = useProjectsParams();

  return (
    <EntityPagination
      disabled={projects.isFetching}
      totalPages={projects.data.totalPages}
      page={projects.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

// Shell component - no data fetching, used as outer wrapper
export const ProjectsShell = ({ children }: { children: ReactNode }) => {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-8 h-full">
        <ProjectsHeader />
        <div className="gap-y-4 h-full flex flex-col">
          <ProjectsSearch />
          {children}
        </div>
      </div>
    </div>
  );
};

// Content component - contains all data-fetching components inside Suspense
export const ProjectsContent = () => {
  return (
    <div className="flex flex-col h-full gap-y-4">
      <ProjectsList />
      <ProjectsPagination />
    </div>
  );
};

// Legacy container for backwards compatibility
export const ProjectsContainer = ({ children }: { children: ReactNode }) => {
  return (
    <EntityContainer
      header={<ProjectsHeader />}
      search={<ProjectsSearch />}
      pagination={<ProjectsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const ProjectsLoading = () => {
  return (
    <div className="flex flex-col h-full gap-y-4">
      <div className="flex flex-col gap-y-4">
        {/* Skeleton cards matching project items */}
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
export const ProjectsError = ({ message }: { message?: string }) => {
  return <ErrorView message={message ?? "Error loading projects."} />;
};

export const ProjectsErrorBoundary = ({
  children,
}: {
  children: ReactNode;
}) => {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <ProjectsError
          message={error instanceof Error ? error.message : "Unknown error"}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};
