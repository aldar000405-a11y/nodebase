import { NewWorkflowClient } from "@/features/workflows/components/new-workflow-client";
import { requireAuth } from "@/lib/auth-utils";

const Page = async () => {
  await requireAuth();
  return <NewWorkflowClient />;
};

export default Page;
