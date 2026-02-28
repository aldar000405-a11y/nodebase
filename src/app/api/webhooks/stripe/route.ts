import { sendWorkflowExecution } from "@/inngest/utils";
import { type NextRequest, NextResponse } from "next/server";
import crypto from "node:crypto";

const verifyWebhookSecret = (request: NextRequest): boolean => {
  const secret = process.env.WEBHOOK_SECRET;
  if (!secret) return true; // Skip verification if no secret is configured
  const providedSecret = request.headers.get("x-webhook-secret");
  if (!providedSecret) return false;
  return crypto.timingSafeEqual(
    Buffer.from(secret),
    Buffer.from(providedSecret),
  );
};

export async function POST(request: NextRequest) {
  try {
    if (!verifyWebhookSecret(request)) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    const url = new URL(request.url);
    const workflowId = url.searchParams.get("workflowId");

    if (!workflowId) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required query parameter: workflowId",
        },
        { status: 400 },
      );
    }
    const body = await request.json();

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
  } catch {
    console.error("Stripe webhook error");
    return NextResponse.json(
      { success: false, error: "Failed to process Stripe event" },
      { status: 500 },
    );
  }
}
