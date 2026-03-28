"use client";

import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  Background,
  type Connection,
  Controls,
  type Edge,
  type EdgeChange,
  MiniMap,
  type Node,
  type NodeChange,
  ReactFlow,
} from "@xyflow/react";
import { useSetAtom } from "jotai";
import type { ReactNode } from "react";
import { useCallback, useState } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseProject } from "@/features/projects/hooks/use-projects";
import "@xyflow/react/dist/style.css";
import { editorAtom } from "../store/atoms";

export const EditorLoading = () => {
  return <LoadingView message="Loading project board..." />;
};

export const EditorError = ({ message }: { message?: string }) => {
  return <ErrorView message={message ?? "Error loading project board."} />;
};

export const EditorErrorBoundary = ({ children }: { children: ReactNode }) => {
  return (
    <ErrorBoundary
      fallbackRender={({ error }) => (
        <EditorError
          message={error instanceof Error ? error.message : "Unknown error"}
        />
      )}
    >
      {children}
    </ErrorBoundary>
  );
};

export const Editor = ({ projectId }: { projectId: string }) => {
  const { data: project } = useSuspenseProject(projectId);
  const setEditor = useSetAtom(editorAtom);

  const [nodes, setNodes] = useState<Node[]>(
    project.nodes as unknown as Node[],
  );
  const [edges, setEdges] = useState<Edge[]>(
    project.edges as unknown as Edge[],
  );

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );

  const onConnect = useCallback(
    (params: Connection) =>
      setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
    [],
  );

  return (
    <div className="size-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onInit={setEditor}
        fitView
        snapGrid={[10, 10]}
        snapToGrid
        panOnScroll
        panOnDrag={false}
        selectionOnDrag
      >
        <Background />
        <Controls />
        <MiniMap />
      </ReactFlow>
    </div>
  );
};
