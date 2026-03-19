"use server";

import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath, unstable_cache } from "next/cache";
import { auditLog } from "@/lib/audit";
import { PostSchema, CommentSchema, ReportSchema } from "@/lib/validations";

export const getPosts = unstable_cache(
  async (tag?: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: tag ? { tags: { has: tag } } : {},
      include: {
        user: {
          select: {
            name: true,
            city: true,
          },
        },
        likes: true,
        comments: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            createdAt: "asc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return posts.map((post: any) => ({
      id: post.id,
      user: post.user.name,
      location: post.user.city || "Ethiopia",
      content: post.content,
      likes: post.likes.length,
      tags: post.tags,
      time: formatTimeAgo(post.createdAt),
      replies: post.comments.map((comment: any) => ({
        id: comment.id,
        user: comment.user.name,
        content: comment.content,
        time: formatTimeAgo(comment.createdAt),
      })),
      likedBy: post.likes.map((l: any) => l.userId),
    }));
  } catch (error) {
    console.error("[GET_POSTS]", error);
    return [];
  }
},
["community-posts"],
{ tags: ["posts"], revalidate: 60 }
);

export async function createPost(content: string, tags: string[]) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    await auditLog("UNAUTHORIZED_ACCESS", "unknown", { endpoint: "community_action" });
    throw new Error("Unauthorized");
  }

  const validatedData = PostSchema.safeParse({ content, tags });
  if (!validatedData.success) {
    await auditLog("FAILED_VALIDATION", session.user.id, { action: "createPost", errors: validatedData.error.flatten() });
    throw new Error("Invalid input");
  }

  try {
    const post = await prisma.post.create({
      data: {
        content: validatedData.data.content,
        tags: validatedData.data.tags,
        userId: session.user.id,
      },
    });

    await auditLog("CREATE_POST", session.user.id, { postId: post.id });

    revalidatePath("/community");
  } catch (error) {
    console.error("[CREATE_POST]", error);
    throw new Error(`Failed to create post ${error}`);
  }
}

export async function toggleLike(postId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    await auditLog("UNAUTHORIZED_ACCESS", "unknown", { endpoint: "community_action" });
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;

  try {
    const existingLike = await prisma.like.findUnique({
      where: {
        postId_userId: {
          postId,
          userId,
        },
      },
    });

    if (existingLike) {
      await prisma.like.delete({
        where: {
          id: existingLike.id,
        },
      });
    } else {
      await prisma.like.create({
        data: {
          postId,
          userId,
        },
      });
    }

    await auditLog("TOGGLE_LIKE", session.user.id, { postId });

    revalidatePath("/community");
  } catch (error) {
    console.error("[TOGGLE_LIKE]", error);
    throw new Error("Failed to toggle like");
  }
}

export async function addComment(postId: string, content: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    await auditLog("UNAUTHORIZED_ACCESS", "unknown", { endpoint: "community_action" });
    throw new Error("Unauthorized");
  }

  const validatedData = CommentSchema.safeParse({ postId, content });
  if (!validatedData.success) {
    await auditLog("FAILED_VALIDATION", session.user.id, { action: "addComment", errors: validatedData.error.flatten() });
    throw new Error("Invalid input");
  }

  try {
    const comment = await prisma.comment.create({
      data: {
        content: validatedData.data.content,
        postId: validatedData.data.postId,
        userId: session.user.id,
      },
    });
    
    await auditLog("ADD_COMMENT", session.user.id, { postId, commentId: comment.id });

    revalidatePath("/community");
    return comment;
  } catch (error) {
    console.error("[ADD_COMMENT]", error);
    throw new Error("Failed to add comment");
  }
}

export async function reportPost(postId: string, reason?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  const validatedData = ReportSchema.safeParse({ postId, reason });
  if (!validatedData.success) {
    await auditLog("FAILED_VALIDATION", session.user.id, { action: "reportPost", errors: validatedData.error.flatten() });
    throw new Error("Invalid input");
  }

  try {
    const report = await prisma.report.create({
      data: {
        postId: validatedData.data.postId,
        userId: session.user.id,
        reason: validatedData.data.reason || "No reason provided",
      },
    });

    await auditLog("REPORT_POST", session.user.id, { postId, reportId: report.id });

    return report;
  } catch (error) {
    console.error("[REPORT_POST]", error);
    throw new Error("Failed to report post");
  }
}

function formatTimeAgo(date: Date) {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  if (minutes > 0) return `${minutes}m ago`;
  return "Just now";
}
