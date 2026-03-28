"use client";

import { Loader2Icon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { useUpgradeModel } from "@/hooks/use-upgrade-model";

import { useCreateProject } from "../hooks/use-projects";

export function NewProjectClient() {
  const router = useRouter();
  const createProject = useCreateProject();
  const startedRef = useRef(false);
  const { handleError, model } = useUpgradeModel();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    createProject.mutate(undefined, {
      onSuccess: (data) => {
        setIsRedirecting(true);
        router.replace(`/projects/${data.id}`);
        toast.success(`Project "${data.name}" created successfully`);
      },
      onError: (error) => {
        handleError(error);
      },
    });
  }, [createProject, handleError, router]);

  const isLoading = createProject.isPending || isRedirecting;

  return (
    <div className="flex h-full w-full items-center justify-center p-6">
      {model}
      <div className="w-full max-w-sm space-y-4 text-center">
        {isLoading && (
          <div className="flex items-center justify-center gap-2">
            <Loader2Icon className="size-5 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              {isRedirecting ? "Opening project board…" : "Creating project..."}
            </p>
          </div>
        )}

        {createProject.isError && !isRedirecting && (
          <div className="space-y-3">
            <p className="text-sm text-destructive">
              Failed to create project.
            </p>
            <Button asChild variant="outline">
              <Link href="/projects">Back to projects</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
