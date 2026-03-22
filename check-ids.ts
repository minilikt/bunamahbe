import prisma from "./lib/prisma";

async function main() {
  const users = await prisma.user.findMany({
    take: 5,
  });
  console.log("Users found:", users.length);
  users.forEach(user => {
    console.log(`ID: "${user.id}" (Type: ${typeof user.id}), Name: ${user.name}`);
  });
}

main().catch(console.error);
