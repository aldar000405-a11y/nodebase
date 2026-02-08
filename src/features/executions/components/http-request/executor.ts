import Handlebars from "handlebars";
import type { NodeExecutor } from "@/features/executions/types";
import { NonRetriableError } from "inngest";
import ky, { type Options as KyOptions } from "ky";
import { httpRequestChannel } from "@/inngest/channels/http-request";

Handlebars.registerHelper("json", (context) => {
  const jsonString = JSON.stringify(context, null, 2);
  const safeString = new Handlebars.SafeString(jsonString);
  return safeString;
});

type HttpRequestData = {
  variableName: string;
  endpoint: string;
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: string;
};

export const httpRequestExecutor: NodeExecutor<HttpRequestData> = async ({
  data,
  nodeId,
  context,
  step,
  publish,
}) => {
  // Create a unique step ID that includes node config to bust Inngest cache when config changes
  const configHash = Buffer.from(JSON.stringify(data))
    .toString("hex")
    .slice(0, 8);
  const stepId = `http-${nodeId.slice(-8)}-${configHash}`;

  console.log(`[Executor ${nodeId.slice(-8)}] stepId generated: ${stepId}`);
  console.log(`[Executor ${nodeId.slice(-8)}] Publishing loading status`);

  // Publish loading status OUTSIDE of step.run so it always runs
  await publish(
    httpRequestChannel().status({
      nodeId: nodeId,
      status: "loading",
    }),
  );

  try {
    console.log(
      `[Executor ${nodeId.slice(-8)}] Entering step.run with id: ${stepId}`,
    );
    // All logic inside step.run so the step ALWAYS appears in Inngest
    const result = await step.run(stepId, async () => {
      console.log(`[Executor ${nodeId.slice(-8)}] Inside step.run callback`);
      // Validate inside step
      if (!data.endpoint) {
        throw new NonRetriableError(
          "HTTP Request node: No endpoint configured",
        );
      }

      if (!data.variableName) {
        throw new NonRetriableError(
          "HTTP Request node: Variable name not configured",
        );
      }

      if (!data.method) {
        throw new NonRetriableError(
          "HTTP Request node: HTTP method not configured",
        );
      }

      const endpoint = Handlebars.compile(data.endpoint)(context);
      const method = data.method;

      const options: KyOptions = { method };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        const bodySource = (data.body || "").trim() || "{}";
        const resolved = Handlebars.compile(bodySource)(context);

        try {
          JSON.parse(resolved);
        } catch {
          throw new NonRetriableError(
            `HTTP Request node: Invalid JSON body - ${resolved.substring(0, 100)}`,
          );
        }

        options.body = resolved;
        options.headers = {
          "Content-Type": "application/json",
        };
      }

      const response = await ky(endpoint, options);
      const contentType = response.headers.get("content-type");
      const responseData = contentType?.includes("application/json")
        ? await response.json()
        : await response.text();

      const responsePayload = {
        httpResponse: {
          status: response.status,
          statusText: response.statusText,
          data: responseData,
        },
      };

      return {
        ...context,
        [data.variableName]: responsePayload,
      };
    });

    console.log(`[Executor ${nodeId.slice(-8)}] Publishing success status`);

    // Publish success OUTSIDE of step.run
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "success",
      }),
    );

    return result;
  } catch (error) {
    console.log(`[Executor ${nodeId.slice(-8)}] Publishing error status`);

    // Publish error OUTSIDE of step.run
    await publish(
      httpRequestChannel().status({
        nodeId,
        status: "error",
      }),
    );
    throw error;
  }
};
