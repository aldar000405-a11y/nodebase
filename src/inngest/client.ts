import { Inngest } from "inngest";

// Lazy-loaded Inngest client to avoid initialization issues
let inngestInstance: Inngest | null = null;

function getInngestClient(): Inngest {
  if (inngestInstance) {
    return inngestInstance;
  }

  inngestInstance = new Inngest({ 
    id: "nodebase",
    eventKey: process.env.INNGEST_EVENT_KEY,
    signingKey: process.env.INNGEST_SIGNING_KEY,
    // Use baseUrl if available for local development
    baseUrl: process.env.INNGEST_BASE_URL || "https://inn.inngest.com",
    // Disable automatic schema registration and validation to avoid connection attempts
    dangerouslySkipSchemaValidation: true,
    // Set retry options to be more lenient
    retry: {
      attempts: 0, // Don't retry to avoid hanging
      initialDelayMs: 0,
    },
  });

  return inngestInstance;
}

// Lazy getter to avoid initialization on module load
export const inngest = new Proxy({} as Inngest, {
  get: (target, prop) => {
    const client = getInngestClient();
    return (client as any)[prop];
  },
}) as Inngest;