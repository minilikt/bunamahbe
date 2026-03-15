import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { emailOTP } from "better-auth/plugins";

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined),
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
  },
  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        // TODO: Implement actual email sending logic here (e.g. Resend)
        console.log(`[AUTH-DEV] Sending ${type} OTP: ${otp} to ${email}`);
      },
    })
  ],
  user: {
    additionalFields: {
      city: { type: "string" },
      frequency: { type: "string" },
      favoriteType: { type: "string" },
      badgeEmoji: { type: "string" },
      badgeTitle: { type: "string" },
      badgeDescription: { type: "string" },
    },
  },
});
