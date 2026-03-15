"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function joinAssociation(formData: {
  name: string;
  city: string;
  frequency: string;
  favoriteType: string;
  badgeEmoji: string;
  badgeTitle: string;
  badgeDescription: string;
}) {
  try {
    const member = await prisma.member.create({
      data: formData,
    });
    revalidatePath("/dashboard");
    return { success: true, member };
  } catch (error) {
    console.error("Failed to join association:", error);
    return { success: false, error: "Failed to join association" };
  }
}
export async function getMember(id: string) {
  try {
    return await prisma.member.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error("Failed to fetch member:", error);
    return null;
  }
}
