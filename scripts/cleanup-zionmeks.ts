import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  console.log("🔗 Connecting to database...");

  // 1. Find the candidate "zionmeks"
  const candidate = await prisma.candidate.findFirst({
    where: { username: { equals: "zionmeks", mode: "insensitive" } },
    select: { id: true, name: true, voteCount: true },
  });

  if (!candidate) {
    console.error("❌ Could not find candidate with username 'zionmeks'");
    process.exit(1);
  }

  console.log(`✅ Found candidate: ${candidate.name} (${candidate.id})`);
  console.log(`📊 Current voteCount field: ${candidate.voteCount}`);

  // 2. Get all votes for this candidate, ordered by createdAt (oldest first)
  const allVotes = await prisma.vote.findMany({
    where: { candidateId: candidate.id },
    select: { id: true, createdAt: true },
    orderBy: { createdAt: "asc" },
  });

  console.log(`📊 Actual votes in database: ${allVotes.length}`);

  if (allVotes.length <= 164) {
    console.log("⚠️  Candidate already has 164 or fewer votes. No action needed.");
    return;
  }

  // 3. Keep the first 164, delete the rest
  const votesToKeep = allVotes.slice(0, 164);
  const votesToDelete = allVotes.slice(164);

  console.log(`🗑️  Keeping ${votesToKeep.length} votes. Deleting ${votesToDelete.length} votes...`);

  const deleteResult = await prisma.vote.deleteMany({
    where: {
      id: { in: votesToDelete.map((v) => v.id) },
    },
  });

  console.log(`✅ Deleted ${deleteResult.count} votes.`);

  // 4. Update candidate voteCount to 164 (or the actual count)
  const newVoteCount = 164;
  await prisma.candidate.update({
    where: { id: candidate.id },
    data: { voteCount: newVoteCount },
  });

  console.log(`✅ Updated candidate voteCount to ${newVoteCount}.`);
  console.log("🎉 Cleanup complete!");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
