import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const targetId = "69c04cc8aea013cb554d1a1f";
  console.log(`🔍 Debugging ID: ${targetId} in Cluster 0\n`);

  const [user, account, vote, session] = await Promise.all([
    prisma.user.findUnique({ where: { id: targetId } }),
    prisma.account.findFirst({ where: { OR: [{ userId: targetId }, { accountId: targetId }] } }),
    prisma.vote.findUnique({ where: { userId: targetId } }),
    prisma.session.findFirst({ where: { userId: targetId } }),
  ]);

  console.log("Results:");
  console.log("- User:   ", user ? `Found (Email: ${user.email})` : "Not Found");
  console.log("- Account:", account ? `Found (Provider: ${account.providerId}, ID: ${account.accountId})` : "Not Found");
  console.log("- Vote:   ", vote ? `Found (Candidate: ${vote.candidateId})` : "Not Found");
  console.log("- Session:", session ? "Found" : "Not Found");

  if (!user && !account) {
    console.log("\n⚠️ ID not found in User or Account tables.");
    // Check if it's an ObjectId issue
    console.log("Checking for raw collections...");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
