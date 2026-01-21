import { prefetchWorkflow } from "@/features/workflows/server/prefetch";
import { requireAuth } from "@/lib/auth-utils";
import { HydrateClient } from "@/trpc/server";
import { Suspense } from "react";
import {
    Editor,
    EditorErrorBoundary,
    EditorLoading
    } from "@/features/editor/components/editor";
import { EditorHeader, EditorHeaderLoading } from "@/features/editor/components/editor-header";

interface PageProps {
    params: Promise<{ workflowId: string }>;
}


const Page = async ({params}: PageProps) => {
    await requireAuth();
    const {workflowId} = await params;
    await prefetchWorkflow(workflowId);
    return (
        <HydrateClient>
            <EditorErrorBoundary>
                <Suspense fallback={<EditorHeaderLoading />}>
                    <EditorHeader workflowId={workflowId} />
                </Suspense>
                <main className="flex-1">
                    <Suspense fallback={<EditorLoading />}>
                        <Editor workflowId={workflowId} />
                    </Suspense>
                </main>
            </EditorErrorBoundary>
        </HydrateClient>
    )
};

export default Page;
