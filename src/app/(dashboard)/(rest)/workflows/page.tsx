import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { WorkflowsContainer, workflowsList as WorkflowsList , WorkflowsLoading } from "@/features/workflows/components/workflows";
import type { SearchParams } from "nuqs/server";
import { workflowsParamsLoader } from "@/features/workflows/server/params-loader";


type Props = {
  searchParams: Promise<SearchParams>;
}

const Page = async ({searchParams}: Props) => {
  await requireAuth();
  
  const params = await workflowsParamsLoader(searchParams);
  await prefetchWorkflows(params);

  
  return (
    <HydrateClient>
      <ErrorBoundary fallback={<p>Error!</p>}>
        <Suspense fallback={<WorkflowsLoading />}>
          <WorkflowsContainer>
            <WorkflowsList />
          </WorkflowsContainer>
        </Suspense>
      </ErrorBoundary>
    </HydrateClient>
   
  )
};

export default Page;