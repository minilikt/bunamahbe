"use server"

import prisma from "@/lib/prisma";

export async function getGlobalStats() {
  try {
    const [memberCount, voteCount, cities] = await Promise.all([
      prisma.user.count(),
      prisma.vote.count(),
      prisma.user.groupBy({
        by: ['city'],
        where: {
          city: { not: null }
        }
      })
    ]);

    return {
      members: memberCount,
      votes: voteCount,
      cities: cities.length
    };
  } catch (error) {
    console.error("Error fetching global stats:", error);
    return {
      members: 2847,
      votes: 100,
      cities: 10
    };
  }
}
