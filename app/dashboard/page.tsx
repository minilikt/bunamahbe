"use client"
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Award, Vote, Coffee, MessageSquare, ArrowRight, MapPin, HelpCircle, LogOut } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import Image from "next/image";

export default function Page() {
  const router = useRouter();
  const { data: session, isPending: isLoading } = authClient.useSession();

  // Middleware now handles these redirections
  // useEffect(() => {
  //   if (!isLoading && !session) {
  //     router.push("/join");
  //   } else if (!isLoading && session && (!(session.user as any).city || !(session.user as any).favoriteType)) {
  //     router.push("/onboarding");
  //   }
  // }, [session, isLoading, router]);


  if (isLoading || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center ethiopian-pattern">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="text-4xl"
        >
          ☕
        </motion.div>
      </div>
    );
  }

  const member = session.user as any;

  return (
    <div className="min-h-screen pt-20 ethiopian-pattern">
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="max-w-4xl mx-auto">

          {/* Badge & Level Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="ceramic-surface p-8 md:p-10 mb-6 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.2 }}
              className="w-24 h-24 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-4 gold-ring relative overflow-hidden"
            >
              {/* {member.badgeEmoji ? ( */}
                {/* // <span className="text-5xl">{member.badgeEmoji}</span> */}
              {/* // ) : ( */}
                <Image 
                  src="/ethiopian-coffee-cup.png" 
                  width={100} 
                  height={100} 
                  alt="Badge" 
                  className="w-full h-full object-cover" 
                />
              {/* )} */}
            </motion.div>
            <h2 className="font-display text-sm uppercase tracking-widest text-muted-foreground mb-1">Your Coffee Badge</h2>
            <h1 className="font-display flex items-center justify-center gap-2 text-2xl md:text-3xl font-bold text-foreground mb-1" style={{ lineHeight: 1.1 }}>
              {member.badgeTitle}
            </h1>
            <p className="font-body text-sm text-muted-foreground">{member.name}'s Progress</p>
          </motion.div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            {[
              { label: "Badge Level", value: "Level 1" },
              { label: "Location", value: member.city },
              { label: "Fave Type", value: member.favoriteType },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + i * 0.08 }}
                className="ceramic-surface p-4 text-center"
              >
                <div className="font-display text-lg md:text-xl font-bold text-foreground truncate">{stat.value}</div>
                <div className="font-body text-xs text-muted-foreground mt-1">{stat.label}</div>
              </motion.div>
            ))}
          </div>

          {/* Election & Quiz Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Election */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="ceramic-surface p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-foreground">Election Participation</h3>
                <Link href="/election" className="text-xs font-body text-accent hover:underline">View Election</Link>
              </div>
              <div className="flex items-start gap-3">
                <Vote className="w-8 h-8 text-clay flex-shrink-0 mt-1" />
                <div>
                  <p className="font-body text-sm text-muted-foreground mb-3">
                    You haven't voted yet! Choose your President of the Buna Association.
                  </p>
                  <Link href="/election">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-mahber text-xs inline-flex items-center gap-1.5"
                    >
                      Cast Your Vote <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>

            {/* Quiz */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35 }}
              className="ceramic-surface p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-display font-bold text-foreground">Coffee Personality</h3>
                <Link href="/quiz" className="text-xs font-body text-accent hover:underline">Take Quiz</Link>
              </div>
              <div className="flex items-start gap-3">
                <span className="text-3xl flex-shrink-0">🎯</span>
                <div>
                  <p className="font-body text-sm text-muted-foreground mb-3">
                    Discover your coffee personality! 5 quick questions to reveal your true buna identity.
                  </p>
                  <Link href="/quiz">
                    <motion.button
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.98 }}
                      className="btn-clay text-xs inline-flex items-center gap-1.5"
                    >
                      Take the Quiz <ArrowRight className="w-3.5 h-3.5" />
                    </motion.button>
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="ceramic-surface p-6 mb-6"
          >
            <h3 className="font-display font-bold text-foreground mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { to: "/election", label: "Vote for President", icon: Vote },
                { to: "/quiz", label: "Coffee Personality Quiz", icon: Coffee },
                { to: "/community", label: "Community Feed", icon: MessageSquare },
                { to: "/map", label: "Explore Coffee Map", icon: MapPin },
              ].map((action) => (
                <Link key={action.to} href={action.to}>
                  <motion.div
                    whileHover={{ y: -2 }}
                    className="flex items-center gap-3 p-3 rounded-xl border border-input bg-background hover:border-accent/50 transition-all cursor-pointer group"
                  >
                    <action.icon className="w-4 h-4 text-clay" />
                    <span className="font-body text-sm text-foreground">{action.label}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                </Link>
              ))}
            </div>
          </motion.div>

          {/* Logout Action */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="flex justify-center mt-12 mb-8"
          >
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={async () => {
                await authClient.signOut({
                  fetchOptions: {
                    onSuccess: () => {
                      window.location.href = "/join";
                    },
                  },
                });
              }}
              className="flex items-center gap-2 px-6 py-3 rounded-xl border border-clay/20 bg-clay/5 text-clay hover:bg-clay hover:text-white transition-all font-display font-bold text-sm"
            >
              <LogOut className="w-4 h-4" />
              Sign Out from Mahber
            </motion.button>
          </motion.div>

          {/* Association tagline */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.55 }}
            className="text-center font-ethiopic text-lg text-muted-foreground"
          >
            ቡና ጠጪዎች ማህበር
          </motion.p>
        </div>
      </div>
    </div>
  );
};

