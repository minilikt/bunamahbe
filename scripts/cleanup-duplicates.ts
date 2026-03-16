import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking for duplicate emails...");

  // Get all users
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
  });

  const emailMap = new Map<string, string[]>();

  users.forEach((user) => {
    if (!emailMap.has(user.email)) {
      emailMap.set(user.email, []);
    }
    emailMap.get(user.email)?.push(user.id);
  });

  let deletedCount = 0;

  for (const [email, ids] of emailMap.entries()) {
    if (ids.length > 1) {
      console.log(`⚠️ Found ${ids.length} entries for ${email}. Keeping the most recent (ID: ${ids[0]}).`);
      
      const toDelete = ids.slice(1);
      
      // Delete sessions and accounts first to avoid orphaned records if needed 
      // (Cascades are usually handled by DB, but we'll be safer or just trust Prisma Cascade)
      
      for (const id of toDelete) {
        await prisma.user.delete({
          where: { id },
        });
        deletedCount++;
      }
    }
  }

  if (deletedCount > 0) {
    console.log(`✅ Successfully cleaned up ${deletedCount} duplicate records.`);
  } else {
    console.log("✨ No duplicates found.");
  }
}

main()
  .catch((e) => {
    console.error("❌ Error during cleanup:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
