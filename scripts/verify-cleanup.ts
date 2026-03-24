import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const candidate = await prisma.candidate.findFirst({
    where: { username: { equals: "zionmeks", mode: "insensitive" } },
    select: { id: true, name: true, voteCount: true },
  });

  if (!candidate) {
    console.log("❌ Candidate not found.");
    return;
  }

  const votesCount = await prisma.vote.count({
    where: { candidateId: candidate.id },
  });

  console.log(`✅ Candidate: ${candidate.name}`);
  console.log(`📊 voteCount field: ${candidate.voteCount}`);
  console.log(`📊 Actual votes in DB: ${votesCount}`);
}

main().finally(() => prisma.$disconnect());
