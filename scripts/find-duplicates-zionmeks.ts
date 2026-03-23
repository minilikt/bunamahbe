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

  log("🔍 Searching for candidate: zionmeks...");

  // 1. Find the candidate
  const candidate = await prisma.candidate.findFirst({
    where: { username: { equals: "zionmeks", mode: "insensitive" } },
    select: { id: true, name: true },
  });

  if (!candidate) {
    log("❌ Could not find candidate with username 'zionmeks'");
    return;
  }

  log(`✅ Found candidate: ${candidate.name} (${candidate.id})`);

  // 2. Get all votes for this candidate
  log("Fetching votes...");
  const votes = await prisma.vote.findMany({
    where: { candidateId: candidate.id },
    select: { userId: true },
  });

  log(`📊 Total votes for ${candidate.name}: ${votes.length}`);

  const userIds = votes.map((v) => v.userId);

  // 3. Fetch matching users with details
  log("Fetching user details...");
  const users = await prisma.user.findMany({
    where: { id: { in: userIds } },
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

  log(`👥 Users found: ${users.length}`);

  // 4. Group by normalized name
  log("Analyzing for potential duplicates...");
  const groups: Record<string, typeof users> = {};

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

  log("\n--- Potentially Duplicate Accounts (Zionmeks Voters) ---");

  if (duplicates.length === 0) {
    log("No potential duplicates found among Zionmeks voters.");
  } else {
    duplicates.forEach(([normalized, group]) => {
      log(`\nGroup: "${normalized}" (${group.length} accounts)`);
      group.forEach(u => {
        const verified = u.emailVerified ? "✅ Verified" : "❌ Unverified";
        const voteInfo = u.votes && u.votes.length > 0 ? `Voted for: ${u.votes[0].candidate.name}` : "No vote record";
        log(`  - [${u.id}] ${u.name} (${u.email}) | ${verified} | ${voteInfo} | Created: ${u.createdAt.toISOString()}`);
      });
    });
    log(`\nFound ${duplicates.length} groups of potential duplicates among ${candidate.name} voters.`);
  }

  // 5. Save report
  fs.writeFileSync("zionmeks_duplicates.txt", report);
  console.log("\n✅ Saved detailed report to zionmeks_duplicates.txt");
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
