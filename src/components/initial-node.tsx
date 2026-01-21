"use client";

import type { NodeProps } from "@xyflow/react";
import { PlusIcon } from "lucide-react";
import { memo, useState } from "react";
import { PlaceholderNode } from "./react-flow/placeholder-node";
import { WorkflowNode } from "./workflow-node";
import { NodeSelector } from "./node-selector";

export const InitialNode = memo((props: NodeProps) => {
    const [ selectorOpen, setSelectorOpen ] = useState(false);
    return (
      
        <WorkflowNode showToolbar={false}>
              <NodeSelector open={selectorOpen} onOpenChange=
        {setSelectorOpen}>
        <PlaceholderNode 
        {...props}
        onClick={() => setSelectorOpen(true)}
        >
            <div className="flex cursor-pointer items-center justify-center">
                <PlusIcon className="size-4" />
            </div>
        </PlaceholderNode>
           </NodeSelector>
        </WorkflowNode>
     
    )

});

InitialNode.displayName = "InitialNode";