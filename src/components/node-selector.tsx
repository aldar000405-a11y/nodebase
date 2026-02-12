"use client";

import { createId } from "@paralleldrive/cuid2";
import type { Node } from "@xyflow/react";
import { useReactFlow } from "@xyflow/react";
import { GlobeIcon, MousePointerIcon } from "lucide-react";
import { createContext, useCallback, useContext } from "react";
import { toast } from "sonner";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { NodeType } from "@/generated/prisma";
import { Separator } from "./ui/separator";

export type NodeTypeOption = {
  type: NodeType;
  label: string;
  description: string;
  icon: React.ComponentType<{ className?: string }> | string;
};

const triggerNodes: NodeTypeOption[] = [
  {
    type: NodeType.MANUAL_TRIGGER,
    label: "Trigger manually",
    description:
      "Runs the flow on clicking a button. Good for getting started quickly.",
    icon: MousePointerIcon,
  },
  {
    type: NodeType.GOOGLE_FORM_TRIGGER,
    label: "Google Form",
    description: "Runs the flow when a Google Form is submitted.",
    icon: "/logos/googleform.svg",
  },
  {
    type: NodeType.STRIPE_TRIGGER,
    label: "Stripe Event",
    description: "Runs the flow when a Stripe event is captured.",
    icon: "/logos/stripe.svg",
  },
];

const executionNodes: NodeTypeOption[] = [
  {
    type: NodeType.HTTP_REQUEST,
    label: "HTTP Request",
    description: "Make HTTP requests to external APIs.",
    icon: GlobeIcon,
  },
];

interface NodeSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

type NodeSelectorFlowState = {
  nodes: Node[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
};

const NodeSelectorFlowStateContext =
  createContext<NodeSelectorFlowState | null>(null);

export function NodeSelectorFlowStateProvider({
  nodes,
  setNodes,
  children,
}: NodeSelectorFlowState & { children: React.ReactNode }) {
  return (
    <NodeSelectorFlowStateContext.Provider value={{ nodes, setNodes }}>
      {children}
    </NodeSelectorFlowStateContext.Provider>
  );
}

function useNodeSelectorFlowState() {
  const value = useContext(NodeSelectorFlowStateContext);
  if (!value) {
    throw new Error(
      "NodeSelector must be used within NodeSelectorFlowStateProvider (Editor).",
    );
  }
  return value;
}

export function NodeSelector({
  open,
  onOpenChange,
  children,
}: NodeSelectorProps) {
  const { screenToFlowPosition, setEdges } = useReactFlow();
  const { setNodes } = useNodeSelectorFlowState();

  const handleNodeSelect = useCallback(
    (nodeType: NodeTypeOption) => {
      // Close immediately for instant feedback
      onOpenChange(false);

      setNodes((nodesSnapshot) => {
        if (nodeType.type === NodeType.MANUAL_TRIGGER) {
          const hasManualTrigger = nodesSnapshot.some(
            (node) => node.type === NodeType.MANUAL_TRIGGER,
          );
          if (hasManualTrigger) {
            toast.error("You can only have one manual trigger per workflow.");
            return nodesSnapshot;
          }
        }

        const hasInitialTrigger = nodesSnapshot.some(
          (node) => node.type === NodeType.INITIAL,
        );

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const flowPosition = screenToFlowPosition({
          x: centerX + (Math.random() - 0.5) * 200,
          y: centerY + (Math.random() - 0.5) * 200,
        });
        const newNode = {
          id: createId(),
          type: nodeType.type,
          position: flowPosition,
          data: {},
        };

        // INITIAL is a placeholder trigger; when the user picks a trigger,
        // replace INITIAL but keep the rest of the graph.
        const isTriggerNodeType =
          nodeType.type === NodeType.MANUAL_TRIGGER ||
          nodeType.type === NodeType.GOOGLE_FORM_TRIGGER;

        if (hasInitialTrigger && isTriggerNodeType) {
          const initialNode = nodesSnapshot.find(
            (n) => n.type === NodeType.INITIAL,
          );
          if (initialNode) {
            setEdges((edgesSnapshot) =>
              edgesSnapshot.filter(
                (edge) =>
                  edge.source !== initialNode.id &&
                  edge.target !== initialNode.id,
              ),
            );
          }

          return [
            ...nodesSnapshot.filter((n) => n.type !== NodeType.INITIAL),
            newNode,
          ];
        }

        return [...nodesSnapshot, newNode];
      });
    },
    [setNodes, setEdges, screenToFlowPosition, onOpenChange],
  );
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>{children}</SheetTrigger>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle>What triggers this workflow?</SheetTitle>
          <SheetDescription>
            A trigger is a step that starts your workflow.
          </SheetDescription>
          <Separator className="my-4" />
        </SheetHeader>
        <div>
          {triggerNodes.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <div
                key={nodeType.type}
                className="w-full justify-start h-auto py-5
                                 px-4 rounded-none cursor-pointer border-l-2 
                                 border-transparent hover:border-l-primary"
                onClick={() => handleNodeSelect(nodeType)}
              >
                <div className="flex w-full items-center gap-6 overflow-hidden">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={nodeType.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">
                      {nodeType.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        <Separator />
        <div>
          {executionNodes.map((nodeType) => {
            const Icon = nodeType.icon;
            return (
              <div
                key={nodeType.type}
                className="w-full justify-start h-auto py-5 px-4 rounded-none cursor-pointer border-l-2 border-transparent hover:border-l-primary"
                onClick={() => handleNodeSelect(nodeType)}
              >
                <div className="flex w-full items-center gap-6 overflow-hidden">
                  {typeof Icon === "string" ? (
                    <img
                      src={Icon}
                      alt={nodeType.label}
                      className="size-5 object-contain rounded-sm"
                    />
                  ) : (
                    <Icon className="size-5" />
                  )}
                  <div className="flex flex-col items-start text-left">
                    <span className="font-medium text-sm">
                      {nodeType.label}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {nodeType.description}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </SheetContent>
    </Sheet>
  );
}
