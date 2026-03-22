import { PrismaClient } from "@prisma/client";
import fs from "fs";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  let report = "";
  const log = (text = "") => {
    report += text + "\n";
  };

  log("🔍 Fetching vote report...\n");

  // Fetch all candidates
  const candidates = await prisma.candidate.findMany({
    select: { id: true, name: true, voteCount: true },
    orderBy: { voteCount: "desc" },
  });

  if (candidates.length === 0) {
    log("No candidates found.");
    fs.writeFileSync("report.txt", report);
    console.log("Report saved to report.txt");
    return;
  }

  // Fetch all votes
  const allVotes = await prisma.vote.findMany({
    orderBy: { createdAt: "desc" },
  });

  log(`📊 Total votes in DB: ${allVotes.length}`);

  // Unique user IDs
  const userIds = [...new Set(allVotes.map((v) => v.userId))];

  // Fetch users + accounts
  const [users, accounts] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true },
    }),
    prisma.account.findMany({
      where: { userId: { in: userIds } },
      select: { userId: true, accountId: true, providerId: true },
    }),
  ]);

  const userMap = new Map(users.map((u) => [u.id, u]));
  const accountMap = new Map(accounts.map((a) => [a.userId, a]));

  // Report per candidate
  for (const candidate of candidates) {
    const candidateVotes = allVotes.filter(
      (v) => v.candidateId === candidate.id
    );

    log(`\n🏆 CANDIDATE: ${candidate.name} (${candidate.voteCount} votes)`);
    log("--------------------------------------------------");

    if (candidateVotes.length === 0) {
      log("  No vote records found.");
      continue;
    }

    candidateVotes.forEach((vote, i) => {
      const user = userMap.get(vote.userId);
      let identity = "Unknown";
      let details = "";

      if (user) {
        identity = user.name;
        details = `<${user.email}>`;
      } else {
        const account = accountMap.get(vote.userId);
        if (account) {
          identity =
            account.providerId === "credential"
              ? account.accountId
              : `${account.providerId} user`;
          details = `(Found in Accounts: ${account.accountId})`;
        } else {
          identity = "Orphaned Vote";
          details = `(ID: ${vote.userId})`;
        }
      }

      log(
        `  ${(i + 1).toString().padStart(3)}. ${identity.padEnd(
          20
        )} ${details} [${vote.createdAt.toISOString()}]`
      );
    });
  }

  // Summary
  const orphans = allVotes.filter((v) => !userMap.has(v.userId));
  const orphansWithAccounts = orphans.filter((v) =>
    accountMap.has(v.userId)
  );
  const trueOrphans = orphans.filter(
    (v) => !accountMap.has(v.userId)
  );

  log(`\n📉 SUMMARY`);
  log(`==================================================`);
  log(`Total Votes:          ${allVotes.length}`);
  log(`Resolved (User):      ${allVotes.length - orphans.length}`);
  log(`Resolved (Account):   ${orphansWithAccounts.length}`);
  log(`True Orphans:         ${trueOrphans.length}`);
  log(`==================================================\n`);

  // Write file
  fs.writeFileSync("report.txt", report);

  console.log("Report saved to report.txt");
}

main()
  .catch((err) => {
    console.error(err);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });