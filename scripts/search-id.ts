import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const targetId = "69bf3daa2228bb822d124db4";
  console.log(`Searching for ID: ${targetId}`);

  // 1. Check User table
  const user = await prisma.user.findUnique({
    where: { id: targetId },
    select: { email: true, name: true }
  });

  if (user) {
    console.log("✅ Found in User table:");
    console.log(`   Name: ${user.name}`);
    console.log(`   Email: ${user.email}`);
  } else {
    console.log("❌ Not found in User table. Checking Account table...");

    // 2. Check Account table
    const account = await prisma.account.findFirst({
      where: { userId: targetId },
      select: { accountId: true, providerId: true }
    });

    if (account) {
      console.log("✅ Found in Account table:");
      console.log(`   Provider: ${account.providerId}`);
      console.log(`   AccountId (likely email): ${account.accountId}`);
    } else {
      console.log("❌ Not found in Account table either.");
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
