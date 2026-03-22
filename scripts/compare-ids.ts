import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("Sample Users:");
  const users = await prisma.user.findMany({ take: 5 });
  users.forEach(u => console.log(`- ID: ${u.id}, Email: ${u.email}`));

  console.log("\nSample Votes:");
  const votes = await prisma.vote.findMany({ take: 5 });
  votes.forEach(v => console.log(`- ID: ${v.id}, userId: ${v.userId}, candidateId: ${v.candidateId}`));
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
