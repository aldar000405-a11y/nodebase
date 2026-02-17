import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { geminiChannel } from "@/inngest/channels/gemini";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type GeminiData = {
  variableName?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  await publish(
    geminiChannel().status({
      nodeId: nodeId,
      status: "loading",
    }),
  );

  if (!data.variableName) {
    await publish(
      geminiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Gemini node: Variable name is missing");
  }

  if (!data.userPrompt) {
    await publish(
      geminiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("Gemini node: User prompt is missing");
  }

  const systemPrompt = data.systemPrompt
    ? Handlebars.compile(data.systemPrompt)(context)
    : "You are a helpful assistant.";
  const userPrompt = Handlebars.compile(data.userPrompt)(context);

  const credentialValue = process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  // ✅ التعديل 1: استخدام v1beta بدلاً من v1
  const google = createGoogleGenerativeAI({
    apiKey: credentialValue,
    baseURL: "https://generativelanguage.googleapis.com/v1beta",
  });

  try {
    const { text } = await step.ai.wrap(
      "gemini-generate-text",
      generateText,
      {
        // ✅ التعديل 2: استخدام gemini-2.5-flash بدلاً من gemini-1.5-flash
        model: google("gemini-2.5-flash"),
        // ✅ التعديل 3: دمج system و user في prompt واحد
        prompt: `${systemPrompt}\n\n${userPrompt}`,
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        },
      },
    );

    await publish(
      geminiChannel().status({
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
      geminiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};