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
import { useEffect, useRef, useState } from "react";
import type { KeyboardEvent } from "react";
import Link  from "next/link";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import { useUpdateWorkflowName } from "@/features/workflows/hooks/use-workflows";
import { trpc } from "@/trpc/client";


export const EditorSaveButton = ({ workflowId: _workflowId }: { workflowId: string }) => {
        return (
            <Button
                size="sm"
                className="rounded-md gap-2"
                onClick={() => {}}
                disabled={false}
            >
                    <SaveIcon className="size-4"/>
                    Save
            </Button>
        )
     };

     export const EditorNameInputs = ({ workflowId }: { workflowId: 
        string}) => {
            const { data: workflow } = useSuspenseWorkflow(workflowId);
            const updateWorkflow = useUpdateWorkflowName();

            const [isEditing, setIsEditing] = useState(false);
            // Only use state for the input value during editing
            const [editingName, setEditingName] = useState("");

            const inputRef = useRef<HTMLInputElement>(null);

            // When entering edit mode, initialize with current workflow name
            const startEditing = () => {
                setEditingName(workflow?.name || "Untitled");
                setIsEditing(true);
            };

            useEffect(() => {
                if (isEditing && inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.select();
                }
            }, [isEditing]);

            const handleSave = async () => {
                const trimmedName = editingName.trim();
                
                // Reset if empty or unchanged
                if (!trimmedName || trimmedName === (workflow?.name ?? "")) {
                    setIsEditing(false);
                    return;
                }

                try {
                    await updateWorkflow.mutateAsync({
                        id: workflowId,
                        name: trimmedName,
                    });
                } catch {
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
                {workflow?.name || "Untitled"}
                </BreadcrumbItem>
            )
        };

export const EditorBreadcrumbs = ({ workflowId }: { workflowId:
     string }) => {
        const utils = trpc.useUtils();
        
        // Prefetch workflows list on hover for faster back navigation
        const handlePrefetch = () => {
            utils.workflows.getMany.prefetch({ page: 1, pageSize: 5, search: "" });
        };

        return (
            <Breadcrumb>
            <BreadcrumbList>
            <BreadcrumbItem>
            <BreadcrumbLink asChild>
            <Link prefetch href="/workflows" onMouseEnter={handlePrefetch}>
            Workflows
            </Link>

            </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <EditorNameInputs workflowId={workflowId} />
            </BreadcrumbList>
            </Breadcrumb>
          
        )
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
