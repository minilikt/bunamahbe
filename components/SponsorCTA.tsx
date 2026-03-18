"use client"
import { motion } from "framer-motion";
import { Megaphone, ArrowRight, Zap, Target, Users } from "lucide-react";
import Link from "next/link";

const SponsorCTA = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 ethiopian-pattern opacity-50" />
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-accent/30 to-transparent" />

      <div className="container mx-auto px-4 md:px-8 relative">
        <div className="ceramic-surface p-8 md:p-16 max-w-5xl mx-auto border-accent/20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 text-accent font-display text-xs font-bold mb-6">
                <Megaphone className="w-3.5 h-3.5" />
                ADVERTISING OPPORTUNITY
              </div>

              <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-6 leading-tight">
                Support the Election, <br />
                <span className="text-accent">Grow Your Brand</span>
              </h2>

              <p className="font-body text-lg text-muted-foreground mb-8">
                Reach thousands of daily active members in the Buna community. Promote your products where the conversation happens.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                    <Target className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm mb-1">Targeted Reach</h4>
                    <p className="text-xs text-muted-foreground">Direct access to coffee lovers and industry professionals.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className="w-10 h-10 rounded-xl bg-clay/10 flex items-center justify-center flex-shrink-0">
                    <Zap className="w-5 h-5 text-clay" />
                  </div>
                  <div>
                    <h4 className="font-display font-bold text-sm mb-1">High Engagement</h4>
                    <p className="text-xs text-muted-foreground">Over 50,000+ interactions during the election period.</p>
                  </div>
                </div>
              </div>
              <Link href="https://t.me/Pulsejar">
                <motion.button
                  whileHover={{ x: 5 }}
                  className="group inline-flex items-center gap-2 px-8 py-4 bg-accent text-accent-foreground rounded-full font-display font-bold text-lg shadow-xl shadow-accent/20 transition-all"
                >
                  Become a Sponsor
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </motion.button>
              </Link>
            </div>

            <div className="relative">
              <div className="aspect-square rounded-[3rem] overflow-hidden bg-gradient-to-br from-accent/20 to-clay/20 border border-accent/30 flex items-center justify-center p-8">
                <div className="relative w-full aspect-video ceramic-surface border-accent/40 shadow-2xl flex flex-col items-center justify-center p-6 text-center transform -rotate-3 hover:rotate-0 transition-transform duration-500">
                  <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center mb-4">
                    <Users className="w-8 h-8 text-accent" />
                  </div>
                  <h3 className="font-display font-bold text-xl mb-2 text-foreground">Your Product Ad</h3>
                  <div className="w-full h-2 bg-accent/20 rounded-full mb-2" />
                  <div className="w-2/3 h-2 bg-accent/10 rounded-full" />
                </div>

                {/* Floating elements */}
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-10 right-10 w-24 h-24 ceramic-surface border-clay/30 rotate-12 flex items-center justify-center text-clay font-display font-bold text-2xl"
                >
                  BUNA
                </motion.div>
                <motion.div
                  animate={{ y: [0, 10, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-10 left-10 w-20 h-20 ceramic-surface border-accent/30 -rotate-6 flex items-center justify-center text-accent font-display font-bold"
                >
                  SALE
                </motion.div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SponsorCTA;
