import { PrismaClient } from '@prisma/client';
import "dotenv/config";

async function main() {
  const secondaryDbUrl = process.env.DATABASE_URL_C3;
  if (!secondaryDbUrl) {
    console.error("❌ Error: DATABASE_URL_C3 is not defined");
    process.exit(1);
  }

  const prismaSecondary = new PrismaClient({ datasourceUrl: secondaryDbUrl });

  try {
    const postCount = await prismaSecondary.post.count();
    const commentCount = await prismaSecondary.comment.count();
    const likeCount = await prismaSecondary.like.count();
    const voteCount = await prismaSecondary.vote.count();

    console.log(`\n--- Cluster 3 Data Summary ---`);
    console.log(`Posts: ${postCount}`);
    console.log(`Comments: ${commentCount}`);
    console.log(`Likes: ${likeCount}`);
    console.log(`Votes: ${voteCount}`);

    if (postCount > 0) {
      const samplePosts = await prismaSecondary.post.findMany({ take: 5, select: { content: true } });
      console.log("\nSample Posts:");
      samplePosts.forEach(p => console.log(`- ${p.content.substring(0, 50)}...`));
    }
  } finally {
    await prismaSecondary.$disconnect();
  }
}

main();
