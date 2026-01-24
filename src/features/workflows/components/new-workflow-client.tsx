"use client";

import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

import { Button } from "@/components/ui/button";
import { trpc } from "@/trpc/client";
import { useUpgradeModel } from "@/hooks/use-upgrade-model";

import { useCreateWorkflow } from "../hooks/use-workflows";

export function NewWorkflowClient() {
  const router = useRouter();
  const utils = trpc.useUtils();
  const createWorkflow = useCreateWorkflow();
  const startedRef = useRef(false);
  const { handleError, model } = useUpgradeModel();

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    createWorkflow.mutate(
      {},
      {
        onSuccess: (data) => {
          // Navigate immediately; don't block on prefetch/invalidate.
          router.replace(`/workflows/${data.id}`);
          void utils.workflows.getOne.prefetch({ id: data.id });
          void utils.workflows.getMany.invalidate();
        },
        onError: (error) => {
          handleError(error);
        },
      },
    );
  }, [createWorkflow, handleError, router, utils.workflows.getMany, utils.workflows.getOne]);

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      {model}
      <div className="w-full max-w-sm space-y-4 text-center">
        <div className="flex items-center justify-center gap-2">
          <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
          <p className="text-sm text-muted-foreground">Creating workflow…</p>
        </div>

        {createWorkflow.isError && (
          <div className="space-y-3">
            <p className="text-sm text-destructive">Failed to create workflow.</p>
            <Button asChild variant="outline">
              <Link href="/workflows">Back to workflows</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
