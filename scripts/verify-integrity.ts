import { PrismaClient } from '@prisma/client';
import "dotenv/config";

async function main() {
  const prismaMain = new PrismaClient();

  try {
    console.log("\n--- Verification: Duplicates and Passwords ---\n");

    // 1. Check for duplicate emails
    const allUsers = await prismaMain.user.findMany({ select: { email: true } });
    const emailCounts: Record<string, number> = {};
    allUsers.forEach(u => {
      emailCounts[u.email] = (emailCounts[u.email] || 0) + 1;
    });

    const duplicates = Object.entries(emailCounts).filter(([_, count]) => count > 1);

    if (duplicates.length === 0) {
      console.log("✅ No duplicate emails found in Cluster 0.");
    } else {
      console.log(`❌ Found ${duplicates.length} duplicate emails!`);
      duplicates.forEach(([email, count]) => console.log(`- ${email}: ${count} occurrences`));
    }

    // 2. Check passwords for migrated accounts
    // The migration used createMany which should have preserved fields.
    const allAccounts = await prismaMain.account.findMany({
      select: { providerId: true, password: true }
    });

    const credentialAccounts = allAccounts.filter(a => a.providerId === 'credential' || a.providerId === 'credentials' || a.password);
    const withPassword = credentialAccounts.filter(a => a.password !== null && a.password !== undefined && a.password !== '');

    console.log(`\nVerified ${allAccounts.length} accounts total.`);
    console.log(`Found ${credentialAccounts.length} credential-based accounts.`);
    console.log(`✅ ${withPassword.length} accounts have a password set.`);

    if (credentialAccounts.length > withPassword.length) {
      console.log(`⚠️ Warning: ${credentialAccounts.length - withPassword.length} credential-based accounts are missing a password!`);
    }

  } finally {
    await prismaMain.$disconnect();
  }
}

main();
