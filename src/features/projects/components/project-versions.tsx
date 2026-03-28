"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Loader2Icon, PlusIcon } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  type SduiNode,
  SduiRenderer,
} from "@/features/sdui/components/sdui-renderer";
import { useTRPC } from "@/trpc/client";

interface ProjectVersionsProps {
  projectId: string;
}

export const ProjectVersions = ({ projectId }: ProjectVersionsProps) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();

  const versionsQuery = useQuery(
    trpc.projectVersions.getVersions.queryOptions({ projectId }),
  );

  const createVersion = useMutation(
    trpc.projectVersions.createVersion.mutationOptions({
      onSuccess: (data) => {
        toast.success(`Created version ${data.versionNum}`);
        queryClient.invalidateQueries(
          trpc.projectVersions.getVersions.queryFilter({ projectId }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to create version: ${error.message}`);
      },
    }),
  );

  const handleCreateVersion = () => {
    createVersion.mutate({ projectId });
  };

  const versions = versionsQuery.data ?? [];
  const latestVersionId = versions[0]?.id;

  const uiSchemaQuery = useQuery({
    ...trpc.projectVersions.getUiSchema.queryOptions({
      projectVersionId: latestVersionId ?? "",
    }),
    enabled: Boolean(latestVersionId),
  });

  const generateMockUiSchema = useMutation(
    trpc.projectVersions.generateMockUiSchema.mutationOptions({
      onSuccess: () => {
        toast.success("AI multi-agent UI schema generated");
        if (!latestVersionId) return;
        queryClient.invalidateQueries(
          trpc.projectVersions.getUiSchema.queryFilter({
            projectVersionId: latestVersionId,
          }),
        );
      },
      onError: (error) => {
        toast.error(`Failed to generate UI schema: ${error.message}`);
      },
    }),
  );

  const handleGenerateUiSchema = () => {
    if (!latestVersionId) {
      toast.error("Create a project version first");
      return;
    }

    generateMockUiSchema.mutate({ projectVersionId: latestVersionId });
  };

  const uiSchema = uiSchemaQuery.data;
  const uiNode = uiSchema?.jsonSchema as unknown as SduiNode;

  return (
    <Card className="shadow-none">
      <CardHeader className="flex flex-row items-center justify-between gap-3">
        <CardTitle className="text-base">Project Versions</CardTitle>
        <Button
          size="sm"
          onClick={handleCreateVersion}
          disabled={createVersion.isPending}
        >
          {createVersion.isPending ? (
            <Loader2Icon className="size-4 animate-spin" />
          ) : (
            <PlusIcon className="size-4" />
          )}
          Create New Version
        </Button>
      </CardHeader>
      <CardContent>
        {versionsQuery.isLoading ? (
          <div className="text-sm text-muted-foreground">
            Loading versions...
          </div>
        ) : versionsQuery.error ? (
          <div className="text-sm text-destructive">
            Failed to load versions.
          </div>
        ) : versions.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No versions yet. Create your first version.
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((version) => (
              <div
                key={version.id}
                className="rounded-md border p-3 flex items-start justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="font-medium text-sm">
                    v{version.versionNum}
                    {version.name ? ` - ${version.name}` : ""}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    Created{" "}
                    {formatDistanceToNow(version.createdAt, {
                      addSuffix: true,
                    })}
                  </div>
                </div>
                <div className="text-xs text-muted-foreground">
                  UX Inputs: {version.uxInputs.length}
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 border-t pt-4">
          <h3 className="text-sm font-semibold mb-3">Preview SDUI</h3>

          {!latestVersionId ? (
            <p className="text-sm text-muted-foreground">
              Create a project version to preview SDUI.
            </p>
          ) : uiSchemaQuery.isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-28 w-full" />
            </div>
          ) : uiSchemaQuery.error ? (
            <p className="text-sm text-destructive">
              Failed to load UI schema.
            </p>
          ) : !uiSchema ? (
            <Button
              size="sm"
              onClick={handleGenerateUiSchema}
              disabled={generateMockUiSchema.isPending}
            >
              {generateMockUiSchema.isPending ? (
                <Loader2Icon className="size-4 animate-spin" />
              ) : null}
              ✨ Generate UI with AI (Multi-Agent)
            </Button>
          ) : (
            <SduiRenderer node={uiNode} />
          )}
        </div>
      </CardContent>
    </Card>
  );
};
