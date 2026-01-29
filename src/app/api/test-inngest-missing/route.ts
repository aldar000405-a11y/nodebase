import { NextResponse } from "next/server";
import { inngest } from "@/inngest/client";

export async function GET() {
  try {
    // Send the event intentionally without workflowId to trigger the
    // NonRetriableError inside your Inngest function (if running in dev).
    await inngest.send({
      name: "workflows/execute.workflow",
      data: {},
    });

    return NextResponse.json(
      { ok: false, message: "Failed: Workflow ID is missing" },
      { status: 400 }
    );
  } catch (err: any) {
    // Surface any immediate send errors to help debugging.
    return new NextResponse(JSON.stringify({ ok: false, error: String(err) }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}
