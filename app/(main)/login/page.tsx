"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Link from "next/link";
import { GoogleButton } from "@/components/auth/google-button";
import { toast } from "sonner";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && session) {
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  const canSubmit = email.trim().length > 5 && email.includes("@") && password.length >= 6;

  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        toast(error.message || "Invalid email or password. Please try again.");
      } else {
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Sign in error:", err);
      toast("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 ethiopian-pattern flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="max-w-md mx-auto ceramic-surface p-8 md:p-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-2xl bg-clay/10 flex items-center justify-center">
              <Mail className="w-5 h-5 text-clay" />
            </div>
            <h2 className="font-display text-2xl font-bold text-foreground" style={{ lineHeight: 1.1 }}>
              Welcome Back
            </h2>
          </div>

          <p className="font-body text-sm text-muted-foreground mb-6">
            Sign in to your Buna account.
          </p>

          <div className="space-y-4 mb-8">
            <div>
              <label className="font-display text-sm font-bold text-foreground mb-2 block">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full h-11 rounded-xl border border-input bg-background px-4 py-2 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && canSubmit && !isSubmitting) handleLogin();
                }}
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="font-display text-sm font-bold text-foreground block">
                  Password
                </label>
                <button 
                  type="button"
                  onClick={() => toast("Contact your Administrator to reset your password.")}
                  className="text-xs font-body text-accent hover:underline px-1"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-11 rounded-xl border border-input bg-background px-4 pr-10 py-2 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && canSubmit && !isSubmitting) handleLogin();
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ y: -2 }}
            whileTap={{ scale: 0.98 }}
            disabled={!canSubmit || isSubmitting}
            onClick={handleLogin}
            className="btn-mahber text-sm w-full disabled:opacity-40 disabled:pointer-events-none inline-flex items-center justify-center gap-2"
          >
            {isSubmitting ? "Signing in..." : "Sign In"} <ArrowRight className="w-4 h-4" />
          </motion.button>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-input" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <GoogleButton />

          <p className="text-center font-body text-sm text-muted-foreground mt-6">
            Don&apos;t have an account? <Link href="/join" className="text-accent hover:underline font-medium">Join us</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
