"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { OnboardingSchema } from "@/lib/validations";
import { auditLog } from "@/lib/audit";

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

export async function completeOnboarding(rawInput: unknown) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      await auditLog("UNAUTHORIZED_ACCESS", "unknown", { action: "completeOnboarding" });
      return { success: false, error: "Unauthorized" };
    }

    const validatedData = OnboardingSchema.safeParse(rawInput);
    if (!validatedData.success) {
      await auditLog("FAILED_VALIDATION", session.user.id, { action: "completeOnboarding", errors: validatedData.error.flatten() });
      return { 
        success: false, 
        error: "Invalid input", 
        details: validatedData.error.flatten().fieldErrors 
      };
    }

    const data = validatedData.data;

    await prisma.user.update({
      where: { email: session.user.email },
      data: {
        city: data.city,
        frequency: data.frequency,
        favoriteType: data.favoriteType,
        badgeEmoji: data.badgeEmoji,
        badgeTitle: data.badgeTitle,
        badgeDescription: data.badgeDescription,
      },
    });

    await auditLog("COMPLETE_ONBOARDING", session.user.id, { city: data.city });

    revalidatePath("/dashboard");
    revalidatePath("/map");
    revalidatePath("/onboarding");
    
    return { success: true };
  } catch (error) {
    console.error("Complete onboarding error:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Failed to complete onboarding" 
    };
  }
}
