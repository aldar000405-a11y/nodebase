import "server-only";
import { PrismaClient } from "@/generated/prisma";

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
// biome-ignore lint/suspicious/noExplicitAny: Prisma's $on type requires any for error event handler
prisma.$on("error" as never, (e: any) => {
  console.error("Prisma error:", e.message);
});

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
