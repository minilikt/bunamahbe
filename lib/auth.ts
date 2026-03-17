import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "./prisma";
import { emailOTP } from "better-auth/plugins";
import { sendEmail } from "./resend";

const otpSubjects: Record<string, string> = {
  "sign-in": "Your Buna Sign-In Code",
  "sign-up": "Welcome to Buna — Verify Your Email",
  "email-verification": "Verify Your Buna Email",
  "forget-password": "Reset Your Buna Password",
};

export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined),
  database: prismaAdapter(prisma, {
    provider: "mongodb",
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          return {
            data: {
              ...user,
              image: user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`,
            },
          };
        },
      },
    },
  },

  plugins: [
    emailOTP({
      async sendVerificationOTP({ email, otp, type }) {
        const subject = otpSubjects[type] ?? "Your Buna Verification Code";
        const { error } = await sendEmail({
          to: email,
          subject,
          html: `
            <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px 24px;background:#fafafa;border-radius:12px;border:1px solid #e5e5e5;">
              <h1 style="font-size:24px;font-weight:700;color:#1a1a1a;margin:0 0 8px;">☕ Buna</h1>
              <p style="color:#555;font-size:15px;margin:0 0 24px;">Your verification code is below. It expires in 10 minutes.</p>
              <div style="background:#fff;border:1px solid #e5e5e5;border-radius:8px;padding:24px;text-align:center;margin-bottom:24px;">
                <span style="font-size:40px;font-weight:800;letter-spacing:12px;color:#1a1a1a;">${otp}</span>
              </div>
              <p style="color:#999;font-size:13px;margin:0;">If you didn't request this, you can safely ignore this email.</p>
            </div>
          `,
        });
        if (error) {
          console.error("[AUTH] Failed to send OTP email:", error);
        }
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
