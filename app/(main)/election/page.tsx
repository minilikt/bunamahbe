"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Timer, Award, Watch, Search, Filter } from "lucide-react";
import CandidateCard from "@/components/CandidateCard";
import { castVote, getCandidates, getUserVote } from "@/app/actions/election";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { redirect } from "next/navigation";
import SponsorCard from "@/components/SponsorCard";
import SponsorCTA from "@/components/SponsorCTA";

export default function Election() {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [votedFor, setVotedFor] = useState<string | null>(null);
  const [isCasting, setIsCasting] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [showAll, setShowAll] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"alpha" | "votes">("alpha");
  const { data: session } = authClient.useSession();

  const INITIAL_COUNT = 8;

  const filteredCandidates = candidates.filter(c =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (c.username && c.username.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.bio && c.bio.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const displayCandidates = sortBy === "alpha"
    ? [...filteredCandidates].sort((a, b) => a.name.localeCompare(b.name))
    : [...filteredCandidates].sort((a, b) => b.voteCount - a.voteCount);

  const visibleCandidates = showAll ? displayCandidates : displayCandidates.slice(0, INITIAL_COUNT);
  const hiddenCount = Math.max(0, displayCandidates.length - INITIAL_COUNT);

  useEffect(() => {
    // Fetch real candidates and user's vote
    const loadData = async () => {
      const [candidatesData, userVote] = await Promise.all([
        getCandidates(),
        getUserVote()
      ]);
      setCandidates(candidatesData);
      setVotedFor(userVote);
    };
    loadData();
  }, [session]);

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
      toast("Only registered members can vote! redirecting you now...");
      redirect("/join");
      return;
    }

    if (id === votedFor) {
      toast("You've already cast your vote for this candidate!");
      return;
    }

    setIsCasting(true);
    const result = await castVote(id);
    setIsCasting(false);

    if (result.success) {
      setVotedFor(id);
      toast(votedFor ? "Your vote has been updated!" : "Your vote has been cast!");
      // Refresh candidates list to show updated score
      const updated = await getCandidates();
      setCandidates(updated);
    } else {
      toast(result.error);
    }
  };

  const totalVotes = candidates.reduce((sum, c) => sum + c.voteCount, 0);
  const sortedForChart = [...candidates].sort((a, b) => b.voteCount - a.voteCount).slice(0, 8);
  const maxVotes = Math.max(...candidates.map(c => c.voteCount), 1);

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

          {/* Search & Filter */}
          <div className="max-w-xl mx-auto mb-10 flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search candidates by name, handle, or bio..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-input bg-background/50 focus:bg-background focus:ring-2 focus:ring-primary/20 transition-all font-body text-sm outline-none"
              />
            </div>
            <div className="relative min-w-[160px] ">

              <DropdownMenu >
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full justify-between">
                    {sortBy === "alpha" ? "Alphabetical" : "Most Votes"}
                    <svg
                      className="ml-2 h-4 w-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-full">
                  <DropdownMenuItem onClick={() => setSortBy("alpha")}>Alphabetical</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("votes")}>Most Votes</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {visibleCandidates.map((candidate, i) => (
              <CandidateCard
                key={candidate.id}
                id={candidate.id}
                name={candidate.name}
                image={candidate.image}
                handle={candidate.username || "anonymous"}
                statement={candidate.bio}
                voteCount={candidate.voteCount}
                tiktokVideoId={candidate.tiktokVideoId}
                delay={i * 0.05}
                isCurrentVote={votedFor === candidate.id}
                onVote={() => handleVote(candidate.id)}
              />
            ))}
            {/* Sponsor Spot */}
            <SponsorCard delay={displayCandidates.length * 0.05} />
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
            <div className="space-y-6">
              {sortedForChart.map((candidate, i) => {
                const percentage = totalVotes > 0 ? (candidate.voteCount / totalVotes) * 100 : 0;
                const isLeader = i === 0 && candidate.voteCount > 0;
                const isRunnerUp = i === 1 && candidate.voteCount > 0;

                return (
                  <motion.div
                    key={candidate.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.05 }}
                    className="group"
                  >
                    <div className="flex items-center justify-between mb-2">
                       <span className="font-display font-medium text-sm text-foreground flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                          isLeader ? "bg-clay text-white" : isRunnerUp ? "bg-accent text-white" : "bg-muted text-muted-foreground"
                        }`}>
                          {i + 1}
                        </span>
                        {candidate.name}
                      </span>
                      <span className="font-display text-xs text-muted-foreground tabular-nums">
                         {candidate.voteCount.toLocaleString()} votes ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                    <div className="relative h-3 bg-secondary/50 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${(candidate.voteCount / maxVotes) * 100}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 1, delay: i * 0.1, type: "spring", stiffness: 50 }}
                        className={`absolute inset-y-0 left-0 rounded-full transition-colors ${
                          isLeader
                            ? "bg-gradient-to-r from-clay to-clay/80 shadow-[0_0_12px_rgba(202,138,4,0.3)]"
                            : isRunnerUp
                              ? "bg-gradient-to-r from-accent to-accent/80"
                              : "bg-primary/40"
                        }`}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Sponsorship CTA */}
      <SponsorCTA />

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

