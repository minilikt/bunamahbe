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
