"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { CandidateSchema, UserUpdateSchema, RoleUpdateSchema } from "@/lib/validations";
import { auditLog } from "@/lib/audit";

async function getAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    await auditLog("UNAUTHORIZED_ADMIN_ACCESS", session?.user?.id || "unknown", { role: session?.user?.role });
    throw new Error("Unauthorized");
  }

  return session;
}

export async function addCandidate(formData: FormData) {
  const session = await getAdminSession();

  const validatedData = CandidateSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    image: formData.get("image"),
    tiktokVideoId: formData.get("tiktokVideoId"),
  });

  if (!validatedData.success) {
    await auditLog("FAILED_VALIDATION", session.user.id, { action: "addCandidate", errors: validatedData.error.flatten() });
    throw new Error("Invalid input data");
  }

  const candidate = await prisma.candidate.create({
    data: validatedData.data,
  });

  await auditLog("ADD_CANDIDATE", session.user.id, { candidateId: candidate.id, name: candidate.name });

  revalidatePath("/admin/candidates");
  revalidatePath("/election");
}

export async function updateCandidate(id: string, formData: FormData) {
  const session = await getAdminSession();

  const validatedData = CandidateSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    role: formData.get("role"),
    bio: formData.get("bio"),
    image: formData.get("image"),
    tiktokVideoId: formData.get("tiktokVideoId"),
  });

  if (!validatedData.success) {
    await auditLog("FAILED_VALIDATION", session.user.id, { action: "updateCandidate", errors: validatedData.error.flatten() });
    throw new Error("Invalid input data");
  }

  await prisma.candidate.update({
    where: { id },
    data: validatedData.data,
  });

  await auditLog("UPDATE_CANDIDATE", session.user.id, { candidateId: id, updates: validatedData.data });

  revalidatePath("/admin/candidates");
  revalidatePath("/election");
}

export async function deleteCandidate(id: string) {
  const session = await getAdminSession();

  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    throw new Error("Invalid Candidate ID");
  }

  await prisma.candidate.delete({
    where: { id },
  });

  await auditLog("DELETE_CANDIDATE", session.user.id, { candidateId: id });

  revalidatePath("/admin/candidates");
  revalidatePath("/election");
}

export async function updateUserRole(userId: string, role: string) {
  const session = await getAdminSession();

  const validatedData = RoleUpdateSchema.safeParse({ userId, role });
  if (!validatedData.success) {
    await auditLog("FAILED_VALIDATION", session.user.id, { action: "updateUserRole", errors: validatedData.error.flatten() });
    throw new Error("Invalid role update request");
  }

  await prisma.user.update({
    where: { id: validatedData.data.userId },
    data: { role: validatedData.data.role },
  });

  await auditLog("UPDATE_USER_ROLE", session.user.id, { affectedUserId: userId, newRole: role });

  revalidatePath("/admin/staff");
}

export async function updateUser(userId: string, formData: FormData) {
  const session = await getAdminSession();

  const validatedData = UserUpdateSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    image: formData.get("image"),
    role: formData.get("role"),
  });

  if (!validatedData.success) {
    await auditLog("FAILED_VALIDATION", session.user.id, { action: "updateUser", errors: validatedData.error.flatten() });
    throw new Error("Invalid input data");
  }

  await prisma.user.update({
    where: { id: userId },
    data: validatedData.data,
  });

  await auditLog("UPDATE_USER", session.user.id, { affectedUserId: userId, updates: validatedData.data });

  revalidatePath("/admin/staff");
}

