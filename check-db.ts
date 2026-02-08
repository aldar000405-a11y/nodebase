import fs from "node:fs";
import { PrismaClient } from "./src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany({
    include: {
      _count: {
        select: { workflows: true },
      },
    },
  });

  const workflows = await prisma.workflow.findMany({
    take: 10,
    orderBy: { updatedAt: "desc" },
    select: { id: true, name: true, userId: true },
  });

  const data = {
    users: users.map((u) => ({
      email: u.email,
      id: u.id,
      workflowCount: u._count.workflows,
    })),
    workflows: workflows,
  };

  fs.writeFileSync("db-diag.json", JSON.stringify(data, null, 2));
  console.log("Diagnostics saved to db-diag.json");
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
