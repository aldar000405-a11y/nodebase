import { prefetchWorkflows } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { WorkflowsContainer, workflowsList as WorkflowsList } from "@/features/workflows/components/workflows";

const Page = async () => {
  await requireAuth();
  try {
    await prefetchWorkflows();
  } catch (error) {
    // Silently fail - show empty workflows list instead
    console.error('Failed to prefetch workflows:', error);
  }
  
  return (
    <WorkflowsContainer>
 <HydrateClient>
      <ErrorBoundary fallback={<p>Error!</p>}>
      <Suspense fallback={<p>Loading workflows...</p>}>
      <WorkflowsList />

      </Suspense>

      </ErrorBoundary>
    </HydrateClient>
    </WorkflowsContainer>
   
  )
};

export default Page;