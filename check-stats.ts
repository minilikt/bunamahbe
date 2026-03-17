
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  try {
    const [userCount, voteCount, cities] = await Promise.all([
      prisma.user.count(),
      prisma.vote.count(),
      prisma.user.groupBy({
        by: ['city'],
        where: { city: { not: null } }
      })
    ]);
    console.log("STATS_CHECK_RESULTS:", JSON.stringify({ userCount, voteCount, cityCount: cities.length }));
  } catch (err) {
    console.error("STATS_CHECK_ERROR:", err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
