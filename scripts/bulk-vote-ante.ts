import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

const ethiopianNames = [
  "Abebe Bikila",
  "Kebede Molla",
  "Almaz Ayana",
  "Tigist Gezahagn",
  "Dawit Gebre",
  "Martha Haile",
  "Solomon Tekle",
  "Selam Tadesse",
  "Yohannes Kidane",
  "Bethlehem Dessie"
];

async function main() {
  console.log("Starting bulk vote script...");

  // 1. Find the candidate 'Ante'
  const ante = await prisma.candidate.findFirst({
    where: { name: "Ante" }
  });

  if (!ante) {
    console.error("Candidate 'Ante' not found!");
    return;
  }

  console.log(`Found candidate Ante with ID: ${ante.id}`);

  for (const name of ethiopianNames) {
    const email = `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`;
    
    try {
      // 2. Create User
      const user = await prisma.user.create({
        data: {
          id: `fake-user-${Math.random().toString(36).substring(7)}`,
          name: name,
          email: email,
          emailVerified: true,
          city: "Addis Ababa",
          role: "USER"
        }
      });

      // 3. Create Vote
      await prisma.vote.create({
        data: {
          userId: user.id,
          candidateId: ante.id,
        }
      });

      // 4. Increment Candidate voteCount
      await prisma.candidate.update({
        where: { id: ante.id },
        data: {
          voteCount: {
            increment: 1
          }
        }
      });

      console.log(`Created user ${name} and cast vote for Ante.`);
    } catch (error) {
      console.error(`Failed to process user ${name}:`, error);
    }
  }

  console.log("Bulk vote process finished.");
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
