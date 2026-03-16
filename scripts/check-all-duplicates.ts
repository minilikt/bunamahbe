import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🔍 Checking for case-insensitive duplicate emails...");

  const users = await prisma.user.findMany();
  const caseInsensitiveMap = new Map<string, { original: string, id: string }[]>();

  users.forEach((user) => {
    const lowerEmail = user.email.toLowerCase();
    if (!caseInsensitiveMap.has(lowerEmail)) {
      caseInsensitiveMap.set(lowerEmail, []);
    }
    caseInsensitiveMap.get(lowerEmail)?.push({ original: user.email, id: user.id });
  });

  let found = false;
  for (const [lower, entries] of caseInsensitiveMap.entries()) {
    if (entries.length > 1) {
      found = true;
      console.log(`⚠️ Potential duplicates for "${lower}":`);
      entries.forEach(e => console.log(`   - ID: ${e.id}, Email: ${e.original}`));
    }
  }

  if (!found) {
    console.log("✨ No case-insensitive duplicates found in the 'user' collection.");
  }

  console.log("\n🔍 Checking 'verification' collection (identifier)...");
  const verifications = await prisma.verification.findMany();
  const verMap = new Map<string, number>();
  verifications.forEach(v => {
    verMap.set(v.identifier, (verMap.get(v.identifier) || 0) + 1);
  });

  console.log(`📊 Found ${verifications.length} total verification records.`);
  for (const [id, count] of verMap.entries()) {
    if (count > 1) {
      console.log(`   - "${id}" has ${count} records (this is normal for OTP history).`);
    }
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
