"use server"

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function castVote(candidateId: string, membershipId: string) {
  try {
    // 1. Verify membership
    const member = await prisma.member.findUnique({
      where: { id: membershipId },
    });

    if (!member) {
      return { success: false, error: "Only registered members can vote. Please join the association first!" };
    }

    // 2. Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: { userId: membershipId },
    });

    if (existingVote) {
      return { success: false, error: "You have already voted!" };
    }

    // Use a transaction to ensure atomic increment and vote creation
    const result = await prisma.$transaction([
      prisma.vote.create({
        data: {
          candidateId,
          userId: membershipId,
        },
      }),
      prisma.candidate.update({
        where: { id: candidateId },
        data: {
          voteCount: {
            increment: 1,
          },
        },
      }),
    ]);

    revalidatePath("/election");
    return { success: true, result };
  } catch (error) {
    console.error("Failed to cast vote:", error);
    return { success: false, error: "Failed to cast vote" };
  }
}

export async function getCandidates() {
  return await prisma.candidate.findMany({
    orderBy: {
      voteCount: "desc",
    },
  });
}
