import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// const candidates = [
//   {
//     id: "ante",
//     name: "Ante",
//     username: "@ant_kenz",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can1.png",
//     bio: "I’ve lived coffee culture for years and represent true Ethiopian coffee lovers.",
//     tiktok: "https://www.tiktok.com/@ant_kenz",
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//     id: "kebron_kb",
//     name: "Kebron (KB)",
//     username: "@kzeru",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can2.png",
//     bio: "I will take Ethiopian coffee culture global and connect communities beyond borders.",
//     tiktok: "https://www.tiktok.com/@kzeru",
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//     id: "ab_kassa",
//     name: "Ab Kassa",
//     username: "@ablex13",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can3.png",
//     bio: "I’ll prove who truly represents Ethiopian coffee culture through creativity and humor.",
//     tiktok: "https://www.tiktok.com/@ablex13",
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//     id: "maria",
//     name: "Maria",
//     username: "@marina.maria1",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can4.png",
//     bio: "Women built coffee culture; I will celebrate and elevate their role everywhere.",
//     tiktok: "https://www.tiktok.com/@marina.maria1",
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//     id: "bitsiet",
//     name: "Bitsiet",
//     username: "@bitsiet_asrat16",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can5.png",
//     bio: "I promise affordable coffee, celebration beans, and coffee wisdom even in marriage counseling.",
//     tiktok: "https://www.tiktok.com/@bitsiet_asrat16",
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//     id: "fikrusheriferaw",
//     name: "Fikrushiferaw",
//     username: "@fikrur21",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can6.png",
//     bio: "Having tasted 190 Ethiopian coffees, I bring unmatched experience to leadership.",
//     tiktok: "https://www.tiktok.com/@fikrus21",
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//     id: "selamawit_tegen",
//     name: "Selamawit Tegen",
//     username: "@selamawittegen",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can7.png",
//     bio: "I represent the beauty and tradition of authentic Ethiopian coffee ceremony culture.",
//     tiktok: "https://www.tiktok.com/@selamawittegegn",
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//     id: "lila_coffee_man",
//     name: "Lila Coffee Man",
//     username: "@lila162130",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can8.png",
//     bio: "The community already chose me through shared daily passion for coffee.",
//     tiktok: "https://www.tiktok.com/@lila162130",
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//     id: "nardyk",
//     name: "Nardyk",
//     username: "@nardykk",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can9.png",
//     bio: "From growing coffee trees to drinking it, I represent true coffee expertise.",
//     tiktok: "https://www.tiktok.com/@nardykk",
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//     id: "gk_coffee",
//     name: "GK Coffee",
//     username: "@gkcar5",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can10.png",
//     bio: "As a certified cupper, I bring professional tasting knowledge to the community.",
//     tiktok: "https://www.tiktok.com/@gkcar5",
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//     id: "dr_mickey_anteneh",
//     name: "Dr. Mickey Anteneh",
//     username: "@mickey_anteneh",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can11.png",
//     bio: "Doctors run on coffee; medical professionals deserve representation in leadership.",
//     tiktok: "https://www.tiktok.com/@mickey_anteneh",
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//     id: "miss_coffee",
//     name: "Miss Coffee",
//     username: "@fikafosi",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can12.png",
//     bio: "As an original candidate, I stand ready to represent dedicated coffee enthusiasts.",
//     tiktok: "https://www.tiktok.com/@fikafosi",
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//     id: "wegen",
//     name: "Wegen",
//     username: "@wegen78",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can13.png",
//     bio: "Women already lead coffee culture; leadership should officially reflect this reality.",
//     tiktok: "https://www.tiktok.com/@wegen78",
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//     id: "sofoniyas",
//     name: "Sofoniyas",
//     username: "@sofoniyas_dreams",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can14.png",
//     bio: "I will defend coffee supremacy and eliminate rival drinks from cultural dominance.",
//     tiktok: "https://www.tiktok.com/@sofoniyas_dreams",
//     tiktokVideoId: null,
//     voteCount: 0
//   }
// ];
const candidates = [
  
  {
    name: "Tadele Teshome",
    username: "@tadele_teshome",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/11.jpeg",
    bio: "Advocates taking Ethiopian coffee globally and supports female leadership representation within national coffee governance.",
    tiktokVideoId: "7616448838877842709",
    voteCount: 0
  },
  {
    name: "Desyemil Amharic",
    username: "@desyemil.amharic",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/21.png",
    bio: "Claims pioneering campaign-style video creation and promotes female presidency reflecting women’s dominance in coffee production.",
    tiktokVideoId: "7617852115154636054",
    voteCount: 0
  },
  {
    name: "Rediet Daniel",
    username: "@rediet_daniel",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/31.jpeg",
    bio: "Believes a coffee president should genuinely drink coffee regularly, specifically preferring it served without sugar.",
    tiktokVideoId: "7617906188755258645",
    voteCount: 0
  },
  {
    name: "Biniyam Desalegn",
    username: "@biniyamdesalegn1",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/41.png",
    bio: "Professional coffee cupper seeking vice presidency, demonstrating deep expertise and strong knowledge of Ethiopian coffee culture.",
    tiktokVideoId: "7617867030171045141",
    voteCount: 0
  },
  {
    name: "Maramawit Solomon",
    username: "@maramawit_solomon",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/51.jpeg",
    bio: "Joined the initiative after follower encouragement, openly agreeing to participate and support the coffee leadership idea.",
    tiktokVideoId: "7617809341919366420",
    voteCount: 0
  },
  {
    name: "Abuni NM",
    username: "@abuni_nm",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/61.jpeg",
    bio: "Popular TikToker with widely used audio sounds, recognized as an authentic enthusiast and passionate coffee supporter.",
    tiktokVideoId: "7616738240372198676",
    voteCount: 0
  },
  {
    name: "Abushep",
    username: "@abushep",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/71.jpeg",
    bio: "Medical professional expressing genuine appreciation for coffee culture while balancing healthcare expertise with personal passion.",
    tiktokVideoId: "7617327244058348818",
    voteCount: 0
  },
  {
    name: "Hope Joshua",
    username: "@hopejoshua20",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/81.jpeg",
    bio: "Drinks coffee throughout the day and believes coffee carries positive energy, luck, and daily motivation.",
    tiktokVideoId: "7617064637938339079",
    voteCount: 0
  },
  {
    name: "Model Sina Beka",
    username: "@model_sina_beka",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can9.png",
    bio: "Certified coffee tester bringing professional tasting credentials and sensory evaluation expertise into the coffee conversation.",
    tiktokVideoId: "7617779415790931220",
    voteCount: 0
  },
  {
    name: "Kemengede",
    username: "@kemengede516",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/91.jpeg",
    bio: "Humorous coffee creator known for giveaways, engaging university students through entertaining and community-focused coffee content.",
    tiktokVideoId: "7617956014805241109",
    voteCount: 0
  },
  {
    name: "4Kilo Entertainment",
    username: "@4kilo_entertainment",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/111.jpeg",
    bio: "Confidently claims future leadership while expressing strong concerns about excessive sugar usage in traditional coffee culture.",
    tiktokVideoId: "7617480051809881352",
    voteCount: 0
  }
];

async function main() {
  console.log(`Start seeding ...`);
  
  // Clear existing data to avoid inconsistency
  await prisma.vote.deleteMany();
  await prisma.candidate.deleteMany();
  await prisma.report.deleteMany();
  await prisma.like.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.post.deleteMany();
  await prisma.verification.deleteMany();
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
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
