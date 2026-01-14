"use client";

import { ErrorBoundary } from "react-error-boundary";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";

export const EditorLoading = () => {
  return  <LoadingView message="Loading editor..."/>;
};

export const EditorError = ({ message }: { message?: string }) => {
        return <ErrorView message={message ?? "Error loading editor."} />;
};

export const EditorErrorBoundary = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    return (
        <ErrorBoundary
            fallbackRender={({ error }) => <EditorError message={error.message} />}
        >
            {children}
        </ErrorBoundary>
    );
};

export const Editor = ({ workflowId }: { workflowId: string }) => {
    const { data: workflow } = useSuspenseWorkflow(workflowId);

    return (
        <pre className="whitespace-pre-wrap break-words">
            {JSON.stringify(workflow, null, 2)}
        </pre>
    );
};