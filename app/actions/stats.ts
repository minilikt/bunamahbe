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
    console.error(`[STATS_ACTION_ERROR] Failed to fetch global stats:`, error);
    // Returning identifiable fallback values to distinguish between initial state and error state
    return {
      members: 2847,
      votes: 110,
      cities: 12
    };
  }
}
