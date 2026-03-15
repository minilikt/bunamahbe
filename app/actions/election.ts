"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

export async function castVote(candidateId: string) {
  try {
    // 1. Verify session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Only registered members can vote. Please join the association first!" };
    }

    const membershipId = session.user.id;

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
