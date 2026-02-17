
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { openAiChannel } from "@/inngest/channels/openai";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type OpenAiData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const openAiExecutor: NodeExecutor<OpenAiData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    openAiChannel().status({
      nodeId: nodeId,
      status: "loading",
    }),
  );

  if (!data.variableName) {
    await publish(
      openAiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("OpenAi node: Variable name is missing");
  }

  if (!data.userPrompt) {
    await publish(
      openAiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("OpenAi node: User prompt is missing");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  // const credentialValue = process.env.OPENAI_API_KEY;

  // const openai = createOpenAI({
  //   apiKey: credentialValue,
  // });

  const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const openai = createGoogleGenerativeAI({
  apiKey: credentialValue,
  baseURL: "https://generativelanguage.googleapis.com/v1beta",
});

  try {
    const { text } = await step.ai.wrap(
      "openai-generate-text",
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
      openAiChannel().status({
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
      openAiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};