import { inngest } from "./client";

export const analyzeProjectUx = inngest.createFunction(
  {
    id: "analyze-project-ux",
    retries: 1,
  },
  { event: "projects/analyze.requested" },
  async ({ event, step }) => {
    const { projectId, userId, payload } = event.data;

    await step.run("validate-input", async () => {
      if (!projectId || !userId) {
        throw new Error("Missing required project analysis inputs");
      }
    });

    const summary = await step.run("summarize-ux-payload", async () => {
      const size = JSON.stringify(payload ?? {}).length;
      return {
        status: "queued",
        payloadBytes: size,
      };
    });

    return {
      projectId,
      userId,
      summary,
    };
  },
);
