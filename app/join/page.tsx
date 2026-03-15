"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowLeft, User, MapPin, Coffee, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { joinAssociation } from "@/app/actions/membership";
import { authClient } from "@/lib/auth-client";

const ethiopianCities = [
  "Addis Ababa",
  "Dire Dawa",
  "Bahir Dar",
  "Hawassa",
  "Mekelle",
  "Gondar",
  "Jimma",
  "Harar",
  "Adama",
  "Dessie",
  "Debre Markos",
  "Shashamane",
  "Arba Minch",
  "Nekemte",
  "Bishoftu",
];

const coffeeFrequencies = [
  "Multiple times a day",
  "Once a day",
  "A few times a week",
  "Once a week",
  "Occasionally",
];

const coffeeTypes = [
  "Traditional Buna",
  "Macchiato",
  "Black Coffee",
  "Coffee with Milk",
  "Latte",
  "Espresso",
  "Cold Brew",
];

const getBadge = () => ({
  emoji: "🌱",
  title: "Buna Beginner",
  description: "Welcome to the Buna Association! Your coffee journey starts here.",
});

export default function JoinMembership() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [city, setCity] = useState("");
  const [customCity, setCustomCity] = useState("");
  const [frequency, setFrequency] = useState("");
  const [favoriteType, setFavoriteType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const badge = getBadge();

  const canProceedStep1 = name.trim() && email.trim() && password.length >= 6 && (city !== "Other" ? city : customCity.trim());
  const canProceedStep2 = frequency && favoriteType;

  const handleJoin = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await authClient.signUp.email({
        email,
        password,
        name,
        image: `https://api.dicebear.com/7.x/avataaars/svg?seed=${name}`,
        // Additional fields must be supported by the adapter/server config
        // @ts-ignore - custom fields are handled dynamically by Better Auth
        city: city === "Other" ? customCity : city,
        // @ts-ignore
        frequency,
        // @ts-ignore
        favoriteType,
        // @ts-ignore
        badgeEmoji: badge.emoji,
        // @ts-ignore
        badgeTitle: badge.title,
        // @ts-ignore
        badgeDescription: badge.description,
      });

      if (error) {
        alert(error.message || "Failed to join. Please try again.");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Sign up error:", err);
      alert("An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-20 ethiopian-pattern">
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-lg mx-auto">
          {/* Progress */}
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-2 rounded-full transition-all duration-300 ${
                  s === step ? "w-10 bg-accent" : s < step ? "w-10 bg-clay" : "w-10 bg-secondary"
                }`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            {/* Step 1: Name & City */}
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
                    <User className="w-5 h-5 text-clay" />
                  </div>
                  <h2 className="font-display text-2xl font-bold text-foreground" style={{ lineHeight: 1.1 }}>
                    Tell us about you
                  </h2>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="font-display text-sm font-bold text-foreground mb-2 block">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 py-2 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>

                  <div>
                    <label className="font-display text-sm font-bold text-foreground mb-2 block">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter your email"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 py-2 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>

                  <div>
                    <label className="font-display text-sm font-bold text-foreground mb-2 block">
                      Password (min 6 chars) *
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Create a password"
                      className="w-full h-11 rounded-xl border border-input bg-background px-4 py-2 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                    />
                  </div>

                  <div>
                    <label className="font-display text-sm font-bold text-foreground mb-2 block">
                      <MapPin className="w-3.5 h-3.5 inline mr-1" />
                      Your City *
                    </label>
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
                    {city === "Other" && (
                      <motion.input
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        type="text"
                        value={customCity}
                        onChange={(e) => setCustomCity(e.target.value)}
                        placeholder="Enter your city"
                        className="w-full h-11 rounded-xl border border-input bg-background px-4 py-2 text-sm font-body mt-3 placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
                      />
                    )}
                  </div>
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

            {/* Step 2: Coffee Preferences */}
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
                  <h2 className="font-display text-2xl font-bold text-foreground" style={{ lineHeight: 1.1 }}>
                    Your Coffee Habits
                  </h2>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="font-display text-sm font-bold text-foreground mb-3 block">
                      How often do you drink coffee? *
                    </label>
                    <div className="space-y-2">
                      {coffeeFrequencies.map((f) => (
                        <button
                          key={f}
                          onClick={() => setFrequency(f)}
                          className={`w-full text-left px-4 py-3 rounded-xl border text-sm font-body transition-all ${
                            frequency === f
                              ? "border-accent bg-accent/10 text-foreground"
                              : "border-input bg-background text-muted-foreground hover:border-accent/50"
                          }`}
                        >
                          {f}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="font-display text-sm font-bold text-foreground mb-3 block">
                      Favorite Coffee Type *
                    </label>
                    <div className="flex flex-wrap gap-2">
                      {coffeeTypes.map((t) => (
                        <button
                          key={t}
                          onClick={() => setFavoriteType(t)}
                          className={`px-4 py-2 rounded-full border text-sm font-body transition-all ${
                            favoriteType === t
                              ? "border-accent bg-accent/10 text-foreground"
                              : "border-input bg-background text-muted-foreground hover:border-accent/50"
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setStep(1)}
                    className="btn-gold text-sm inline-flex items-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Back
                  </motion.button>
                  <motion.button
                    whileHover={{ y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    disabled={!canProceedStep2}
                    onClick={() => setStep(3)}
                    className="btn-mahber text-sm flex-1 disabled:opacity-40 disabled:pointer-events-none inline-flex items-center justify-center gap-2"
                  >
                    See My Badge <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Badge Reveal */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="ceramic-surface p-8 md:p-12 text-center"
              >
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="w-28 h-28 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-6 gold-ring"
                >
                  <span className="text-5xl">{badge.emoji}</span>
                </motion.div>

                <Sparkles className="w-5 h-5 text-accent mx-auto mb-2" />

                <h2 className="font-display text-2xl font-bold text-foreground mb-2" style={{ lineHeight: 1.1 }}>
                  Welcome, {name}!
                </h2>
                <p className="font-body text-muted-foreground mb-1">
                  Your badge: <span className="font-display font-bold text-accent">{badge.title}</span>
                </p>
                <p className="font-body text-sm text-muted-foreground mb-8">
                  {badge.description}
                </p>

                <div className="ceramic-surface p-4 mb-8 text-left">
                  <div className="flex justify-between text-sm font-body mb-1">
                    <span className="text-muted-foreground">City</span>
                    <span className="text-foreground font-medium">{city === "Other" ? customCity : city}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body mb-1">
                    <span className="text-muted-foreground">Coffee Frequency</span>
                    <span className="text-foreground font-medium">{frequency}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body">
                    <span className="text-muted-foreground">Favorite</span>
                    <span className="text-foreground font-medium">{favoriteType}</span>
                  </div>
                </div>

                <motion.button
                  whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(78,52,46,0.2)" }}
                  whileTap={{ scale: 0.98 }}
                  disabled={isSubmitting}
                  onClick={handleJoin}
                  className="btn-mahber text-base w-full inline-flex items-center justify-center gap-2"
                >
                  {isSubmitting ? "Joining..." : "Go to Dashboard"} <ArrowRight className="w-4 h-4" />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}