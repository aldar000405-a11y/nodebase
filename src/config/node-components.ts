import { InitialNode } from "@/components/initial-node";
import { HTTPRequestNode } from "@/features/executions/components/http-request/node";
import { ManualTriggerNode } from "@/features/triggers/manual-trigger/node";
import { NodeType } from "@/generated/prisma";
import type { NodeTypes } from "@xyflow/react";
import { GoogleFormTrigger } from "@/features/triggers/google-form-trigger/node";
import { StripeTriggerNode } from "@/features/triggers/components/stripe-trigger/node";
import { GeminiNode } from "@/features/executions/components/gemini/node";
import { openAINode } from "@/features/executions/components/openai/node";
import { AnthropicNode } from "@/features/executions/components/anthropic/node";

export const nodeComponents = {
  [NodeType.INITIAL]: InitialNode,
  [NodeType.HTTP_REQUEST]: HTTPRequestNode,
  [NodeType.MANUAL_TRIGGER]: ManualTriggerNode,
  [NodeType.GOOGLE_FORM_TRIGGER]: GoogleFormTrigger,
  [NodeType.STRIPE_TRIGGER]: StripeTriggerNode,
  [NodeType.GEMINI]: GeminiNode,
  [NodeType.OPENAI]: openAINode,
  [NodeType.ANTHROPIC]: AnthropicNode,

} as const satisfies NodeTypes;

export type RegisteredNodeType = keyof typeof nodeComponents;
