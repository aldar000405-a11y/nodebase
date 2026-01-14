import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "@/trpc/routers/-app";
import { createTRPCContext } from "@/trpc/init";

export const runtime = "nodejs";

const handler = (req: Request) =>
  fetchRequestHandler({
    endpoint: "/api/trpc",
    req,
    router: appRouter,
    createContext: createTRPCContext,
    onError({ error, path, type }) {
      console.error("[tRPC error]", {
        path,
        type,
        message: error.message,
      });
    },
  });

export const GET = handler;
export const POST = handler;

