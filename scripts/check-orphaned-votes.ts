import { PrismaClient } from '@prisma/client';
import "dotenv/config";

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log("Checking for orphaned votes...");
    
    const votes = await prisma.vote.findMany({
      select: {
        id: true,
        userId: true,
        candidateId: true
      }
    });

    console.log(`Total votes found: ${votes.length}`);

    const userIds = [...new Set(votes.map(v => v.userId))];
    const candidateIds = [...new Set(votes.map(v => v.candidateId))];

    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true }
    });
    const existingUserIds = new Set(users.map(u => u.id));

    const candidates = await prisma.candidate.findMany({
      where: { id: { in: candidateIds } },
      select: { id: true }
    });
    const existingCandidateIds = new Set(candidates.map(c => c.id));

    const orphanedVotes = votes.filter(v => !existingUserIds.has(v.userId));
    const missingCandidates = votes.filter(v => !existingCandidateIds.has(v.candidateId));

    console.log(`\nResults:`);
    console.log(`- Orphaned votes (missing user): ${orphanedVotes.length}`);
    console.log(`- Votes with missing candidate: ${missingCandidates.length}`);

    if (orphanedVotes.length > 0) {
      console.log(`❌ Found ${orphanedVotes.length} orphaned votes (user not found).`);
      orphanedVotes.forEach(v => console.log(`- Vote ID: ${v.id}, User ID: ${v.userId}`));
      
      // Suggesting a fix script
      console.log("\nTo fix this, you should delete these orphaned votes.");
    } else {
      console.log("✅ No orphaned votes (missing users) found.");
    }

    if (missingCandidates.length > 0) {
      console.log(`❌ Found ${missingCandidates.length} votes with missing candidates:`);
      missingCandidates.forEach(v => console.log(`- Vote ID: ${v.id}, Candidate ID: ${v.candidateId}`));
    } else {
      console.log("✅ No votes with missing candidates found.");
    }

  } catch (error) {
    console.error("Error running diagnostic:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
