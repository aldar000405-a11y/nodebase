import { prisma } from "./src/lib/prisma";

async function main() {
  try {
    const users = await prisma.user.findMany({ select: { id: true, email: true } });
    console.log("Users from DB:", users);
  } catch (err) {
    console.error("Error querying users:", err);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}

main();
