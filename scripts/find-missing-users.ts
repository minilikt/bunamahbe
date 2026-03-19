import { PrismaClient } from '@prisma/client';
import "dotenv/config";

async function main() {
  const mainDbUrl = process.env.DATABASE_URL;
  const secondaryDbUrl = process.env.DATABASE_URL_C3;

  if (!mainDbUrl || !secondaryDbUrl) {
    console.error("❌ Error: DATABASE_URL or DATABASE_URL_C3 is not defined in .env");
    process.exit(1);
  }

  const prismaMain = new PrismaClient({
    datasourceUrl: mainDbUrl
  });

  const prismaSecondary = new PrismaClient({
    datasourceUrl: secondaryDbUrl
  });

  try {
    console.log("Checking connection to main database (Cluster 0)...");
    try {
      await prismaMain.user.findFirst();
      console.log("✅ Successfully connected and verified main database!");
    } catch (e: any) {
      console.error("❌ Failed to connect to main database.");
      console.error(e.message || Object.keys(e));
      return;
    }

    console.log("\nChecking connection to secondary database (Cluster 3)...");
    try {
      await prismaSecondary.user.findFirst();
      console.log("✅ Successfully connected and verified secondary database!");
    } catch (e: any) {
      console.error("❌ Failed to connect to secondary database.");
      console.error(e.message || Object.keys(e));
      return;
    }

    console.log("\nFetching users from secondary database...");
    const secondaryUsers = await prismaSecondary.user.findMany({
      select: { id: true, email: true, name: true }
    });
    console.log(`✅ Successfully fetched ${secondaryUsers.length} users from secondary DB.`);

    console.log("\nFetching users from main database...");
    const mainUsers = await prismaMain.user.findMany({
      select: { id: true, email: true, name: true }
    });
    console.log(`✅ Successfully fetched ${mainUsers.length} users from main DB.`);
    
    // Compare
    const mainEmails = new Set(mainUsers.map(u => u.email));
    const missingUsers = secondaryUsers.filter(u => !mainEmails.has(u.email));

    console.log("\n--- Missing Users in Main DB ---");
    if (missingUsers.length === 0) {
      console.log("No missing users found. Both databases have the same users based on email.");
    } else {
      console.log(`Found ${missingUsers.length} missing user(s):`);
      missingUsers.forEach(u => {
        console.log(`- ${u.name} (<${u.email}>) | ID: ${u.id}`);
      });
    }
    console.log("--------------------------------\n");
  } finally {
    await prismaMain.$disconnect();
    await prismaSecondary.$disconnect();
  }
}

main();
