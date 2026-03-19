import { z } from "zod";

export const OnboardingSchema = z.object({
  city: z.string().min(1, "City is required").max(100),
  frequency: z.string().min(1, "Frequency is required").max(50),
  favoriteType: z.string().min(1, "Favorite coffee type is required").max(50),
  badgeEmoji: z.string().emoji().optional(),
  badgeTitle: z.string().min(1).max(100).optional(),
  badgeDescription: z.string().min(1).max(500).optional(),
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
