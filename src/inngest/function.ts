import { inngest } from "./client";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { createAnthropic } from "@ai-sdk/anthropic";
import { generateText } from "ai";
import * as  Sentry from "@sentry/nextjs";
import { gemini } from "inngest";
// import { anthropic } from "inngest";


const google = createGoogleGenerativeAI();
const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});
const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "sk-placeholder", // Fallback for missing key
});

export const execute = inngest.createFunction(
  {id : "execute-ai"},
  { event: "execute/ai" },
  async ({ event, step }) => {
    await step.sleep("pretend", "5s");
    Sentry.logger.info('user triggered AI execution', { log_source:
      'sentry_source'
    })


    const {steps: geminiSteps} = await step.ai.wrap(
      "generate-with-multiple-models",
      generateText,
      {
        model:  google('gemini-2.5-flash'),
        system: "You are a helpful assistant.",
        prompt: "Write a vegetarian lasagna recipe for 4 people.",
        experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        }
      }
    );
    const {steps: openaiSteps} = await step.ai.wrap(
      "generate-with-openai",
      generateText,
      {
        model:  openai('gpt-4o-mini') as any,
        system: "You are a helpful assistant.",
        prompt: "Write a vegetarian lasagna recipe for 4 people.",
         experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        }
      }
    );
    const {steps: anthropicSteps} = await step.ai.wrap(
      "generate-with-anthropic",
      generateText,
      {
        model:  anthropic('claude-3-5-sonnet-20241022') as any,
        system: "You are a helpful assistant.",
        prompt: "Write a vegetarian lasagna recipe for 4 people.",
         experimental_telemetry: {
          isEnabled: true,
          recordInputs: true,
          recordOutputs: true,
        }
      }
    );
    return{
      geminiSteps,
      openaiSteps,
      anthropicSteps,
    }
  },
);

// Test hello.world function for workflow testing
export const helloWorld = inngest.createFunction(
  { 
    id: "test-hello-world",
  },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    try {
      console.log("Hello world function triggered for email:", event.data.email);
      
      // Simulate some work
      await step.sleep("wait-a-moment", "2s");
      
      console.log("Hello world function completed");
      return { 
        success: true, 
        message: `Workflow created and processed for ${event.data.email}`,
        email: event.data.email,
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      console.error("Hello world function error:", error);
      throw error;
    }
  }
);








// const google = createGoogleGenerativeAI();
// const openai = createOpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });
// const anthropic = createAnthropic({
//   apiKey: process.env.ANTHROPIC_API_KEY || "",
// });

// export const execute = inngest.createFunction(
//   { 
//     id: "execute-ai",
//     retries: 2,
//   },
//   { event: "execute/ai" },
//   async ({ event, step }) => {
//     await step.sleep("simulate-wait", "5s");
//     try {
//       console.log("Starting AI execution with prompt:", event.data.prompt);
      
//       const geminiResult = await step.ai("generate-with-gemini", async () => {
//         return await generateText({
//           model: google('gemini-2.5-flash'),
//           system: "You are a helpful assistant.",
//           prompt: event.data.prompt,
//       });
//       });

//       const openaiResult = await step.ai("generate-with-openai", async () => {
//         return await generateText({
//           model: openai('gpt-4o-mini'),
//           system: "You are a helpful assistant.",
//           prompt: event.data.prompt,
//         });
//       });

//       const anthropicResult = await step.ai("generate-with-anthropic", async () => {
//         return await generateText({
//           model: anthropic('claude-3-5-sonnet-20241022'),
//           system: "You are a helpful assistant.",
//           prompt: event.data.prompt,
//         });
//       });

//       console.log("AI execution completed successfully");
//       return {
//         success: true,
//         message: "AI generation completed with all models",
//         results: {
//           gemini: geminiResult,
//           openai: openaiResult,
//           anthropic: anthropicResult,
//         }
//       };
//     } catch (error) {
//       console.error("AI execution error:", error);
//       throw error;
//     }
//   }
// );

// // Test hello.world function for workflow testing
// export const helloWorld = inngest.createFunction(
//   { 
//     id: "test-hello-world",
//   },
//   { event: "test/hello.world" },
//   async ({ event, step }) => {
//     try {
//       console.log("Hello world function triggered for email:", event.data.email);
      
//       // Simulate some work
//       await step.sleep("wait-a-moment", "2s");
      
//       console.log("Hello world function completed");
//       return { 
//         success: true, 
//         message: `Workflow created and processed for ${event.data.email}`,
//         email: event.data.email,
//         timestamp: new Date().toISOString(),
//       };
//     } catch (error) {
//       console.error("Hello world function error:", error);
//       throw error;
//     }
//   }
// );