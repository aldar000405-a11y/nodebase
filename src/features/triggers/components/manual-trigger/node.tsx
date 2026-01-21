import type { NodeProps } from '@xyflow/react';
import { memo, useState } from 'react';
import { BaseTriggerNode } from '../base-trigger-node';
import { MousePointerIcon } from 'lucide-react';
import { ManaulTriggerDialog } from './dialog';

type ManualTriggerNodeData = {
    endpoint?: string;
    method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
    body?: string;
    [key: string]: unknown;
};

export const ManualTriggerNode = memo((props: NodeProps) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const nodeStatus = "initial";
    const handleOpenSettings = () => setDialogOpen(true);
    const nodeData = (props.data || {}) as ManualTriggerNodeData;


    return (
        <>
        <ManaulTriggerDialog 
        open={dialogOpen}
         onOpenChange={setDialogOpen} 
         onSubmit={() => {}}
         defaultEndpoint={nodeData.endpoint}
         defaultMethod={nodeData.method}
            defaultBody={nodeData.body}
         />
        <BaseTriggerNode 
            {...props}
            icon={MousePointerIcon}
            name="When clicking 'Execute workflow'"
            status={nodeStatus}
            onSettings={handleOpenSettings}
            onDoubleClick={handleOpenSettings}
        />
        </>
    );
});

ManualTriggerNode.displayName = "ManualTriggerNode";