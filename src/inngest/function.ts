import { NonRetriableError } from "inngest";
import { inngest } from "./client";
import prisma from "@/lib/db";
import { topologicalSort } from "./utils";
import { NodeType } from "@/generated/prisma";
import { getExecutor } from "@/features/executions/lib/executor-registry";
import { httpRequestChannel } from "./channels/http-request";
import { manualTriggerChannel } from "./channels/manual-trigger";
import { googleFormTriggerChannel } from "./channels/google-form-trigger";
import { stripeTriggerChannel } from "./channels/stripe-trigger";
import { geminiChannel } from "./channels/gemini";
import { openAiChannel } from "./channels/openai";
import { anthropicChannel } from "./channels/anthropic";

// Convert (()) syntax to {{}} for Handlebars compatibility
const convertTemplateVariables = (text: string): string => {
  // Match ((content)) where content can contain anything except double closing parens
  return text.replace(/\(\((.+?)\)\)/g, "{{$1}}");
};

// Preprocess node data to convert template syntax
const preprocessNodeData = (
  data: Record<string, unknown>,
): Record<string, unknown> => {
  const processed: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(data)) {
    if (typeof value === "string") {
      const converted = convertTemplateVariables(value);
      processed[key] = converted;
    } else {
      processed[key] = value;
    }
  }
  return processed;
};

export const executeWorkflow = inngest.createFunction(
  {
    id: "execute-workflow",
    retries: 0,
  },
  {
    event: "workflows/execute.workflow",
    channels: [
      httpRequestChannel(),
      manualTriggerChannel(),
      googleFormTriggerChannel(),
      stripeTriggerChannel(),
      geminiChannel(),
      openAiChannel(),
      anthropicChannel(),
    ],
  },
  async ({ event, step, publish }) => {
    const workflowId = event.data.workflowId;

    if (!workflowId) {
      throw new NonRetriableError("Workflow ID is missing");
    }
    const sortedNodes = await step.run("Prepare-workflow", async () => {
      const workflow = await prisma.workflow.findUniqueOrThrow({
        where: { id: workflowId },
        include: {
          nodes: true,
          connections: true,
        },
      });

      try {
        return topologicalSort(workflow.nodes, workflow.connections);
      } catch (error: any) {
        if (error.message.includes("Cyclic dependency")) {
          throw new NonRetriableError(
            `Workflow failed: Cyclic dependency detected. Node: ${error.message.split('"')[1] || "unknown"}`,
          );
        }
        throw error;
      }
    });

    // initialize the context with any initial data from the trigger
    let context = event.data.initialData || {};

    // Execute each node
    for (const node of sortedNodes) {
      const executor = getExecutor(node.type as NodeType);
      // Preprocess node data to convert (()) to {{}} template syntax
      const processedData = preprocessNodeData(
        node.data as Record<string, unknown>,
      );
      context = await executor({
        data: processedData,
        nodeId: node.id,
        context,
        step,
        publish,
      });
    }

    return {
      workflowId,
      result: context,
    };
  },
);
