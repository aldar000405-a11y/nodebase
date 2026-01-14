"use client";

import { Button } from "@/components/ui/button";
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
            const { data: workflow} = useSuspenseWorkflow(workflowId);
            const updateWorkflow = useUpdateWorkflowName();

            const [isEditing, setIsEditing] = useState(false);
            const [name, setName] = useState(workflow?.name ?? "");

            const inputRef = useRef<HTMLInputElement>(null);

            useEffect(() => {
                if (workflow?.name) {
                    setName(workflow.name);
                }
            }, [workflow?.name]);

            useEffect(() => {
                if (isEditing && inputRef.current) {
                    inputRef.current.focus();
                    inputRef.current.select();
                }
            }, [isEditing]);

            const handleSave = async () => {
                if (!workflow) {
                    setIsEditing(false);
                    return;
                }

                if (name === workflow.name) {
                    setIsEditing(false);
                    return;
                }


                try {
                    await updateWorkflow.mutateAsync({
                        id: workflowId,
                        name,
                    });

                } catch {
                    setName(workflow?.name ?? "");
                } finally {
                    setIsEditing(false);
                }
            };

            const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
                if (e.key === "Enter") {
                    handleSave();
                } else if (e.key === "Escape") {
                    setName(workflow?.name ?? "");
                    setIsEditing(false);
                }
            };

            if (isEditing) {
                return (
                    <BreadcrumbItem>
                        <Input 
                        disabled={updateWorkflow.isPending}
                        ref={inputRef}
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        onBlur={handleSave}
                        onKeyDown={handleKeyDown}
                        className="h-7 w-[220px] max-w-[40vw] px-2 rounded-md"
                        />
                    </BreadcrumbItem>
                )
            }

            return (
                <BreadcrumbItem onClick={() => setIsEditing(true)} className="cursor-pointer
                hover:text-foreground transition-colors">
                {workflow?.name ?? "Untitled"}
                </BreadcrumbItem>
            )
        };

export const EditorBreadcrumbs = ({ workflowId }: { workflowId:
     string }) => {
        return (
            <Breadcrumb>
            <BreadcrumbList>
            <BreadcrumbItem>
            <BreadcrumbLink asChild>
            <Link prefetch href="/workflows">
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
                    <EditorBreadcrumbs workflowId={workflowId} />
                </div>
                <EditorSaveButton workflowId={workflowId} />
            </div>
        </header>
    );
};
