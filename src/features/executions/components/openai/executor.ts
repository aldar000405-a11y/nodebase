
import { generateText } from "ai";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import Handlebars from "handlebars";
import { NonRetriableError } from "inngest";
import type { NodeExecutor } from "@/features/executions/types";
import { openAiChannel } from "@/inngest/channels/openai";
import prisma from "@/lib/db";
import { decrypt } from "@/lib/encryption";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type OpenAiData = {
  variableName?: string;
  credentialId?: string;
  systemPrompt?: string;
  userPrompt?: string;
};

export const openAiExecutor: NodeExecutor<OpenAiData> = async ({
  data,
  nodeId,
  userId,
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

  if (!data.credentialId) {
    await publish(
      openAiChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw new NonRetriableError("OpenAi node: Credential is missing");
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

  const credential = await step.run(`get-credential-${nodeId}`, () => {
        return prisma.credential.findUnique({
          where: {
            id: data.credentialId,
            userId,
          },
        });
      });
  
      if (!credential) {
        await publish(
          openAiChannel().status({
            nodeId,
            status: "error",
          })
        );
         throw new NonRetriableError("OpenAI node: Credential not found");
      }
      

  // const openai = createOpenAI({
  //   apiKey: credentialValue,
  // });

const openai = createGoogleGenerativeAI({
  apiKey: decrypt(credential.value),
});

  try {
    const { text } = await step.run(`openai-generate-text-${nodeId}`, async () => {
      const result = await generateText({
        model: openai("gemini-2.5-flash"),
        prompt: `${systemPrompt}\n\n${userPrompt}`,
      });
      return { text: result.text };
    });

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