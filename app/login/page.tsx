"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, Mail, KeyRound } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { InputOTP, InputOTPGroup, InputOTPSlot } from '@/components/ui/input-otp';
import Link from "next/link";
import { GoogleButton } from "@/components/auth/google-button";

export default function Login() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const canProceedStep1 = email.trim().length > 5 && email.includes("@");
  const canProceedStep2 = otp.length === 6;

  const handleSendOtp = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await authClient.emailOtp.sendVerificationOtp({
        email,
        type: "sign-in",
      });
      if (error) {
        alert(error.message || "Failed to send code. Please try again.");
      } else {
        setStep(2);
      }
    } catch (err) {
      console.error("Send OTP error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogin = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await authClient.signIn.emailOtp({
        email,
        otp,
      });

      if (error) {
        alert(error.message || "Invalid or expired code. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Sign in error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 ethiopian-pattern flex items-center justify-center">
      <div className="container mx-auto px-4 md:px-8 py-16">
        <div className="max-w-md mx-auto ceramic-surface p-8 md:p-10">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-clay/10 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-clay" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground" style={{ lineHeight: 1.1 }}>
                    Welcome Back
                  </h2>
                </div>

                <p className="font-body text-sm text-muted-foreground mb-6">
                  Enter your email address to sign in. We&apos;ll send you a verification code.
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
                        if (e.key === 'Enter' && canProceedStep1 && !isSubmitting) {
                          handleSendOtp();
                        }
                      }}
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!canProceedStep1 || isSubmitting}
                  onClick={handleSendOtp}
                  className="btn-mahber text-sm w-full disabled:opacity-40 disabled:pointer-events-none inline-flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Sending..." : "Continue"} <ArrowRight className="w-4 h-4" />
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

              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="text-center"
              >
                <div className="flex items-center gap-3 mb-6 justify-center">
                  <div className="w-12 h-12 rounded-2xl bg-accent/10 flex items-center justify-center">
                    <KeyRound className="w-6 h-6 text-accent" />
                  </div>
                </div>

                <h2 className="font-display text-2xl font-bold text-foreground mb-4" style={{ lineHeight: 1.1 }}>
                  Check your console
                </h2>
                <p className="font-body text-muted-foreground mb-8 text-sm">
                  We sent a 6-digit verification code to <br/><strong>{email}</strong>
                </p>

                <div className="flex justify-center mb-8">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp} disabled={isSubmitting}>
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>

                <div className="flex flex-col gap-4">
                  <motion.button
                    whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(78,52,46,0.2)" }}
                    whileTap={{ scale: 0.98 }}
                    disabled={isSubmitting || !canProceedStep2}
                    onClick={handleLogin}
                    className="btn-mahber text-base w-full inline-flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? "Verifying..." : "Sign In"} <ArrowRight className="w-4 h-4" />
                  </motion.button>
                  
                  <div className="flex items-center justify-between text-sm mt-2">
                    <button 
                      onClick={() => setStep(1)}
                      disabled={isSubmitting}
                      className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
                    >
                      <ArrowLeft className="w-3 h-3" /> Back
                    </button>
                    <span className="text-muted-foreground">
                      Didn&apos;t get it?{' '}
                      <button 
                        onClick={handleSendOtp}
                        disabled={isSubmitting}
                        className='text-accent hover:underline font-medium'
                      >
                        Resend
                      </button>
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
