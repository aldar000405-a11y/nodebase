
import { PrismaClient } from "./src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
    const users = await prisma.user.findMany();
    console.log("Total users:", users.length);
    users.forEach(u => console.log(`- ${u.email} (${u.id})`));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
