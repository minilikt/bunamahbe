"use server"

import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath, unstable_cache } from "next/cache";
import prisma from "@/lib/prisma";

import { VoteSchema } from "@/lib/validations";
import { auditLog } from "@/lib/audit";
import { checkRateLimit } from "@/lib/rate-limit";

export async function castVote(rawInput: unknown) {
  try {
    // 1. Rate Limiting (5 votes per minute per IP)
    const { success: rateLimitOk } = await checkRateLimit("castVote", 5);
    if (!rateLimitOk) {
      return { success: false, error: "Too many voting attempts. Please slow down!" };
    }

    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      console.warn("[VOTE_ACTION_WARN] Unauthorized attempt or session not found. BETTER_AUTH_URL:", process.env.BETTER_AUTH_URL);
      await auditLog("UNAUTHORIZED_ACCESS", "unknown", { action: "castVote" });
      return { success: false, error: "Only registered members can vote. Please join the association first!" };
    }

    // Enforce onboarding
    if (!(session.user as any).city) {
      return { success: false, error: "Please complete your onboarding to participate in the election!" };
    }

    const validatedData = VoteSchema.safeParse(typeof rawInput === 'string' ? { candidateId: rawInput } : rawInput);
    if (!validatedData.success) {
      await auditLog("FAILED_VALIDATION", session.user.id, { action: "castVote", errors: validatedData.error.flatten() });
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
  } catch (error: any) {
    console.error("[VOTE_ACTION_ERROR] Failed to cast vote:", error.stack || error);
    return { success: false, error: "Failed to cast vote. Please try again later." };
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

export const getCandidates = unstable_cache(
  async () => {
    return await prisma.candidate.findMany({
      orderBy: {
        voteCount: "desc",
      },
    });
  },
  ["candidates-list"],
  { tags: ["candidates"], revalidate: 60 }
);
