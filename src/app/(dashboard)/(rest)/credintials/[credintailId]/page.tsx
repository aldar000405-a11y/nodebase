import { requireAuth } from "@/lib/auth-utils";
import { CredentialsView } from "@/features/credentials/components/credential";
import { prefetchCredential } from "@/features/credentials/server/prefetch";
import { CredentialsError, CredentialsLoading } from "@/features/credentials/components/credentials";
import { HydrateClient } from "@/trpc/server";
import { ErrorBoundary } from "react-error-boundary";
import { Suspense } from "react";

interface PageProps {
  params: Promise<{ credintailId: string }>;
}

const Page = async ({ params }: PageProps) => {
  await requireAuth();
  const { credintailId } = await params;
  prefetchCredential(credintailId);


  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-md w-full flex flex-col gap-y-8 h-full">
        <HydrateClient>
            <ErrorBoundary fallback={<CredentialsError />}>
            <Suspense fallback={<CredentialsLoading />}>
    <CredentialsView credentialId={credintailId} />
    </Suspense>
    </ErrorBoundary>
    </HydrateClient>
    </div>
    </div>
  )
};

export default Page;
