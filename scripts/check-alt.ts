import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const prisma = new PrismaClient();

async function main() {
  const targetId = "69c04cc8aea013cb554d1a1f";
  console.log(`🔎 Checking Session/Account for: ${targetId}\n`);

  const [session, account] = await Promise.all([
    prisma.session.findFirst({ where: { userId: targetId } }),
    prisma.account.findFirst({ where: { userId: targetId } }),
  ]);

  console.log("Session:", session ? "FOUND" : "NOT FOUND");
  console.log("Account:", account ? "FOUND" : "NOT FOUND");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
