import { PrismaClient } from "@prisma/client";
import fs from "fs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  let report = "";
  const log = (text = "") => {
    report += text + "\n";
    console.log(text);
  };

  log("📂 Reading userId list from your-list.txt...");
  const content = fs.readFileSync("your-list.txt", "utf-8");
  const idRegex = /userId:\s+([0-9a-fA-F]{24})/g;
  const userIds = [...new Set([...content.matchAll(idRegex)].map(m => m[1]))];

  log(`📊 Extracted ${userIds.length} unique user IDs from file.`);

  log("🔍 Resolving victims... I mean, voters...");
  
  const identities: any[] = [];

  // Batch process to be faster
  const userMap = new Map();
  const userData = await prisma.user.findMany({
    where: { id: { in: userIds } },
    select: { id: true, name: true, email: true, emailVerified: true, createdAt: true }
  });
  userData.forEach(u => userMap.set(u.id, { ...u, source: "USER_TABLE" }));

  const unresolvedIds = userIds.filter(id => !userMap.has(id));
  log(`👥 Found ${userData.length} in User table. ${unresolvedIds.length} need Account lookup.`);

  const accountMap = new Map();
  const accountData = await prisma.account.findMany({
    where: { userId: { in: unresolvedIds } },
    select: { userId: true, accountId: true, providerId: true }
  });
  accountData.forEach(a => accountMap.set(a.userId, { ...a, source: "ACCOUNT_TABLE" }));

  userIds.forEach(id => {
    if (userMap.has(id)) {
      identities.push(userMap.get(id));
    } else if (accountMap.has(id)) {
      const acc = accountMap.get(id);
      identities.push({
        id: id,
        name: acc.accountId, // Fallback to accountId (email for credentials)
        email: acc.providerId === "credential" ? acc.accountId : `[${acc.providerId}] ${acc.accountId}`,
        emailVerified: false, // Don't know for sure
        createdAt: new Date(0), // Don't know
        source: "ACCOUNT_TABLE"
      });
    } else {
      identities.push({
        id: id,
        name: "Unknown",
        email: "unknown",
        source: "NOT_FOUND"
      });
    }
  });

  // DUPLICATE DETECTION
  log("\nAnalyzing for duplicates among resolved identities...");
  const groups: Record<string, any[]> = {};

  identities.forEach(user => {
    if (user.source === "NOT_FOUND") return;

    const normalized = user.name
      .toLowerCase()
      .trim()
      .replace(/\s+\d+$/, "")
      .replace(/\d+$/, "")
      .trim();

    if (!groups[normalized]) {
      groups[normalized] = [];
    }
    groups[normalized].push(user);
  });

  const duplicates = Object.entries(groups).filter(([_, group]) => group.length > 1);

  log("\n--- Potentially Duplicate Zionmeks Voters ---");
  if (duplicates.length === 0) {
    log("No duplicates found among resolved IDs.");
  } else {
    duplicates.forEach(([normalized, group]) => {
      log(`\nGroup: "${normalized}" (${group.length} accounts)`);
      group.forEach(u => {
        log(`  - [${u.id}] ${u.name} (${u.email}) [Source: ${u.source}]`);
      });
    });
    log(`\nFound ${duplicates.length} potential duplicate groups.`);
  }

  // Save to file
  fs.writeFileSync("zionmeks_resolved_duplicates.txt", report);
  log("\n✅ Saved detailed report to zionmeks_resolved_duplicates.txt");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
