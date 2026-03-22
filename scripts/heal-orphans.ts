import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma0 = new PrismaClient();
const prisma3 = process.env.DATABASE_URL_C3 
  ? new PrismaClient({ datasourceUrl: process.env.DATABASE_URL_C3 }) 
  : null;

async function main() {
  if (!prisma3) {
    console.error("❌ DATABASE_URL_C3 is not set in .env");
    process.exit(1);
  }

  console.log("🔍 Scanning for orphaned votes in Cluster 0...");
  
  // 1. Get all unique userIds from votes
  const votes = await prisma0.vote.findMany({ select: { userId: true } });
  const voteUserIds = Array.from(new Set(votes.map(v => v.userId)));
  console.log(`📊 Found ${voteUserIds.length} unique voters in Cluster 0.`);

  // 2. Find which ones exist in Cluster 0
  const existingUsers = await prisma0.user.findMany({
    where: { id: { in: voteUserIds } },
    select: { id: true }
  });
  const existingUserIds = new Set(existingUsers.map(u => u.id));
  
  const orphanedIds = voteUserIds.filter(id => !existingUserIds.has(id));
  console.log(`❓ Found ${orphanedIds.length} orphaned IDs missing from Cluster 0 User table.`);

  if (orphanedIds.length === 0) {
    console.log("✅ No orphans to heal!");
    return;
  }

  // 3. Fetch missing data from Cluster 3
  console.log(`\n☁️ Fetching ${orphanedIds.length} records from Cluster 3...`);
  const [users3, accounts3] = await Promise.all([
    prisma3.user.findMany({
      where: { id: { in: orphanedIds } }
    }),
    prisma3.account.findMany({
      where: { userId: { in: orphanedIds } }
    })
  ]);

  console.log(`✅ Found ${users3.length} Users and ${accounts3.length} Accounts in Cluster 3.`);

  // 4. Migrate to Cluster 0
  if (users3.length > 0) {
    console.log(`\n🚀 Migrating ${users3.length} users to Cluster 0...`);
    
    // We use createMany for speed if possible, or individual creates to avoid failures
    let migratedCount = 0;
    for (const user of users3) {
      try {
        await prisma0.user.upsert({
          where: { id: user.id },
          update: {},
          create: user
        });
        migratedCount++;
      } catch (e) {
        console.error(`  ❌ Failed to migrate user ${user.id}:`, (e as Error).message);
      }
    }
    console.log(`📊 Successfully migrated ${migratedCount} users.`);
  }

  if (accounts3.length > 0) {
    console.log(`🚀 Migrating ${accounts3.length} accounts to Cluster 0...`);
    let migratedCount = 0;
    for (const account of accounts3) {
      try {
        await prisma0.account.upsert({
          where: { id: account.id },
          update: {},
          create: account
        });
        migratedCount++;
      } catch (e) {
         // Silently ignore if account already exists or has constraint issues
      }
    }
    console.log(`📊 Successfully migrated ${migratedCount} accounts.`);
  }

  console.log("\n🏁 Healing complete!");
}

main()
  .catch(console.error)
  .finally(async () => {
    await prisma0.$disconnect();
    if (prisma3) await prisma3.$disconnect();
  });
