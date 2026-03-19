"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";

import { VoteSchema } from "@/lib/validations";
import { auditLog } from "@/lib/audit";

export async function castVote(rawInput: unknown) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return { success: false, error: "Only registered members can vote. Please join the association first!" };
    }

    const validatedData = VoteSchema.safeParse(typeof rawInput === 'string' ? { candidateId: rawInput } : rawInput);
    if (!validatedData.success) {
      return { success: false, error: "Invalid candidate selection" };
    }

    const { candidateId } = validatedData.data;
    const userId = session.user.id;

    // Check if user already voted
    const existingVote = await prisma.vote.findUnique({
      where: { userId },
    });

    if (existingVote) {
      // If same candidate, do nothing
      if (existingVote.candidateId === candidateId) {
        return { success: true, message: "Already voted for this candidate" };
      }

      // Change vote: Decrement old, Update vote, Increment new
      await prisma.$transaction([
        prisma.candidate.update({
          where: { id: existingVote.candidateId },
          data: { voteCount: { decrement: 1 } },
        }),
        prisma.vote.update({
          where: { userId },
          data: { candidateId },
        }),
        prisma.candidate.update({
          where: { id: candidateId },
          data: { voteCount: { increment: 1 } },
        }),
      ]);
    } else {
      // New vote
      await prisma.$transaction([
        prisma.vote.create({
          data: {
            candidateId,
            userId,
          },
        }),
        prisma.candidate.update({
          where: { id: candidateId },
          data: { voteCount: { increment: 1 } },
        }),
      ]);
    }

    await auditLog("CAST_VOTE", userId, { candidateId });

    revalidatePath("/election");
    return { success: true };
  } catch (error) {
    console.error("Failed to cast vote:", error);
    return { success: false, error: "Failed to cast vote" };
  }
}

export async function getUserVote() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) return null;

    const vote = await prisma.vote.findUnique({
      where: { userId: session.user.id },
      select: { candidateId: true }
    });

    return vote?.candidateId || null;
  } catch (error) {
    console.error("Failed to get user vote:", error);
    return null;
  }
}

export async function getCandidates() {
  return await prisma.candidate.findMany({
    orderBy: {
      voteCount: "desc", // Changed to show most popular first
    },
  });
}
