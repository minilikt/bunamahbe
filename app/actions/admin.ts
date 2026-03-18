"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

async function getAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== "ADMIN") {
    throw new Error("Unauthorized");
  }

  return session;
}

export async function addCandidate(formData: FormData) {
  await getAdminSession();

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;
  const image = formData.get("image") as string;
  const tiktokVideoId = formData.get("tiktokVideoId") as string;

  await prisma.candidate.create({
    data: {
      name,
      username,
      role,
      bio,
      image,
      tiktokVideoId,
    },
  });

  revalidatePath("/admin/candidates");
  revalidatePath("/election");
}

export async function updateCandidate(id: string, formData: FormData) {
  await getAdminSession();

  const name = formData.get("name") as string;
  const username = formData.get("username") as string;
  const role = formData.get("role") as string;
  const bio = formData.get("bio") as string;
  const image = formData.get("image") as string;
  const tiktokVideoId = formData.get("tiktokVideoId") as string;

  await prisma.candidate.update({
    where: { id },
    data: {
      name,
      username,
      role,
      bio,
      image,
      tiktokVideoId,
    },
  });

  revalidatePath("/admin/candidates");
  revalidatePath("/election");
}

export async function deleteCandidate(id: string) {
  await getAdminSession();

  await prisma.candidate.delete({
    where: { id },
  });

  revalidatePath("/admin/candidates");
  revalidatePath("/election");
}

export async function updateUserRole(userId: string, role: string) {
  await getAdminSession();

  await prisma.user.update({
    where: { id: userId },
    data: { role },
  });

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
