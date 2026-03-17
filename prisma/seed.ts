import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// const candidates = [
//   {
//
//     name: "Ante",
//     username: "@ant_kenz",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can1.png",
//     bio: "I’ve lived coffee culture for years and represent true Ethiopian coffee lovers.",
//
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//
//     name: "Kebron (KB)",
//     username: "@kzeru",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can2.png",
//     bio: "I will take Ethiopian coffee culture global and connect communities beyond borders.",
//
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//
//     name: "Ab Kassa",
//     username: "@ablex13",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can3.png",
//     bio: "I’ll prove who truly represents Ethiopian coffee culture through creativity and humor.",
//
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//
//     name: "Maria",
//     username: "@marina.maria1",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can4.png",
//     bio: "Women built coffee culture; I will celebrate and elevate their role everywhere.",
//
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//
//     name: "Bitsiet",
//     username: "@bitsiet_asrat16",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can5.png",
//     bio: "I promise affordable coffee, celebration beans, and coffee wisdom even in marriage counseling.",
//
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//
//     name: "Fikrushiferaw",
//     username: "@fikrur21",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can6.png",
//     bio: "Having tasted 190 Ethiopian coffees, I bring unmatched experience to leadership.",
//
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//
//     name: "Selamawit Tegen",
//     username: "@selamawittegen",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can7.png",
//     bio: "I represent the beauty and tradition of authentic Ethiopian coffee ceremony culture.",
//
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//
//     name: "Lila Coffee Man",
//     username: "@lila162130",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can8.png",
//     bio: "The community already chose me through shared daily passion for coffee.",
//
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//
//     name: "Nardyk",
//     username: "@nardykk",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can9.png",
//     bio: "From growing coffee trees to drinking it, I represent true coffee expertise.",
//
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//
//     name: "GK Coffee",
//     username: "@gkcar5",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can10.png",
//     bio: "As a certified cupper, I bring professional tasting knowledge to the community.",
//
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//
//     name: "Dr. Mickey Anteneh",
//     username: "@mickey_anteneh",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can11.png",
//     bio: "Doctors run on coffee; medical professionals deserve representation in leadership.",
//
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//
//     name: "Miss Coffee",
//     username: "@fikafosi",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can12.png",
//     bio: "As an original candidate, I stand ready to represent dedicated coffee enthusiasts.",
//
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//
//     name: "Wegen",
//     username: "@wegen78",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can13.png",
//     bio: "Women already lead coffee culture; leadership should officially reflect this reality.",
//
//     tiktokVideoId: null,
//     voteCount: 0
//   },
//   {
//
//     name: "Sofoniyas",
//     username: "@sofoniyas_dreams",
//     role: "Candidate",
//     image: "https://ik.imagekit.io/hbgj1ddz8/can14.png",
//     bio: "I will defend coffee supremacy and eliminate rival drinks from cultural dominance.",
//
//     tiktokVideoId: null,
//     voteCount: 0
//   }
// ];
const candidates = [
  {
    name: "Ante",
    username: "@ant_kenz",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can1.png",
    bio: "I’ve lived coffee culture for years and represent true Ethiopian coffee lovers.",
    tiktokVideoId: "7616818238906780949",
    voteCount: 0
  },
  {
    name: "Kebron (KB)",
    username: "@kzeru",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can2.png",
    bio: "I will take Ethiopian coffee culture global and connect communities beyond borders.",
    tiktokVideoId: "7616418498134166814",
    voteCount: 0
  },
  {
    name: "Ab Kassa",
    username: "@ablex13",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can3.png",
    bio: "I’ll prove who truly represents Ethiopian coffee culture through creativity and humor.",
    tiktokVideoId: "7615253489618521364",
    voteCount: 0
  },
  {
    name: "Maria",
    username: "@marina.maria1",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can4.png",
    bio: "Women built coffee culture; I will celebrate and elevate their role everywhere.",
    tiktokVideoId: "7617502122015214868",
    voteCount: 0
  },
  {
    name: "Bitsiet",
    username: "@bitsiet_asrat16",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can5.png",
    bio: "I promise affordable coffee, celebration beans, and coffee wisdom even in marriage counseling.",
    tiktokVideoId: "7617760683026877714",
    voteCount: 0
  },
  {
    name: "Fikrushiferaw",
    username: "@fikrur21",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can6.png",
    bio: "Having tasted 190 Ethiopian coffees, I bring unmatched experience to leadership.",
    tiktokVideoId: "7617057382761565461",
    voteCount: 0
  },
  {
    name: "Selamawit Tegen",
    username: "@selamawittegen",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can7.png",
    bio: "I represent the beauty and tradition of authentic Ethiopian coffee ceremony culture.",
    tiktokVideoId: "7617037998399474964",
    voteCount: 0
  },
  {
    name: "Lila Coffee Man",
    username: "@lila162130",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can8.png",
    bio: "The community already chose me through shared daily passion for coffee.",
    tiktokVideoId: "7617897961195932949",
    voteCount: 0
  },
  {
    name: "Nardyk",
    username: "@nardykk",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can9.png",
    bio: "From growing coffee trees to drinking it, I represent true coffee expertise.",
    tiktokVideoId: "7617480051809881352",
    voteCount: 0
  },
  {
    name: "GK Coffee",
    username: "@gkcar5",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can10.png",
    bio: "As a certified cupper, I bring professional tasting knowledge to the community.",
    tiktokVideoId: "7617889216894078216",
    voteCount: 0
  },
  {
    name: "Dr. Mickey Anteneh",
    username: "@mickey_anteneh",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can11.png",
    bio: "Doctors run on coffee; medical professionals deserve representation in leadership.",
    tiktokVideoId: "7616766229000326420",
    voteCount: 0
  },
  {
    name: "Miss Coffee",
    username: "@fikafosi",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can12.png",
    bio: "As an original candidate, I stand ready to represent dedicated coffee enthusiasts.",
    tiktokVideoId: "7616634697451359506",
    voteCount: 0
  },
  {
    name: "Wegen",
    username: "@wegen78",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can13.png",
    bio: "Women already lead coffee culture; leadership should officially reflect this reality.",
    tiktokVideoId: "7615680700720614676",
    voteCount: 0
  },
  {
    name: "Sofoniyas",
    username: "@sofoniyas_dreams",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can14.png",
    bio: "I will defend coffee supremacy and eliminate rival drinks from cultural dominance.",
    tiktokVideoId: "7617128513782484246",
    voteCount: 0
  },
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
    name: "ሄርሞን አዳማ",
    username: "@hermon545",
    role: "Candidate",
    image: "https://ik.imagekit.io/hbgj1ddz8/can36.png",
    bio: "Active participant in the coffee movement, contributing through engaging content and cultural expression.",
    tiktokVideoId: "7618066480860597524",
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
