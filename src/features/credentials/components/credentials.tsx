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
  LoadingView,
} from "@/components/entity-components";
import {
  useRemoveCredential,
  useSuspenseCredentials,
} from "../hooks/use-credentials";
import { useRouter } from "next/navigation";
import { useEntitySearch } from "@/hooks/use-entity-search";
import { useCredentialsParams } from "../hooks/use-credentials-params";
import { CredentialType } from "@/generated/prisma";
import Image from "next/image";

type CredentialListItem = {
  id: string;
  name: string;
  type: CredentialType;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  triggerCount: number;
};

export const CredentialsEmpty = () => {
  const router = useRouter();

  const handleCreate = () => {
   
      router.push("/credentials/create");
 
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
     data: CredentialListItem
     }) => {
  const removeCredential = useRemoveCredential();

  const handleRemove = () => {
    removeCredential.mutate({ id: data.id });
  };

  const logo = credentialLogos[data.type] || "/logos/openai.svg"

  return (
    <EntityItem
      href={`/credentials/${data.id}`}
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

  return (
    <EntityHeader
     title="credentials"
      description="Create and manage your credentials."
      newButtonHref="/credentials/new"
      newButtonLabel="new credential"
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
      pagination={<CredentialsPagination />}
    >
      {children}
    </EntityContainer>
  );
};

export const CredentialsContainer = credentialsContainer;

export const CredentialsLoading = () => {
  return <LoadingView message="Loading credentials..." />; 
}
export const CredentialsError = () => {
  return <ErrorView message="Error loading credentials." />;
};

