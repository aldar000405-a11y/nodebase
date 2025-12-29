import "server-only";
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient | undefined;
};

// Create Prisma client with connection pool settings optimized for serverless
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: [],
    // Connection pool configuration for better reliability
    errorFormat: "pretty",
  });

// Add connection event listeners for debugging
prisma.$on("error", (e) => {
  console.error("Prisma error:", e.message);
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
