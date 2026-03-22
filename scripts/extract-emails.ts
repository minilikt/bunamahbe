import { PrismaClient } from '@prisma/client';
import "dotenv/config";
import fs from 'fs';

async function main() {
  const mainDbUrl = process.env.DATABASE_URL;
  if (!mainDbUrl) {
    console.error("❌ Error: DATABASE_URL is not defined in .env");
    process.exit(1);
  }

  const prisma = new PrismaClient({
    datasourceUrl: mainDbUrl
  });

  try {
    const file = process.argv[2] || "your-list.txt";
    if (!fs.existsSync(file)) {
      console.error(`File not found: ${file}`);
      process.exit(1);
    }

    console.log(`Reading ${file}...`);
    const content = fs.readFileSync(file, 'utf-8');
    
    // Simple regex to find 24-char hex IDs
    const userIds = Array.from(new Set(content.match(/[a-f0-9]{24}/gi) || []));
    
    if (userIds.length === 0) {
      console.log("No user IDs found in the file.");
      return;
    }

    console.log(`Found ${userIds.length} unique IDs. Fetching from database (Cluster 0)...`);
    
    const users = await prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { email: true, name: true, id: true }
    });
    
    console.log(`\n=== EMAILS LIST (${users.length} found) ===`);
    users.forEach((u, i) => {
      console.log(`${i + 1}. ${u.email} (${u.name})`);
    });

    console.log(`\nSummary: Requested ${userIds.length}, Found ${users.length}, Missing ${userIds.length - users.length}`);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
