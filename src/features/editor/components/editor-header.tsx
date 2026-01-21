"use client";

import { Button } from "@/components/ui/button";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { SaveIcon } from "lucide-react";
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState, useTransition } from "react";
import type { KeyboardEvent } from "react";
import Link  from "next/link";
import { useSuspenseWorkflow, useUpdateWorkflow, useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows";
import { trpc } from "@/trpc/client";
import { useRouter } from "next/navigation";
import { Loader2Icon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useAtomValue } from "jotai";
import { editorAtom } from "../store/atoms";


export const EditorSaveButton = ({ workflowId }: { workflowId: string }) => {
    const editor = useAtomValue(editorAtom);
    const saveWorkflow = useUpdateWorkflow();
    
    const handleSave = () => {
        if (!editor) {
            return;
        }

        const nodes = editor.getNodes();
        const edges = editor.getEdges();

        saveWorkflow.mutate({
            id: workflowId,
            nodes,
            edges,
        });
    }
        return (
            <div className="ml-auto">
            <Button
                size="sm"
                onClick={handleSave}
                disabled={saveWorkflow.
                    isPending
                }
            >
                    <SaveIcon className="size-4"/>
                    Save
            </Button>
            </div>
        )
     };

     export const EditorNameInputs = ({ workflowId }: { workflowId: 
        string}) => {
            const { data: workflow } = useSuspenseWorkflow(workflowId);
            const updateWorkflow = useUpdateWorkflowName();

            // Prevent name flicker during refetch/save by keeping a local optimistic value.
            const [optimisticName, setOptimisticName] = useState<string | null>(null);

            const [isEditing, setIsEditing] = useState(false);
            // Only use state for the input value during editing
            const [editingName, setEditingName] = useState("");

            const displayName = optimisticName ?? workflow?.name ?? "Untitled";

            const inputRef = useRef<HTMLInputElement>(null);

            // When entering edit mode, initialize with current workflow name
            const startEditing = () => {
                setEditingName(displayName);
                setIsEditing(true);
            };

            // If server data catches up, clear optimistic name.
            useEffect(() => {
                if (optimisticName && workflow?.name === optimisticName) {
                    setOptimisticName(null);
                }
            }, [optimisticName, workflow?.name]);

            useEffect(() => {
                if (isEditing && inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.select();
                }
            }, [isEditing]);

            const handleSave = async () => {
                const trimmedName = editingName.trim();
                
                // Reset if empty or unchanged
                const currentName = optimisticName ?? (workflow?.name ?? "");
                if (!trimmedName || trimmedName === currentName) {
                    setIsEditing(false);
                    return;
                }

                try {
                    // Update UI immediately; this avoids flashes to an older cached name.
                    setOptimisticName(trimmedName);
                    await updateWorkflow.mutateAsync({
                        id: workflowId,
                        name: trimmedName,
                    });
                } catch {
                    // If mutation fails, fall back to server value.
                    setOptimisticName(null);
                    // Error handled by mutation hook (toast)
                } finally {
                    setIsEditing(false);
                }
            };

            const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                    handleSave();
                } else if (e.key === "Escape") {
                    setIsEditing(false);
                }
            };

            if (isEditing) {
                return (
                    <BreadcrumbItem>
                        <Input 
                        disabled={updateWorkflow.isPending}
                        ref={inputRef}
                        value={editingName}
                        onChange={(e) => setEditingName(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="h-7 w-[220px] max-w-[40vw] px-2 rounded-md"
                        />
                    </BreadcrumbItem>
                )
            }

            // Display workflow.name directly from query data - no state involved
            return (
                <BreadcrumbItem onClick={startEditing} className="cursor-pointer
                hover:text-foreground transition-colors">
                {displayName}
                </BreadcrumbItem>
            )
        };

export const EditorBreadcrumbs = ({ workflowId }: { workflowId:
     string }) => {
        const utils = trpc.useUtils();
        const router = useRouter();
        const [isNavigating, startTransition] = useTransition();
        
        // Prefetch workflows list on hover for faster back navigation
        const handlePrefetch = () => {
            utils.workflows.getMany.prefetch({ page: 1, pageSize: 5, search: "" });
        };
        
        const handleClick = (e: React.MouseEvent) => {
            e.preventDefault();
            // Prevent double-click
            if (isNavigating) return;
            
            startTransition(() => {
                router.push("/workflows");
            });
        };

        return (
            <Breadcrumb>
            <BreadcrumbList>
            <BreadcrumbItem>
            <BreadcrumbLink asChild>
            <Link 
                prefetch 
                href="/workflows" 
                onMouseEnter={handlePrefetch}
                onClick={handleClick}
                className={isNavigating ? "opacity-50 pointer-events-none" : ""}
            >
                {isNavigating ? (
                    <span className="flex items-center gap-1">
                        <Loader2Icon className="size-3 animate-spin" />
                        Workflows
                    </span>
                ) : (
                    "Workflows"
                )}
            </Link>

            </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <EditorNameInputs workflowId={workflowId} />
            </BreadcrumbList>
            </Breadcrumb>
          
        )
     };

// Loading skeleton for the header
export const EditorHeaderLoading = () => {
    return (
        <header className="flex h-14 shrink-0 items-center gap-2 border-b px-4 bg-background">
            <div className="flex w-full items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    <Skeleton className="size-6" />
                    <div className="flex items-center gap-2">
                        <Skeleton className="h-4 w-20" />
                        <span className="text-muted-foreground">/</span>
                        <Skeleton className="h-4 w-32" />
                    </div>
                </div>
                <Skeleton className="h-8 w-16" />
            </div>
        </header>
    );
};

export const EditorHeader = ({ workflowId }: { workflowId: string }) => {  
    return (
        <header className="flex h-14 
        shrink-0 items-center gap-2
        border-b px-4 bg-background">
            <div className="flex w-full items-center justify-between gap-3">
                <div className="flex items-center gap-2 min-w-0">
                    <SidebarTrigger />
                    <EditorBreadcrumbs workflowId={workflowId} />
                </div>
                <EditorSaveButton workflowId={workflowId} />
            </div>
        </header>
    );
};
