import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("Fetching ALL users from Cluster 0...");
  const users = await prisma.user.findMany({ select: { id: true, email: true } });
  console.log(`Total users found: ${users.length}`);
  users.slice(0, 10).forEach(u => console.log(` - ${u.id}: ${u.email}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
