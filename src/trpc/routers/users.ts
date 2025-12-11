import { createTRPCRouter, publicProcedure } from "../init";
import { prisma } from "@/lib/prisma";

export const usersRouter = createTRPCRouter({
  getUsers: publicProcedure.query(async () => {
    return prisma.user.findMany();
  }),
});
