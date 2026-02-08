import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useEffect, useState } from "react";
import type { NodeStatus } from "@/components/react-flow/node-status-indicator";

interface UseNodeStatusOptions {
  nodeId: string;
  channel: string;
  topic: string;
  refreshToken: () => Promise<Realtime.Subscribe.Token>;
}

export function useNodeStatus({
  nodeId,
  channel,
  topic,
  refreshToken,
}: UseNodeStatusOptions): NodeStatus {
  const [status, setStatus] = useState<NodeStatus>("initial");
  const { data } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  useEffect(() => {
    if (!data?.length) {
      return;
    }

    // find the latest message for this node
    const relevantMessages = data.filter(
      (msg) =>
        msg.kind === "data" &&
        msg.channel === channel &&
        msg.topic === topic &&
        msg.data.nodeId === nodeId,
    );

    console.log(
      `[useNodeStatus] Node ${nodeId.slice(-8)}: found ${relevantMessages.length} messages`,
      relevantMessages.map((m) => (m.kind === "data" ? m.data.status : "?")),
    );

    const latestMessage = relevantMessages.sort((a, b) => {
      if (a.kind === "data" && b.kind === "data") {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }
      return 0;
    })[0];

    if (latestMessage?.kind === "data") {
      console.log(
        `[useNodeStatus] Node ${nodeId.slice(-8)}: Setting status to ${latestMessage.data.status}`,
      );
      setStatus(latestMessage.data.status as NodeStatus);
    }
  }, [data, nodeId, channel, topic]);
  return status;
}
