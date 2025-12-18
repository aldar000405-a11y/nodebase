import { cache } from "react";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { appRouter } from "./routers/-app";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./make-query-client";

/**
 * Proxy للـ Server Components
 * يمكن استدعاء أي إجراء من appRouter مباشرة على السيرفر
 * مع سياق Prisma والـ Auth
 */
export const serverClient = createTRPCOptionsProxy({
  router: appRouter,
  ctx: cache(async () => createTRPCContext()),
  queryClient: makeQueryClient,
});

/**
 * إنشاء caller لاستخدامه في أي مكان على السيرفر
 * مثلاً في Server Component أو API Route
 */
export const createCaller = cache(async () => {
  const ctx = await createTRPCContext();
  return appRouter.createCaller(ctx);
});
