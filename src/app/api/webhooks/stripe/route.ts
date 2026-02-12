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

    const stripeData = {
      eventId: body.id,
      eventType: body.type,
      timestamp: body.created,
      livemode: body.livemode,
      raw: body.data?.object,
     
    };
 
    await sendWorkflowExecution({
      workflowId,
      initialData: {
        stripe: stripeData,
      },
    });


    return NextResponse.json(
       { success: true },
       { status: 200 },
      );
  } catch (error) {
    console.error("Stripe webhook error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process Stripe event" },
      { status: 500 },
    );
  }
}
