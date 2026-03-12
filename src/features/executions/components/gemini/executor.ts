import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText } from "ai";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { geminiChannel } from "@/inngest/channels/gemini";
import { prisma } from "@/lib/prisma";
import { decrypt } from "@/lib/encryption";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type GeminiData = {
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const geminiExecutor: NodeExecutor<GeminiData> = async ({
  data,
  nodeId,
  userId,
  context,
  step,
  publish,
}) => {
  await step.run(`gemini-loading-${nodeId}`, async () => {
    await publish(
      geminiChannel().status({
        nodeId: nodeId,
        status: "loading",
      }),
    );
  });

  
  if (!data.variableName) {
    await step.run(`gemini-error-var-${nodeId}`, async () => {
      await publish(
        geminiChannel().status({
          nodeId,
          status: "error",
        }),
      );
    });
    throw new NonRetriableError("Gemini node: Variable name is missing");
  }
  if (!data.credentialId) {
    await step.run(`gemini-error-cred-${nodeId}`, async () => {
      await publish(
        geminiChannel().status({
          nodeId,
          status: "error",
        }),
      );
    });
    throw new NonRetriableError("Gemini node: Credential ID is missing");
  }

  if (!data.userPrompt) {
    await step.run(`gemini-error-prompt-${nodeId}`, async () => {
      await publish(
        geminiChannel().status({
          nodeId,
          status: "error",
        }),
      );
    });
    throw new NonRetriableError("Gemini node: User prompt is missing");
  }

  try {
    const systemPrompt = data.systemPrompt
      ? Handlebars.compile(data.systemPrompt)(context)
      : "You are a helpful assistant.";
    const userPrompt = Handlebars.compile(data.userPrompt)(context);

    const credential = await step.run(`get-credential-${nodeId}`, () => {
      return prisma.credential.findUnique({
        where: {
          id: data.credentialId,
          userId,
        },
      });
    });

    if (!credential) {
      await step.run(`gemini-error-nocred-${nodeId}`, async () => {
        await publish(
          geminiChannel().status({
            nodeId,
            status: "error",
          }),
        );
      });
      throw new NonRetriableError("Gemini node: Credential not found");
    }

    const google = createGoogleGenerativeAI({
      apiKey: decrypt(credential.value),
    });

    const { text } = await step.run(`gemini-generate-text-${nodeId}`, async () => {
      const result = await generateText({
        model: google("gemini-2.5-flash"),
        prompt: `${systemPrompt}\n\n${userPrompt}`,
      });
      return { text: result.text };
    });

    await step.run(`gemini-success-${nodeId}`, async () => {
      await publish(
        geminiChannel().status({
          nodeId,
          status: "success",
        }),
      );
    });

    return {
      ...context,
      [data.variableName]: {
        text,
      },
    };
  } catch (error) {
    await step.run(`gemini-error-catch-${nodeId}`, async () => {
      await publish(
        geminiChannel().status({
          nodeId,
          status: "error",
        }),
      );
    });
    throw error;
  }
};