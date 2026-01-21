import { serve } from "inngest/next";
import { inngest } from "@/inngest/client";
import { execute, helloWorld } from "@/inngest/function";

// Create an API that serves Inngest functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    execute,
    helloWorld,
  ],
});