import { generateText } from "ai";
// import { createAnthropic } from "@ai-sdk/anthropic";
import Handlebars from "handlebars";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { anthropicChannel } from "@/inngest/channels/anthropic";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type AnthropicData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const anthropicExecutor: NodeExecutor<AnthropicData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    anthropicChannel().status({
      nodeId: nodeId,
      status: "loading",
    }),
  );

  if (!data.variableName) {
    await publish(
      anthropicChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Anthropic node: Variable name is missing");
  }

  if (!data.userPrompt) {
    await publish(
      anthropicChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Anthropic node: User prompt is missing");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  // const credentialValue = process.env.ANTHROPIC_API_KEY;
  // const anthropic = createAnthropic({
  //   apiKey: credentialValue,
  // });

 
const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const openai = createGoogleGenerativeAI({
  apiKey: credentialValue,
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
});

  try {
    const { text } = await step.ai.wrap(
      "anthropic-generate-text",
      generateText,
      {
        model: openai("gemini-2.5-flash"),
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    await publish(
      anthropicChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return {
      ...context,
      [data.variableName]: {
        text,
      },
    };
  } catch (error) {
    await publish(
      anthropicChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};