"use client"
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { GoogleButton } from "@/components/auth/google-button";
import Link from "next/link";

export default function JoinMembership() {
  const router = useRouter();

  return (
    <div className="min-h-screen pt-20 ethiopian-pattern">
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="ceramic-surface p-8 md:p-10 text-center"
          >
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 rounded-2xl bg-clay/10 flex items-center justify-center">
                <Sparkles className="w-8 h-8 text-clay" />
              </div>
            </div>

            <h2 className="font-display text-3xl font-bold text-foreground mb-4" style={{ lineHeight: 1.1 }}>
              Join the Association
            </h2>
            
            <p className="font-body text-muted-foreground mb-10">
              To ensure a secure and verified community, we only accept registrations via Google.
            </p>

            <div className="space-y-6">
              <GoogleButton text="Sign up with Google" callbackURL="/onboarding" />
              
              <p className="font-body text-xs text-muted-foreground px-4">
                By joining, you agree to our terms and will be redirected to complete your profile.
              </p>
            </div>

            <div className="mt-10 pt-8 border-t border-input">
              <p className="font-body text-sm text-muted-foreground">
                Already have an account? <Link href="/login" className="text-accent hover:underline font-medium">Sign in</Link>
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}