import { useAtomValue } from "jotai";
import { FlaskConicalIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  useExecuteWorkflow,
  useUpdateWorkflow,
} from "@/features/workflows/hooks/use-workflows";
import { editorAtom } from "../store/atoms";

export const ExecuteWorkflowButton = ({
  workflowId,
}: {
  workflowId: string;
}) => {
  const editor = useAtomValue(editorAtom);
  const saveWorkflow = useUpdateWorkflow({ silent: true });
  const executeWorkflow = useExecuteWorkflow();
  const handleExecute = async () => {
    if (!editor) {
      return;
    }

    try {
      await saveWorkflow.mutateAsync({
        id: workflowId,
        nodes: editor.getNodes(),
        edges: editor.getEdges(),
      });
      await executeWorkflow.mutateAsync({ id: workflowId });
    } catch {
      return;
    }
  };
  return (
    <Button
      size="lg"
      onClick={() => void handleExecute()}
      disabled={executeWorkflow.isPending || saveWorkflow.isPending}
    >
      <FlaskConicalIcon className="size-4" />
      Execute workflow
    </Button>
  );
};
