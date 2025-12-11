// import { baseProcedure, createTRPCRouter } from '../init';
// import prisma from '@/lib/db';
// export const appRouter = createTRPCRouter({
//   getUsers: baseProcedure.query(() => {
//       return prisma.user.findMany();
//     }),
// });
// // export type definition of API
// export type AppRouter = typeof appRouter;


// import { router } from '../init';
// import { postsRouter } from './posts';

// export const appRouter = router({
//   posts: postsRouter,
// });

// export type AppRouter = typeof appRouter;

// import { createTRPCRouter } from "../init";
// import { usersRouter } from "./users";

// export const appRouter = createTRPCRouter({
//   users: usersRouter,
// });

// export type AppRouter = typeof appRouter;


import { createTRPCRouter } from "../init";
import { usersRouter } from "./users";

export const appRouter = createTRPCRouter({
  users: usersRouter,
});

export type AppRouter = typeof appRouter;
