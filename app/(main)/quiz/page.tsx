"use client"
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Coffee, ArrowRight, RotateCcw, Sparkles } from "lucide-react";

interface QuizQuestion {
  question: string;
  options: string[];
}

const questions: QuizQuestion[] = [
  {
    question: "Do you add sugar to your coffee?",
    options: ["Never — pure black", "Yes, always", "Sometimes, depends on my mood"],
  },
  {
    question: "How many cups of coffee per day?",
    options: ["Just 1", "2–3 cups", "4+ (don't judge me)"],
  },
  {
    question: "Your favorite coffee style?",
    options: ["Traditional ceremony ☕", "Macchiato", "Black coffee, no frills"],
  },
  {
    question: "When do you drink your first coffee?",
    options: ["Before sunrise", "Mid-morning", "It's always coffee o'clock"],
  },
  {
    question: "Pick your coffee companion:",
    options: ["Popcorn (classic)", "Kolo (roasted barley)", "Just the coffee, thanks"],
  },
];

const personalities = [
  {
    name: "The Ceremony Purist",
    emoji: "🏺",
    description: "You honor the traditions. Three rounds, incense burning, community gathered — you don't rush greatness.",
  },
  {
    name: "The Office Coffee Addict",
    emoji: "💼",
    description: "Spreadsheets and espresso shots fuel your day. You've mapped every café within walking distance of your office.",
  },
  {
    name: "The Macchiato Philosopher",
    emoji: "🤔",
    description: "You contemplate life over a perfectly layered macchiato. Deep thoughts, deeper flavors.",
  },
  {
    name: "The Midnight Coffee Coder",
    emoji: "🌙",
    description: "Sleep is overrated. Code, coffee, repeat. Your best work happens after midnight with a fresh brew.",
  },
];

export default function Quiz() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResult, setShowResult] = useState(false);

  const handleAnswer = (optionIndex: number) => {
    const newAnswers = [...answers, optionIndex];
    setAnswers(newAnswers);
    if (currentQ < questions.length - 1) {
      setTimeout(() => setCurrentQ(currentQ + 1), 300);
    } else {
      setTimeout(() => setShowResult(true), 300);
    }
  };

  const getResult = () => {
    const sum = answers.reduce((a, b) => a + b, 0);
    return personalities[sum % personalities.length];
  };

  const restart = () => {
    setCurrentQ(0);
    setAnswers([]);
    setShowResult(false);
  };

  return (
    <div className="min-h-screen pt-20 ethiopian-pattern">
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-2xl mx-auto">
          {!showResult ? (
            <>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-12"
              >
                <Coffee className="w-8 h-8 text-clay mx-auto mb-4" />
                <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tightest" style={{ lineHeight: 0.95 }}>
                  Coffee Personality Quiz
                </h1>
                <p className="font-body text-muted-foreground">
                  Question {currentQ + 1} of {questions.length}
                </p>
                {/* Progress bar */}
                <div className="mt-4 h-1.5 bg-secondary rounded-full max-w-xs mx-auto overflow-hidden">
                  <motion.div
                    className="h-full bg-clay rounded-full"
                    animate={{ width: `${((currentQ + 1) / questions.length) * 100}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
              </motion.div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={currentQ}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                  className="ceramic-surface p-8 md:p-12"
                >
                  <h2 className="font-display text-xl md:text-2xl font-bold text-foreground mb-8" style={{ lineHeight: 1.2 }}>
                    {questions[currentQ].question}
                  </h2>
                  <div className="space-y-3">
                    {questions[currentQ].options.map((option, i) => (
                      <motion.button
                        key={i}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleAnswer(i)}
                        className="w-full text-left p-4 rounded-2xl border border-border bg-background hover:border-accent hover:bg-accent/5 transition-all font-body text-foreground flex items-center justify-between group"
                      >
                        <span>{option}</span>
                        <ArrowRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
                      </motion.button>
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
            </>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
              className="ceramic-surface p-8 md:p-16 text-center"
            >
              <Sparkles className="w-8 h-8 text-accent mx-auto mb-4" />
              <p className="font-body text-sm uppercase tracking-widest text-muted-foreground mb-4">
                Your Coffee Personality
              </p>
              <div className="text-6xl mb-6">{getResult().emoji}</div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4 tracking-tightest" style={{ lineHeight: 1 }}>
                {getResult().name}
              </h2>
              <p className="font-body text-lg text-muted-foreground max-w-md mx-auto mb-8 leading-relaxed">
                {getResult().description}
              </p>
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={restart}
                className="btn-mahber inline-flex items-center gap-2 text-sm"
              >
                <RotateCcw className="w-4 h-4" /> Brew Again
              </motion.button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
