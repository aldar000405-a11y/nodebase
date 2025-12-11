import { PrismaClient } from "@prisma/client";

let prisma;

if (!global.__prisma) {
  global.__prisma = new PrismaClient({
    log: ["query"],
  });
}

prisma = global.__prisma;

export { prisma };