export async function getAnalytics() {
  await getAdminSession();

  const totalUsers = await prisma.user.count();
  const totalVotes = await prisma.vote.count();
  const candidates = await prisma.candidate.findMany({
    select: {
      id: true,
      name: true,
      image: true,
      voteCount: true,
    },
    orderBy: {
      voteCount: "desc",
    },
  });

  // Fetch votes without include to avoid Prisma crashing on orphaned records
  const votes = await prisma.vote.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
  });

  // Manually fetch and join user/candidate data
  const userIds = [...new Set(votes.map((v) => v.userId))];
  const candidateIds = [...new Set(votes.map((v) => v.candidateId))];

  const [users, candidateData] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, image: true },
    }),
    prisma.candidate.findMany({
      where: { id: { in: candidateIds } },
      select: { id: true, name: true, image: true },
    }),
  ]);

  const userMap = new Map(users.map((u) => [u.id, u]));
  const candidateMap = new Map(candidateData.map((c) => [c.id, c]));

  // For votes whose userId has no matching User, try to find an Account record
  const unresolvedUserIds = userIds.filter((id) => !userMap.has(id));
  let accountMap = new Map<string, { accountId: string; providerId: string }>();
  if (unresolvedUserIds.length > 0) {
    const accounts = await prisma.account.findMany({
      where: { userId: { in: unresolvedUserIds } },
      select: { userId: true, accountId: true, providerId: true },
    });
    for (const acc of accounts) {
      if (!accountMap.has(acc.userId)) accountMap.set(acc.userId, acc);
    }
  }

  const recentVotes = votes.map((vote) => {
    const candidate = candidateMap.get(vote.candidateId) || { name: "Unknown Candidate", image: null };
    const user = userMap.get(vote.userId);
    if (user) return { ...vote, user, candidate };

    const account = accountMap.get(vote.userId);
    const fallbackLabel =
      account?.providerId === "credential"
        ? account.accountId
        : account
        ? `${account.providerId}: ${account.accountId}`
        : "Unknown User";

    return {
      ...vote,
      user: { name: fallbackLabel, image: null },
      candidate,
    };
  });

  return {
    totalUsers,
    totalVotes,
    candidates,
    recentVotes,
  };
}

export async function getAllVotes(
  page: number = 1,
  limit: number = 50,
  candidateId?: string,
  searchQuery?: string,
) {
  await getAdminSession();

  const skip = (page - 1) * limit;

  // If searching by voter name, we need to find matching user IDs first
  let filteredUserIds: string[] | undefined;
  if (searchQuery && searchQuery.trim() !== "") {
    const matchingUsers = await prisma.user.findMany({
      where: { name: { contains: searchQuery, mode: "insensitive" } },
      select: { id: true },
    });
    filteredUserIds = matchingUsers.map((u) => u.id);
    // If no users match, return empty results immediately
    if (filteredUserIds.length === 0) {
      return { votes: [], totalVotes: 0, totalPages: 0, currentPage: page };
    }
  }

  const where = {
    ...(candidateId && candidateId !== "all" ? { candidateId } : {}),
    ...(filteredUserIds ? { userId: { in: filteredUserIds } } : {}),
  };

  const [votes, totalVotes] = await Promise.all([
    prisma.vote.findMany({
      skip,
      take: limit,
      where,
      orderBy: { createdAt: "desc" },
    }),
    prisma.vote.count({ where }),
  ]);

  // Manually fetch and join user/candidate data
  const userIds = [...new Set(votes.map((v) => v.userId))];
  const candidateIds = [...new Set(votes.map((v) => v.candidateId))];

  const [users, candidateData] = await Promise.all([
    prisma.user.findMany({
      where: { id: { in: userIds } },
      select: { id: true, name: true, email: true, image: true },
    }),
    prisma.candidate.findMany({
      where: { id: { in: candidateIds } },
      select: { id: true, name: true, image: true },
    }),
  ]);

  const userMap = new Map(users.map((u) => [u.id, u]));
  const candidateMap = new Map(candidateData.map((c) => [c.id, c]));

  // For votes whose userId has no matching User, try to find an Account record
  // (better-auth stores accountId = email for credential accounts, or OAuth sub for social)
  const unresolvedUserIds = userIds.filter((id) => !userMap.has(id));
  let accountMap = new Map<string, { accountId: string; providerId: string }>();
  if (unresolvedUserIds.length > 0) {
    const accounts = await prisma.account.findMany({
      where: { userId: { in: unresolvedUserIds } },
      select: { userId: true, accountId: true, providerId: true },
    });
    for (const acc of accounts) {
      if (!accountMap.has(acc.userId)) accountMap.set(acc.userId, acc);
    }
  }

  const enrichedVotes = votes.map((vote) => {
    const candidate = candidateMap.get(vote.candidateId) || { name: "Unknown Candidate", image: null };
    const user = userMap.get(vote.userId);
    if (user) return { ...vote, user, candidate };

    // Try to recover info from account for orphaned votes
    const account = accountMap.get(vote.userId);
    const fallbackLabel =
      account?.providerId === "credential"
        ? account.accountId // for email/password auth, accountId IS the email
        : account
        ? `${account.providerId}: ${account.accountId}`
        : `ID: ${vote.userId.slice(0, 8)}…`;

    return {
      ...vote,
      user: { name: fallbackLabel, email: null, image: null },
      candidate,
    };
  });

  return {
    votes: enrichedVotes,
    totalVotes,
    totalPages: Math.ceil(totalVotes / limit),
    currentPage: page,
  };
}

export async function getCandidatesList() {
  await getAdminSession();
  return prisma.candidate.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });
}

