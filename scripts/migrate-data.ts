import { PrismaClient } from '@prisma/client';
import "dotenv/config";

async function main() {
  const dryRun = process.argv.includes('--dry-run');

  const mainDbUrl = process.env.DATABASE_URL;
  const secondaryDbUrl = process.env.DATABASE_URL_C3;

  if (!mainDbUrl || !secondaryDbUrl) {
    console.error("❌ Error: DATABASE_URL or DATABASE_URL_C3 is not defined");
    process.exit(1);
  }

  const prismaMain = new PrismaClient({ datasourceUrl: mainDbUrl });
  const prismaSecondary = new PrismaClient({ datasourceUrl: secondaryDbUrl });

  try {
    console.log(`\nStarting migration (Dry-Run: ${dryRun})\n`);

    // 1. Fetch missing user IDs
    const secondaryUsers = await prismaSecondary.user.findMany({
      select: { id: true, email: true }
    });
    const mainUsers = await prismaMain.user.findMany({
      select: { email: true }
    });
    const mainEmails = new Set(mainUsers.map(u => u.email));
    
    const missingUsersFromSec = secondaryUsers.filter(u => !mainEmails.has(u.email));
    const missingUserIds = missingUsersFromSec.map(u => u.id);

    console.log(`Found ${missingUserIds.length} missing users in Cluster 3 (by email).`);

    if (missingUserIds.length === 0) {
      console.log("No data to migrate. Both databases are in sync.");
      return;
    }

    // 2. Fetch all data for these users
    console.log("Fetching data from Cluster 3...");
    const usersToMigrate = await prismaSecondary.user.findMany({
      where: { id: { in: missingUserIds } },
      include: {
        accounts: true,
        votes: true,
        posts: {
          include: {
            likes: true,
            comments: true
          }
        }
      }
    });

    // Also get likes/comments on posts that AREN'T by these users? 
    // User requested "everything... candidates and there vote numbers... took question... that too".
    // Usually that means everything about these users.
    
    let userCount = 0;
    let accountCount = 0;
    let voteCount = 0;
    let postCount = 0;
    let likeCount = 0;
    let commentCount = 0;

    const voteCandidateStats: Record<string, number> = {};

    for (const u of usersToMigrate) {
      userCount++;
      accountCount += u.accounts.length;
      voteCount += u.votes.length;
      postCount += u.posts.length;
      
      u.votes.forEach(v => {
        voteCandidateStats[v.candidateId] = (voteCandidateStats[v.candidateId] || 0) + 1;
      });

      u.posts.forEach(p => {
        likeCount += p.likes.length;
        commentCount += p.comments.length;
      });
    }

    console.log(`\n--- Plan at a Glance ---`);
    console.log(`Users: ${userCount}`);
    console.log(`Accounts: ${accountCount}`);
    console.log(`Votes: ${voteCount}`);
    console.log(`Posts: ${postCount}`);
    console.log(`Likes on migrated posts: ${likeCount}`);
    console.log(`Comments on migrated posts: ${commentCount}`);

    if (dryRun) {
      console.log("\n⚠️ DRY RUN: No changes committed to Cluster 0.");
      return;
    }

    // 3. Execution (Sequential to avoid Prisma/Mongo timeout issues with large transactions)
    console.log("\n🚀 Executing migration to Cluster 0...");

    for (const u of usersToMigrate) {
      const { accounts, votes, posts, ...userData } = u;

      // Create User
      await prismaMain.user.create({ data: userData });

      // Create Accounts
      if (accounts.length > 0) {
        await prismaMain.account.createMany({ data: accounts });
      }

      // Create Votes
      if (votes.length > 0) {
        await prismaMain.vote.createMany({ data: votes });
      }

      // Create Posts & related data
      for (const p of posts) {
        const { likes, comments, ...postData } = p;
        await prismaMain.post.create({ data: postData });

        if (likes.length > 0) {
          await prismaMain.like.createMany({ data: likes });
        }
        if (comments.length > 0) {
          await prismaMain.comment.createMany({ data: comments });
        }
      }

      process.stdout.write(".");
    }
    console.log("\n\n✅ Basic records migrated.");

    // 4. Update Candidate.voteCount
    console.log("Updating candidate vote counts in Cluster 0...");
    for (const [candidateId, count] of Object.entries(voteCandidateStats)) {
      await prismaMain.candidate.update({
        where: { id: candidateId },
        data: { voteCount: { increment: count } }
      });
    }

    console.log("✅ All vote counts updated.");
    console.log("\n✨ Migration completed successfully!");

  } catch (error) {
    console.error("\n❌ Migration failed:", error);
  } finally {
    await prismaMain.$disconnect();
    await prismaSecondary.$disconnect();
  }
}

main();
