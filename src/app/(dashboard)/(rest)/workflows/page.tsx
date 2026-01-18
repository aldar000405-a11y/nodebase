import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import {
  WorkflowsContent,
  WorkflowsErrorBoundary,
  WorkflowsLoading,
  WorkflowsShell,
} from "@/features/workflows/components/workflows";
import type { SearchParams } from "nuqs/server";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";


type Props = {
  searchParams: Promise<SearchParams>;
};

const Page = async ({ searchParams }: Props) => {
  await requireAuth();
  
  const params = await workflowsParamsLoader(searchParams);
  await prefetchWorkflows(params);

  
  const bypassBoundary =
    process.env.NEXT_PUBLIC_DEBUG_BYPASS_WORKFLOWS_ERROR_BOUNDARY === "1";

  return (
    <WorkflowsShell>
      <HydrateClient>
        {bypassBoundary ? (
          <Suspense fallback={<WorkflowsLoading />}>
            <WorkflowsContent />
          </Suspense>
        ) : (
          <WorkflowsErrorBoundary>
            <Suspense fallback={<WorkflowsLoading />}>
              <WorkflowsContent />
            </Suspense>
          </WorkflowsErrorBoundary>
        )}
      </HydrateClient>
    </WorkflowsShell>
  );
};

export default Page;