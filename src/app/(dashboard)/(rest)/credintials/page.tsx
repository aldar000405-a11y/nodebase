import { credentialsParamsLoader } from "@/features/credentials/server/params-loader";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import type { SearchParams } from "nuqs";
import { Suspense } from "react";
import { prefetchCredentials } from "@/features/credentials/server/prefetch";
import {
  CredentialsContent,
  CredentialsShell,
  CredentialsLoading,
  CredentialsErrorBoundary,
} from "@/features/credentials/components/credentials";

type Props = {
  searchParams: Promise<SearchParams>;
};
const Page = async ({ searchParams }: Props) => {
  await requireAuth();

  const params = await credentialsParamsLoader(searchParams);
  await prefetchCredentials(params);

  return (
    <CredentialsShell>
      <HydrateClient>
        <CredentialsErrorBoundary>
          <Suspense fallback={<CredentialsLoading />}>
            <CredentialsContent />
          </Suspense>
        </CredentialsErrorBoundary>
      </HydrateClient>
    </CredentialsShell>
  );
};

export default Page;
