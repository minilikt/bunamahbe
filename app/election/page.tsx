"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Award, Watch } from "lucide-react";
import CandidateCard from "@/components/CandidateCard";
import { castVote, getCandidates } from "@/app/actions/election";

import { authClient } from "@/lib/auth-client";

export default function Election() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showAll, setShowAll] = useState(false);
  const { data: session } = authClient.useSession();

  const INITIAL_COUNT = 8;
  const visibleCandidates = showAll ? candidates : candidates.slice(0, INITIAL_COUNT);
  const hiddenCount = candidates.length - INITIAL_COUNT;

  useEffect(() => {
    // Fetch real candidates
    const loadCandidates = async () => {
      const data = await getCandidates();
      setCandidates(data);
    };
    loadCandidates();
  }, []);

  // Countdown timer
  useEffect(() => {
    const targetDate = new Date("2026-03-17T00:00:00");

    const updateTimer = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(difference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((difference / 1000 / 60) % 60),
        seconds: Math.floor((difference / 1000) % 60),
      });
    };

    updateTimer(); // Run once immediately
    const timer = setInterval(updateTimer, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleVote = async (id: string) => {
    if (!session) {
      alert("Only registered members can vote! Please go to the 'Join Association' page first.");
      return;
    }
    if (votedFor) return;
    
    const result = await castVote(id);
    
    if (result.success) {
      setVotedFor(id);
      // Refresh candidates list to show updated score
      const updated = await getCandidates();
      setCandidates(updated);
    } else {
      alert(result.error);
    }
  };

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const sortedForChart = [...candidates].sort((a, b) => b.voteCount - a.voteCount).slice(0, 8);
  const maxVotes = sortedForChart[0]?.voteCount || 1;

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <section className="py-16 md:py-24 ethiopian-pattern">
        <div className="container mx-auto px-4 md:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-clay/10 text-clay font-body text-sm font-medium mb-6">
              <Award className="w-4 h-4" />
              Presidential Election 2025
            </div>
            <h1 className="font-display text-4xl md:text-6xl font-bold text-foreground mb-4 tracking-tightest" style={{ lineHeight: 0.95 }}>
              Vote for Your
              <br />
              <span className="text-gradient-gold">Coffee President</span>
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-xl mx-auto">
              The people's choice. One vote per member. Choose who will lead the Buna Association.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Candidates Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4 md:px-8">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground mb-8 text-center" style={{ lineHeight: 1.1 }}>
            Presidential Candidates
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleCandidates.map((candidate, i) => (
              <CandidateCard
                key={candidate.id}
                name={candidate.name}
                handle={candidate.username || "anonymous"}
                statement={candidate.bio}
                voteCount={candidate.voteCount}
                delay={i * 0.05}
                hasVoted={votedFor !== null}
                onVote={() => handleVote(candidate.id)}
              />
            ))}
          </div>
          {!showAll && hiddenCount > 0 && (
            <div className="text-center mt-10">
              <motion.button
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowAll(true)}
                className="btn-gold text-sm inline-flex items-center gap-2"
              >
                Show {hiddenCount} More Candidates
              </motion.button>
            </div>
          )}
        </div>
      </section>

      {/* Live Results Bar Chart */}
      <section className="py-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="ceramic-surface p-8 md:p-12 max-w-4xl mx-auto">
            <h3 className="font-display text-2xl font-bold text-foreground mb-2 text-center" style={{ lineHeight: 1.1 }}>
              Live Results
            </h3>
            <p className="text-center font-body text-sm text-muted-foreground mb-8">
              {totalVotes.toLocaleString()} total votes cast
            </p>
            <div className="space-y-4">
              {sortedForChart.map((candidate, i) => (
                <motion.div
                  key={candidate.id}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center gap-4"
                >
                  <span className="font-body text-sm text-muted-foreground w-28 md:w-36 truncate text-right">
                    {candidate.name}
                  </span>
                  <div className="flex-1 h-8 bg-secondary rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${(candidate.voteCount / maxVotes) * 100}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: i * 0.05, type: "spring", bounce: 0.4 }}
                      className={`h-full rounded-full ${i === 0 ? "bg-clay" : i === 1 ? "bg-accent" : "bg-primary/60"}`}
                    />
                  </div>
                  <span className="font-display font-bold text-sm tabular-nums w-14 text-right">
                    {candidate.voteCount}
                  </span>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsor & Countdown */}
      {/* <section className="py-16 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Watch className="w-5 h-5 text-accent" />
              <span className="text-xs uppercase tracking-widest font-body text-primary-foreground/50">
                Official Timekeeper of the Buna Election
              </span>
            </div>
            <h3 className="font-display text-2xl md:text-3xl font-bold mb-2 text-accent" style={{ lineHeight: 1.1 }}>
              Ge'ez Watches
            </h3>
            <p className="font-body text-sm text-primary-foreground/60 mb-8 max-w-md mx-auto">
              Timekeeping rooted in Ethiopian heritage. Precision crafted for the modern Ethiopian.
            </p>

            <div className="inline-flex items-center gap-1 mb-3">
              <Timer className="w-4 h-4 text-accent" />
              <span className="text-xs uppercase tracking-widest font-body text-primary-foreground/50">
                Election Countdown — Powered by Ge'ez Watches
              </span>
            </div>

            <div className="flex items-center justify-center gap-4 md:gap-6">
              {[
                { value: timeLeft.days, label: "Days" },
                { value: timeLeft.hours, label: "Hours" },
                { value: timeLeft.minutes, label: "Min" },
                { value: timeLeft.seconds, label: "Sec" },
              ].map((unit) => (
                <div key={unit.label} className="text-center">
                  <div className="font-display text-3xl md:text-5xl font-bold tabular-nums text-primary-foreground">
                    {String(unit.value).padStart(2, "0")}
                  </div>
                  <div className="text-xs uppercase tracking-widest text-primary-foreground/40 font-body mt-1">
                    {unit.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section> */}
    </div>
  );
};

