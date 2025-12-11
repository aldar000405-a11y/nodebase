import "server-only";
import { cache } from "react";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

import { createTRPCContext } from "./init";
import { makeQueryClient } from "./make-query-client";
import { appRouter } from "./routers/-app";

// Query Client ثابت داخل السيرفر
export const getQueryClient = cache(makeQueryClient);

// Proxy tRPC للنداءات من السيرفر (Server Components)
export const trpc = createTRPCOptionsProxy({
  ctx: createTRPCContext,
  router: appRouter,
  queryClient: getQueryClient,
});

// Caller مباشر (بدون React Query)
export const caller = appRouter.createCaller({});
