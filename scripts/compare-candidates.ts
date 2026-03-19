import { PrismaClient } from '@prisma/client';
import "dotenv/config";

async function main() {
  const mainDbUrl = process.env.DATABASE_URL;
  const secondaryDbUrl = process.env.DATABASE_URL_C3;

  if (!mainDbUrl || !secondaryDbUrl) {
    console.error("❌ Error: DATABASE_URL or DATABASE_URL_C3 is not defined");
    process.exit(1);
  }

  const prismaMain = new PrismaClient({ datasourceUrl: mainDbUrl });
  const prismaSecondary = new PrismaClient({ datasourceUrl: secondaryDbUrl });

  try {
    const mainCandidates = await prismaMain.candidate.findMany({ select: { id: true, name: true } });
    const secCandidates = await prismaSecondary.candidate.findMany({ select: { id: true, name: true } });

    console.log(`Cluster 0 Candidates: ${mainCandidates.length}`);
    console.log(`Cluster 3 Candidates: ${secCandidates.length}`);

    const mainMap = new Map(mainCandidates.map(c => [c.name.toLowerCase(), c.id]));
    const mismatches: any[] = [];
    const missing: any[] = [];

    secCandidates.forEach(sc => {
      const mainId = mainMap.get(sc.name.toLowerCase());
      if (!mainId) {
        missing.push(sc);
      } else if (mainId !== sc.id) {
        mismatches.push({ sc, mainId });
      }
    });

    console.log(`\nCluster 0 Candidates: ${mainCandidates.length}`);
    console.log(`Cluster 3 Candidates: ${secCandidates.length}`);

    if (missing.length > 0) {
      console.log("\n❌ Candidates in Cluster 3 MISSING from Cluster 0 (by name):");
      missing.forEach(c => console.log(`- ${c.name} (ID: ${c.id})`));
    }

    if (mismatches.length > 0) {
      console.log("\n⚠️ ID Mismatches (Same name, different ID):");
      mismatches.forEach(m => console.log(`- ${m.sc.name} | Cluster 3 ID: ${m.sc.id} | Cluster 0 ID: ${m.mainId}`));
    }

    if (missing.length === 0 && mismatches.length === 0) {
      console.log("\n✅ All Cluster 3 candidates found in Cluster 0 with matching IDs (or name matching).");
    }
  } finally {
    await prismaMain.$disconnect();
    await prismaSecondary.$disconnect();
  }
}

main();
