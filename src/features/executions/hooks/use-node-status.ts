import type { Realtime } from "@inngest/realtime";
import { useInngestSubscription } from "@inngest/realtime/hooks";
import { useCallback, useEffect, useState } from "react";
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
  const { data, latestData } = useInngestSubscription({
    refreshToken,
    enabled: true,
  });

  const extractStatus = useCallback(
    (message: Realtime.Message | null | undefined): NodeStatus | null => {
      if (!message || message.kind !== "data") {
        return null;
      }

      if (!message.data || typeof message.data !== "object") {
        return null;
      }

      const payload = message.data as {
        nodeId?: unknown;
        status?: unknown;
      };

      if (payload.nodeId !== nodeId) {
        return null;
      }

      if (
        message.channel &&
        message.channel !== channel &&
        !message.channel.endsWith(channel)
      ) {
        return null;
      }

      if (message.topic && message.topic !== topic) {
        return null;
      }

      const payloadStatus = payload.status;
      if (
        payloadStatus === "initial" ||
        payloadStatus === "loading" ||
        payloadStatus === "success" ||
        payloadStatus === "error"
      ) {
        return payloadStatus;
      }

      return null;
    },
    [nodeId, channel, topic],
  );

  useEffect(() => {
    const nextFromLatest = extractStatus(latestData);
    if (nextFromLatest) {
      setStatus(nextFromLatest);
      return;
    }

    if (!data?.length) {
      return;
    }

    for (let i = data.length - 1; i >= 0; i -= 1) {
      const candidate = extractStatus(data[i]);
      if (candidate) {
        setStatus(candidate);
        return;
      }
    }
  }, [data, latestData, extractStatus]);
  return status;
}
