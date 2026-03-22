import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const orphanedId = "69c04cc8aea013cb554d1a1f";
  console.log(`🔎 Searching for Orphaned ID: ${orphanedId} in Cluster 0\n`);

  // 1. Search in User table by ID
  const userById = await prisma.user.findUnique({ where: { id: orphanedId } });
  console.log("1. User by ID:", userById ? `FOUND (${userById.email})` : "NOT FOUND");

  // 2. Search in Account table by userId or accountId
  const accountByUserId = await prisma.account.findFirst({ where: { userId: orphanedId } });
  const accountByAccountId = await prisma.account.findFirst({ where: { accountId: orphanedId } });
  console.log("2. Account by userId:   ", accountByUserId ? `FOUND (${accountByUserId.accountId})` : "NOT FOUND");
  console.log("   Account by accountId:", accountByAccountId ? `FOUND (${accountByAccountId.providerId})` : "NOT FOUND");

  // 3. Search for ANY user whose email or name might be related (long shot)
  // Or just check the total number of users
  const totalUsers = await prisma.user.count();
  console.log(`\nTotal Users in Cluster 0: ${totalUsers}`);

  // 4. Check if there are ANY users with IDs starting with "69"
  const usersStartingWith69 = await prisma.user.findMany({
    where: { id: { startsWith: "69" } },
    take: 5
  });
  console.log(`Users with ID starting with '69': ${usersStartingWith69.length}`);
  usersStartingWith69.forEach(u => console.log(` - ${u.id} (${u.email})`));

  // 5. Check if there are ANY candidates with this ID (unlikely)
  const candidate = await prisma.candidate.findUnique({ where: { id: orphanedId } });
  console.log("Candidate by ID:", candidate ? "FOUND" : "NOT FOUND");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
