import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  console.log("--- Google Form Webhook POST received ---");
  try {
    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");
    console.log("Extracted workflowId:", workflowId);

    if (!workflowId) {
      console.error("Missing required query parameter: workflowId");
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter: workflowId",
        },
        { status: 400 },
      );
    }
    const body = await request.json();
    console.log("Received request body:", JSON.stringify(body, null, 2));

    const formData = {
      formId: body.formId,
      formTitle: body.formTitle,
      responseId: body.responseId,
      timestamp: body.timestamp,
      respondentEmail: body.respondentEmail,
      responses: body.responses,
      raw: body,
    };
    console.log("Constructed formData:", JSON.stringify(formData, null, 2));

    // trigger and inngest job
    console.log("Calling sendWorkflowExecution with:", {
      workflowId,
      initialData: {
        googleForm: formData,
      },
    });
    await sendWorkflowExecution({
      workflowId,
      initialData: {
        googleForm: formData,
      },
    });
    console.log("sendWorkflowExecution called successfully.");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Google form webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process Google Form submission" },
      { status: 500 },
    );
  }
}
