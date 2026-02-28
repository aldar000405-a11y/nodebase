"use client";
import { ErrorBoundary } from "react-error-boundary";
import { formatDistanceToNow } from "date-fns";
import {
  EmptyView,
  EntityContainer,
  EntityHeader,
  EntityItem,
  EntityList,
  EntityPagination,
  EntitySearch,
  ErrorView,
} from "@/components/entity-components";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import { useRouter } from "next/navigation";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { CredentialType } from "@/generated/prisma";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";




export const CredentialsEmpty = () => {
  const router = useRouter();

  const handleCreate = () => {
   
      router.push("/credintials/create");
 
  };

  return (
    <EmptyView
      onNew={handleCreate}
      message="You haven't created any credentials yet.
              Get started by creating your first credential."
    />
  );
};

const credentialLogos: Record<CredentialType, string> = {
  [CredentialType.OPENAI]: "/logos/openai.svg",
  [CredentialType.ANTHROPIC]: "/logos/anthropic.svg",
  [CredentialType.GEMINI]: "/logos/gemini.svg",
};

export const CredentialsItem = ({
   data,
  }: {
     data: {
       id: string;
       name: string;
       type: CredentialType;
       createdAt: Date;
       updatedAt: Date;
       triggerCount: number;
     }
     }) => {
  const removeCredential = useRemoveCredential();

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };

  const logo = credentialLogos[data.type] || "/logos/openai.svg"

  return (
    <EntityItem
      href={`/credintials/${data.id}`}
      title={data.name}
      subtitle={
        <>
          Updated {formatDistanceToNow(data.updatedAt, { addSuffix: true })}{" "}
          &bull; Created{" "}
          {formatDistanceToNow(data.createdAt, { addSuffix: true })} &bull;{" "}
          {data.triggerCount} trigger{data.triggerCount === 1 ? "" : "s"}
        </>
      }
      image={
        <div className="size-8 flex items-center justify-center">
          <Image src={logo} alt={data.type} width={20} height={20} />
        </div>
      }
      onRemove={handleRemove}
      isRemoving={removeCredential.isPending}
    />
  );
};


export const CredentialsSearch = () => {
  const [params, setParams] = useCredentialsParams();
  const { searchValue, onSearchChange } = useEntitySearch({
    params,
    setParams,
  });
  return (
    <EntitySearch
      value={searchValue}
      onChange={onSearchChange}
      placeholder="Search Credentials"
    />
  );
};

export const CredentialsList = () => {
  const credentials = useSuspenseCredentials();
  const items = credentials.data.items ?? [];

  return (
    <EntityList
      items={items}
      renderItem={(credential) => (
        <CredentialsItem data={credential} />
      )}
      getKey={(credential) => credential.id}
      emptyView={<CredentialsEmpty />}
    />
  );
};

export const CredentialsHeader = ({ disabled }: { disabled?: boolean }) => {
  const router = useRouter();

  const handleCreate = () => {
    router.push("/credintials/create");
  };

  return (
    <EntityHeader
      title="Credentials"
      description="Manage your credentials."
      onNew={handleCreate}
      newButtonLabel="New Credential"
      disabled={disabled}
    />
  );
};

export const CredentialsPagination = () => {
  const credentials = useSuspenseCredentials();
  const [params, setParams] = useCredentialsParams();

  return (
    <EntityPagination
      disabled={credentials.isFetching}
      totalPages={credentials.data.totalPages}
      page={credentials.data.page}
      onPageChange={(page) => setParams({ ...params, page })}
    />
  );
};

export const CredentialsShell = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="p-4 md:px-10 md:py-6 h-full">
      <div className="mx-auto max-w-screen-xl w-full flex flex-col gap-y-8 h-full">
        <CredentialsHeader />
        <div className="gap-y-4 h-full flex flex-col">
          <CredentialsSearch />
          {children}
        </div>
      </div>
    </div>
  );
};

export const CredentialsContent = () => {
  return (
    <div className="flex flex-col h-full gap-y-4">
      <CredentialsList />
      <CredentialsPagination />
    </div>
  );
};

export const credentialsContainer = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <EntityContainer
      header={<CredentialsHeader />}
      search={<CredentialsSearch />}
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsContainer = credentialsContainer;

export const CredentialsLoading = () => {
  return (
    <div className="flex flex-col h-full gap-y-4">
      <div className="flex flex-col gap-y-4">
        {/* Skeleton cards matching Credential items */}
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
export const CredentialsError = ({ message }: { message?: string }) => {
  return <ErrorView message={message ?? "Error loading credentials."} />;
};

export const CredentialsErrorBoundary = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => <CredentialsError message={error.message} />}
    >
      {children}
    </ErrorBoundary>
  );
};
