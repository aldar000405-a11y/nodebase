// import { PrismaClient } from '@/generated/prisma';
// export const prisma = new PrismaClient();
// import { PrismaClient } from "@prisma/client";

// export const prisma = new PrismaClient();
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
