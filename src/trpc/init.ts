// // src/trpc/init.ts
// import { initTRPC, TRPCError } from "@trpc/server";
// // import { FetchCreateContextFnOptions } from "@trpc/server/adapters/fetch";
// // import { TRPCError } from "@trpc/server";
// import { auth } from "@/lib/auth";
// import { headers } from "next/headers";
// import {cache} from "react";

// export const createTRPCContext = cache(async () => {
//   return{ userId: 'user-123' };
//  });

//  const t = initTRPC.create({

//  })

// export const createTRPCRouter = t.router;
// export const baseProcedure = t.procedure;
// export const createCallerFactory = t.createCallerFactory;
// export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
//   const session = await auth.api.getSession({
//   headers: await headers(),
//   });
//   if (!session) {
//     throw new TRPCError({
//       code: "UNAUTHORIZED",
//       message: "You must be logged in to access this resource",
//     });
//   }

//   return next({ ctx: { ...ctx, auth: session  } });
// });


// src/trpc/init.ts
import { initTRPC, TRPCError } from "@trpc/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const createTRPCContext = async () => {
  // استدعاء جلسة المستخدم لكل request
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return {
    session, // يحتوي على user إذا مسجل دخول
    userId: session?.user?.id ?? null,
  };
};

const t = initTRPC.create({});

// tRPC exports
export const createTRPCRouter = t.router;
export const baseProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;

// Protected procedure
export const protectedProcedure = baseProcedure.use(async ({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "You must be logged in to access this resource",
    });
  }

  // تمرير session و userId إلى ctx للـ procedures اللاحقة
  return next({
    ctx: {
      ...ctx,
      userId: ctx.session.user.id,
      auth: ctx.session,
    },
  });
});


