import { z } from "zod";

export const OnboardingSchema = z.object({
  city: z.string().min(1, "City is required").max(100),
  frequency: z.string().min(1, "Frequency is required").max(50),
  favoriteType: z.string().min(1, "Favorite coffee type is required").max(50),
  badgeEmoji: z.string().optional(),
  badgeTitle: z.string().min(1).max(100).optional(),
  badgeDescription: z.string().min(1).max(500).optional(),
  hp: z.string().optional(), // Honeypot field for bot protection
});

export const VoteSchema = z.object({
  candidateId: z.string().min(1, "Candidate ID is required").regex(/^[0-9a-fA-F]{24}$/, "Invalid Candidate ID format"),
});

export type OnboardingInput = z.infer<typeof OnboardingSchema>;
export type VoteInput = z.infer<typeof VoteSchema>;

export const CandidateSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  username: z.string().max(50).optional().transform(v => v === "" ? null : v),
  role: z.string().min(1, "Role is required").max(100),
  bio: z.string().min(1, "Biography is required").max(2000),
  image: z.string().url("Invalid image URL"),
  tiktokVideoId: z.string().max(50).optional().transform(v => v === "" ? null : v),
});

export const UserUpdateSchema = z.object({
  name: z.string().min(1).max(100),
  email: z.string().email(),
  image: z.string().url().optional().nullable(),
  role: z.enum(["USER", "STAFF", "ADMIN"]),
});

const mongoId = z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid ID format");

export const PostSchema = z.object({
  content: z.string().min(1, "Post content cannot be empty").max(2000, "Post is too long"),
  tags: z.array(z.string().max(30)).max(5, "Too many tags"),
});

export const CommentSchema = z.object({
  postId: mongoId,
  content: z.string().min(1, "Comment cannot be empty").max(500, "Comment is too long"),
});

export const ReportSchema = z.object({
  postId: mongoId,
  reason: z.string().max(200, "Reason is too long").optional(),
});

export const RoleUpdateSchema = z.object({
  userId: mongoId,
  role: z.enum(["USER", "STAFF", "ADMIN"]),
});
