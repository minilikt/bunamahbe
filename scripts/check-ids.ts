import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("Checking User IDs in Cluster 0...");
  const users = await prisma.user.findMany({ take: 10 });
  if (users.length === 0) {
    console.log("❌ No users found in Cluster 0!");
  } else {
    users.forEach(u => {
      console.log(`- ID: ${u.id} | Email: ${u.email}`);
    });
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
