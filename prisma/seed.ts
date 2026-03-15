import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const candidates = [
  {
    name: "Ante",
    username: "@ant_kenz",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ante",
    bio: "I’ve lived coffee culture for years and represent true Ethiopian coffee lovers.",
    voteCount: 0,
  },
  {
    name: "Kebron (KB)",
    username: "@kzeru",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Kebron",
    bio: "I will take Ethiopian coffee culture global and connect communities beyond borders.",
    voteCount: 0,
  },
  {
    name: "Ab Kassa",
    username: "@ablex13",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=AbKassa",
    bio: "I’ll prove who truly represents Ethiopian coffee culture through creativity and humor.",
    voteCount: 0,
  },
  {
    name: "Maria",
    username: "@marina.maria1",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Maria",
    bio: "Women built coffee culture; I will celebrate and elevate their role everywhere.",
    voteCount: 0,
  },
  {
    name: "Bitsiet",
    username: "@bitsiet_asrat16",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bitsiet",
    bio: "I promise affordable coffee, celebration beans, and coffee wisdom even in marriage counseling.",
    voteCount: 0,
  },
  {
    name: "Fikrushiferaw",
    username: "@fikrur21",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Fikrushiferaw",
    bio: "Having tasted 190 Ethiopian coffees, I bring unmatched experience to leadership.",
    voteCount: 0,
  },
  {
    name: "Selamawit Tegen",
    username: "@selamawittegen",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Selamawit",
    bio: "I represent the beauty and tradition of authentic Ethiopian coffee ceremony culture.",
    voteCount: 0,
  },
  {
    name: "Lila Coffee Man",
    username: "@lila162130",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lila",
    bio: "The community already chose me through shared daily passion for coffee.",
    voteCount: 0,
  },
  {
    name: "Nardyk",
    username: "@nardykk",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Nardyk",
    bio: "From growing coffee trees to drinking it, I represent true coffee expertise.",
    voteCount: 0,
  },
  {
    name: "GK Coffee",
    username: "@gkcar5",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=GKCoffee",
    bio: "As a certified cupper, I bring professional tasting knowledge to the community.",
    voteCount: 0,
  },
  {
    name: "Dr. Mickey Anteneh",
    username: "@mickey_anteneh",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Mickey",
    bio: "Doctors run on coffee; medical professionals deserve representation in leadership.",
    voteCount: 0,
  },
  {
    name: "Miss Coffee",
    username: "@fikafosi",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=MissCoffee",
    bio: "As an original candidate, I stand ready to represent dedicated coffee enthusiasts.",
    voteCount: 0,
  },
  {
    name: "Wegen",
    username: "@wegen78",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Wegen",
    bio: "Women already lead coffee culture; leadership should officially reflect this reality.",
    voteCount: 0,
  },
  {
    name: "Sofoniyas",
    username: "@sofoniyas_dreams",
    role: "Candidate",
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sofoniyas",
    bio: "I will defend coffee supremacy and eliminate rival drinks from cultural dominance.",
    voteCount: 0,
  }
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
