"use client"
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, MapPin, Coffee, Sparkles, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { completeOnboarding } from "@/app/actions/user";

const ethiopianCities = [
  "Addis Ababa", "Dire Dawa", "Bahir Dar", "Hawassa", "Mekelle", 
  "Gondar", "Jimma", "Harar", "Adama", "Dessie", "Debre Markos", 
  "Shashamane", "Arba Minch", "Nekemte", "Bishoftu"
];

const coffeeFrequencies = [
  "Multiple times a day", "Once a day", "A few times a week", 
  "Once a week", "Occasionally"
];

const coffeeTypes = [
  "Traditional Buna", "Macchiato", "Black Coffee", 
  "Coffee with Milk", "Latte", "Espresso", "Cold Brew"
];

const getBadge = () => ({
  emoji: "🌱",
  title: "Buna Beginner",
  description: "Welcome to the Buna Association! Your coffee journey starts here.",
});

export default function Onboarding() {
  const router = useRouter();
  const { data: session, isPending } = authClient.useSession();
  const [step, setStep] = useState(1);
  const [city, setCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [frequency, setFrequency] = useState("");
  const [favoriteType, setFavoriteType] = useState("");
  const [hp, setHp] = useState(""); // Honeypot
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Middleware now handles these redirections
  useEffect(() => {
    if (!isPending && !session) {
      router.push("/login");
    } else if (!isPending && session && (session.user as any).city && (session.user as any).favoriteType) {
      // Already completed onboarding
      router.push("/dashboard");
    }
  }, [session, isPending, router]);

  const badge = getBadge();
  const canProceedStep1 = city !== "Other" ? city : customCity.trim();
  const canProceedStep2 = frequency && favoriteType;

  const handleCompleteProfile = async () => {
    setIsSubmitting(true);
    try {
      const result = await completeOnboarding({
        city: city === "Other" ? customCity : city,
        frequency,
        favoriteType,
        badgeEmoji: badge.emoji,
        badgeTitle: badge.title,
        badgeDescription: badge.description,
        hp, // Honeypot
      });

      if (!result.success) {
        toast(result.error || "Failed to update profile. Please try again.");
      } else {
        // Refresh session to ensure client-side data is up to date
        await authClient.getSession();
        // Use a hard redirect to ensure middleware picks up the change
        window.location.href = "/dashboard";
      }
    } catch (err) {
      console.error("Update profile error:", err);
      toast("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isPending) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  if (!session) return null;

  return (
    <div className="min-h-screen pt-20 ethiopian-pattern">
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-10">
            <h1 className="font-display text-3xl font-bold text-foreground mb-2">Welcome to Buna</h1>
            <p className="font-body text-muted-foreground">Let&apos;s personalize your experience</p>
          </div>

          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <motion.div
                key={s}
                animate={{ 
                  width: s === step ? 40 : 16,
                  backgroundColor: s === step ? "var(--accent)" : s < step ? "var(--secondary)" : "rgba(255,255,255,0.1)"
                }}
                className="h-2 rounded-full transition-all duration-300"
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="ceramic-surface p-8 md:p-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-clay/10 flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-clay" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">Where are you from?</h2>
                </div>

                <div className="space-y-4">
                  <select
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full h-11 rounded-xl border border-input bg-background px-4 py-2 text-sm font-body text-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                  >
                    <option value="">Select your city</option>
                    {ethiopianCities.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                    <option value="Other">Other</option>
                  </select>

                  {/* Honeypot field - hidden from humans */}
                  <input
                    type="text"
                    name="hp"
                    value={hp}
                    onChange={(e) => setHp(e.target.value)}
                    style={{ position: "absolute", left: "-9999px" }}
                    tabIndex={-1}
                    aria-hidden="true"
                    autoComplete="off"
                  />

                  {city === "Other" && (
                    <input
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="Enter your city"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 py-2 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  )}
                </div>

                <motion.button
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!canProceedStep1}
                  onClick={() => setStep(2)}
                  className="btn-mahber text-sm w-full mt-8 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center justify-center gap-2"
                >
                  Continue <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="ceramic-surface p-8 md:p-10"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-2xl bg-clay/10 flex items-center justify-center">
                    <Coffee className="w-5 h-5 text-clay" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground">Your Coffee Habits</h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="font-display text-sm font-bold text-foreground mb-3 block">Frequency</label>
                    <div className="grid grid-cols-1 gap-2">
                      {coffeeFrequencies.map((f) => (
                        <button
                          key={f}
                          onClick={() => setFrequency(f)}
                          className={`text-left px-4 py-3 rounded-xl border text-sm transition-all ${
                            frequency === f ? "border-accent bg-accent/10" : "border-input bg-background"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-display text-sm font-bold text-foreground mb-3 block">Favorite Type</label>
                    <div className="flex flex-wrap gap-2">
                      {coffeeTypes.map((t) => (
                        <button
                          key={t}
                          onClick={() => setFavoriteType(t)}
                          className={`px-4 py-2 rounded-full border text-sm transition-all ${
                            favoriteType === t ? "border-accent bg-accent/10" : "border-input bg-background"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button onClick={() => setStep(1)} className="btn-gold text-sm"><ArrowLeft className="w-4 h-4" /></button>
                  <button
                    disabled={!canProceedStep2}
                    onClick={() => setStep(3)}
                    className="btn-mahber text-sm flex-1 disabled:opacity-40"
                  >
                    Next <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ceramic-surface p-8 md:p-12 text-center"
              >
                <div className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 gold-ring">
                  <span className="text-4xl">{badge.emoji}</span>
                </div>
                <Sparkles className="w-5 h-5 text-accent mx-auto mb-2" />
                <h2 className="font-display text-2xl font-bold mb-2">You&apos;re Ready!</h2>
                <p className="font-body text-sm text-muted-foreground mb-8">
                  Your profile is complete. Welcome to the mahber!
                </p>

                <motion.button
                  whileHover={{ y: -4 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  onClick={handleCompleteProfile}
                  className="btn-mahber text-base w-full inline-flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Saving..." : "Go to Dashboard"} <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
