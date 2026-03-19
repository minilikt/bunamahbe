import { PrismaClient } from '@prisma/client';
import "dotenv/config";

async function main() {
  const prisma = new PrismaClient();

  try {
    const candidates = await prisma.candidate.findMany({
      orderBy: {
        voteCount: 'desc'
      },
      select: {
        id: true,
        name: true,
        role: true,
        voteCount: true,
        _count: {
          select: { votes: true }
        }
      }
    });

    console.log("\n--- Election Candidates and Votes ---");
    if (candidates.length === 0) {
      console.log("No candidates found in the database.");
    } else {
      console.table(candidates.map(c => ({
        Name: c.name,
        Role: c.role,
        'Vote Count (Field)': c.voteCount,
        'Actual Votes (Relation)': c._count.votes
      })));
    }
    console.log("-------------------------------------\n");
  } catch (error) {
    console.error("Error fetching candidates:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
