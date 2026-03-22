import { PrismaClient } from '@prisma/client';
import "dotenv/config";

async function main() {
  const prisma = new PrismaClient();

  try {
    console.log("Starting cleanup of orphaned votes...");
    
    // 1. Fetch all votes
    const votes = await prisma.vote.findMany({
      select: {
        id: true,
        userId: true
      }
    });

    console.log(`Total votes found: ${votes.length}`);

    // 2. Identify existing users
    const userIds = [...new Set(votes.map(v => v.userId))];
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true }
    });
    const existingUserIds = new Set(users.map(u => u.id));

    // 3. Filter orphaned votes
    const orphanedVoteIds = votes
      .filter(v => !existingUserIds.has(v.userId))
      .map(v => v.id);

    if (orphanedVoteIds.length === 0) {
      console.log("✅ No orphaned votes found. Database is clean.");
      return;
    }

    console.log(`❌ Found ${orphanedVoteIds.length} orphaned votes.`);
    console.log("Deleting orphaned votes...");

    // 4. Delete orphaned votes
    const deleteResult = await prisma.vote.deleteMany({
      where: {
        id: { in: orphanedVoteIds }
      }
    });

    console.log(`✅ Successfully deleted ${deleteResult.count} orphaned votes.`);

  } catch (error) {
    console.error("Error during cleanup:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
