import { PrismaClient } from "@/generated/prisma"; // لأنك ولدت client هنا

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // لا تضع أي accelerateUrl
    log: ["query"], // اختياري: لتسجيل الاستعلامات
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
