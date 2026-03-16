"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

export async function getUserLocations() {
  try {
    const users = await prisma.user.groupBy({
      by: ["city"],
      _count: {
        id: true,
      },
      where: {
        city: {
          not: null,
        },
      },
    });

    return users.map((u) => ({
      city: u.city as string,
      count: u._count.id,
    }));
  } catch (error) {
    console.error("Error fetching user locations:", error);
    return [];
  }
}

export async function completeOnboarding(data: {
  city: string;
  frequency: string;
  favoriteType: string;
  badgeEmoji: string;
  badgeTitle: string;
  badgeDescription: string;
}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        city: data.city,
        frequency: data.frequency,
        favoriteType: data.favoriteType,
        badgeEmoji: data.badgeEmoji,
        badgeTitle: data.badgeTitle,
        badgeDescription: data.badgeDescription,
      },
    });

    revalidatePath("/dashboard");
    revalidatePath("/map");
    revalidatePath("/onboarding");
    
    return { success: true };
  } catch (error) {
    console.error("Complete onboarding error:", error);
    return { success: false, error: "Failed to complete onboarding" };
  }
}
