import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function promoteAdmin() {
  const email = process.argv[2];

  if (!email) {
    console.error("Please provide an email address as an argument.");
    console.error("Usage: npx tsx scripts/promote-admin.ts user@example.com");
    process.exit(1);
  }

  try {
    const user = await prisma.user.update({
      where: { email },
      data: { role: "ADMIN" },
    });

    console.log(`Successfully promoted ${user.name} (${user.email}) to ADMIN.`);
  } catch (error) {
    console.error("Error promoting user:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

promoteAdmin();
