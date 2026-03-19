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

  const recentVotes = await prisma.vote.findMany({
    take: 10,
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          name: true,
          image: true,
        },
      },
      candidate: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return {
    totalUsers,
    totalVotes,
    candidates,
    recentVotes,
  };
}
