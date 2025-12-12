import { prisma } from "./src/lib/prisma.js";

async function main() {
  const users = await prisma.user.findMany();
  console.log("Users from DB:", users);
}

main().then(() => process.exit(0));
