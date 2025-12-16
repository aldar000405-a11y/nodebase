// import "server-only";
// import { cache } from "react";
// import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

  
// import { createTRPCContext } from "./init";
// import { makeQueryClient } from "./make-query-client";
// import { appRouter } from "./routers/-app";

// import { appRouter } from "./routers/-app";
// import { createTRPCContext, createCallerFactory } from "./init";
// import { makeQueryClient } from "./make-query-client";
//  Stashed changes

// // Query Client ثابت داخل السيرفر
// export const getQueryClient = cache(makeQueryClient);

  
// // Proxy tRPC للنداءات من السيرفر (Server Components)

// // Proxy tRPC للـ Server Components
 
// export const trpc = createTRPCOptionsProxy({
//   ctx: createTRPCContext,
//   router: appRouter,
//   queryClient: getQueryClient,
// });

//   
// export const createCaller = async () =>
//   appRouter.createCaller(await createTRPCContext());

// // ✅ الطريقة الصحيحة لإنشاء caller
// export const createCaller = async () =>
//   createCallerFactory(appRouter)(await createTRPCContext());
//  Stashed changes
// import { cache } from "react";
// import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";

// import { appRouter } from "./routers/-app";
// import { createTRPCContext, createCallerFactory } from "./init";
// import { makeQueryClient } from "./make-query-client";

// Query Client ثابت داخل السيرفر
// export const getQueryClient = cache(makeQueryClient);

// // Proxy tRPC للـ Server Components
// export const trpc = createTRPCOptionsProxy({
//   ctx: createTRPCContext,
//   router: appRouter,
//   queryClient: getQueryClient,
// });

// // الطريقة الصحيحة لإنشاء caller
export const createCaller = async () =>
  createCallerFactory(appRouter)(await createTRPCContext());

import { cache } from "react";
import { createTRPCOptionsProxy } from "@trpc/tanstack-react-query";
import { createTRPCContext } from "./init";
import { makeQueryClient } from "./make-query-client";
import { appRouter } from "./routers/-app";

export const serverClient = createTRPCOptionsProxy({
  router: appRouter,
  ctx: cache(async () => createTRPCContext()),
  queryClient: makeQueryClient,
});
export const createCaller = cache(async () => {
  const ctx = await createTRPCContext();
  return appRouter.createCaller(ctx);
});
