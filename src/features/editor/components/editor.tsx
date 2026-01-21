"use client";
import type { ReactNode } from 'react';
import { useState, useCallback } from 'react';
import {
     ReactFlow,
      applyNodeChanges,
       applyEdgeChanges,
        addEdge, 
       type Node,
      type  Edge,
    type NodeChange,
    type EdgeChange,
    type Connection,
    Background,
    Controls,
    MiniMap,
    Panel
    } from '@xyflow/react';
import { useSetAtom } from 'jotai';
import { AddNodeButton } from '@/features/editor/components/add-node-button';
import { ErrorBoundary } from "react-error-boundary";
import { ErrorView, LoadingView } from "@/components/entity-components";
import { useSuspenseWorkflow } from "@/features/workflows/hooks/use-workflows";
import '@xyflow/react/dist/style.css';
import { nodeComponents } from '@/config/node-components';
import { editorAtom } from "../store/atoms";


export const EditorLoading = () => {
  return  <LoadingView message="Loading editor..."/>;
};

export const EditorError = ({ message }: { message?: string }) => {
        return <ErrorView message={message ?? "Error loading editor."} />;
};



export const EditorErrorBoundary = ({
    children,
}: {
    children: ReactNode;
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

    const setEditor = useSetAtom(editorAtom);

    const [nodes, setNodes] = useState<Node[]>(workflow.nodes);
    const [edges, setEdges] = useState<Edge[]>(workflow.edges);

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nodesSnapshot) => applyNodeChanges(changes, nodesSnapshot)),
    [],
  );
  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((edgesSnapshot) => applyEdgeChanges(changes, edgesSnapshot)),
    [],
  );
  const onConnect = useCallback(
    (params: Connection) => setEdges((edgesSnapshot) => addEdge(params, edgesSnapshot)),
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
            nodeTypes={nodeComponents}
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
            <Panel position="top-right">
              <AddNodeButton />
            </Panel>
            </ReactFlow>
        </div>
    );
};