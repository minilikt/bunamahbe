import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  // Find the candidate by username
  const candidate = await prisma.candidate.findFirst({
    where: { username: { equals: "zionmeks", mode: "insensitive" } },
    select: { id: true, name: true, voteCount: true },
  });

  if (!candidate) {
    console.error("❌ Could not find candidate with username 'zionmeks'");
    process.exit(1);
  }

  console.log(`✅ Found candidate: ${candidate.name} (${candidate.id})`);
  console.log(`   voteCount field: ${candidate.voteCount}`);

  // Get all votes for this candidate
  const votes = await prisma.vote.findMany({
    where: { candidateId: candidate.id },
    select: { id: true, userId: true, createdAt: true },
    orderBy: { createdAt: "desc" },
  });

  console.log(`\n📊 Total vote records in DB: ${votes.length}`);

  if (votes.length === 0) {
    console.log("No votes found.");
    return;
  }

  const userIds = votes.map((v) => v.userId);

  // Try to find matching users
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true },
  });

  console.log(`\n👥 Users found in DB for those userIds: ${users.length} / ${votes.length}`);

  if (users.length === 0) {
    console.log("\n⚠️  No user records matched! Showing raw vote userIds:");
    votes.forEach((v, i) => {
      console.log(`  ${i + 1}. userId: ${v.userId}  (voted ${v.createdAt.toISOString()})`);
    });

    // Also check if any account records exist for these userIds
    const accounts = await prisma.account.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, accountId: true, providerId: true },
    });
    console.log(`\n🔑 Account records found for those userIds: ${accounts.length}`);
    accounts.forEach((a) => {
      console.log(`  userId: ${a.userId} | provider: ${a.providerId} | accountId: ${a.accountId}`);
    });
  } else {
    const userMap = new Map(users.map((u) => [u.id, u]));
    const resolved = votes.filter((v) => userMap.has(v.userId));
    const orphaned = votes.filter((v) => !userMap.has(v.userId));

    console.log(`\n✅ Resolved (${resolved.length}):`);
    resolved.forEach((v, i) => {
      const u = userMap.get(v.userId)!;
      console.log(`  ${i + 1}. ${u.name} <${u.email}>`);
    });

    if (orphaned.length > 0) {
      console.log(`\n❌ Orphaned votes — userId not in user table (${orphaned.length}):`);
      orphaned.forEach((v, i) => {
        console.log(`  ${i + 1}. userId: ${v.userId}`);
      });
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
