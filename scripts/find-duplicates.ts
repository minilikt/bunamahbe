import { PrismaClient } from "@prisma/client";
import fs from "fs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  let report = "";
  const log = (text = "") => {
    report += text + "\n";
  };

  log("Fetching users...");

  const users = await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      email: true,
      emailVerified: true,
      createdAt: true,
      votes: {
        select: {
          candidate: {
            select: {
              name: true
            }
          }
        }
      }
    }
  });

  log(`Analyzing ${users.length} users for potential duplicates...`);

  const groups = {};

  users.forEach(user => {
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

  log("\n--- Potentially Duplicate Accounts ---");

  if (duplicates.length === 0) {
    log("No potential duplicates found.");
  } else {
    duplicates.forEach(([normalized, group]) => {
      log(`\nGroup: "${normalized}" (${group.length} accounts)`);

      group.forEach(u => {
        const verified = u.emailVerified ? "✅ Verified" : "❌ Unverified";
        const vote =
          u.votes && u.votes.length > 0
            ? `Voted for: ${u.votes[0].candidate.name}`
            : "No vote cast";

        log(
          `  - [${u.id}] ${u.name} (${u.email}) | ${verified} | ${vote} | Created: ${u.createdAt.toISOString()}`
        );
      });
    });

    log(`\nFound ${duplicates.length} groups of potential duplicates.`);
  }

  // Save to file
  fs.writeFileSync("duplicate_emails.txt", report);

  console.log("Saved to duplicate_emails.txt");
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