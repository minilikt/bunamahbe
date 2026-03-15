import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const candidates = [
  {
    name: "Ante",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ante",
    bio: "I've lived coffee culture for years. Now I represent every true Ethiopian coffee lover.",
    voteCount: 0,
  },
  {
    name: "Kebron / KB",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kebron",
    bio: "I will take Ethiopian coffee culture global and connect our community beyond borders.",
    voteCount: 0,
  },
  {
    name: "Ab Kassa",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AbKassa",
    bio: "Like hip-hop legends before us, I'll prove who truly represents Ethiopian coffee culture.",
    voteCount: 0,
  },
  {
    name: "Maria",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    bio: "Women built coffee culture. I'll honor them with home delivery and celebration of ceremony.",
    voteCount: 0,
  },
  {
    name: "Bitsiet",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bitsiet",
    bio: "I promise cheaper coffee, celebration beans, and coffee wisdom included even in marriage counseling.",
    voteCount: 0,
  },
  {
    name: "Fikrushiferaw",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fikrushiferaw",
    bio: "I've tasted 190 Ethiopian coffees. Experience matters when leading true coffee lovers.",
    voteCount: 0,
  },
  {
    name: "Selamawit Tegen",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Selamawit",
    bio: "I represent the beauty and tradition of authentic Ethiopian coffee ceremony culture.",
    voteCount: 0,
  },
  {
    name: "Lila Coffee Man",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lila",
    bio: "The community already chose me through coffee passion shared daily with loyal viewers.",
    voteCount: 0,
  },
];

async function main() {
  console.log(`Start seeding ...`);
  
  // Clear existing data to avoid inconsistency
  await prisma.vote.deleteMany();
  await prisma.candidate.deleteMany();
  console.log(`Cleared existing data.`);

  for (const u of candidates) {
    const candidate = await prisma.candidate.create({
      data: u,
    });
    console.log(`Created candidate with id: ${candidate.id}`);
  }
  console.log(`Seeding finished.`);
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
