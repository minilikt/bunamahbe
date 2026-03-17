"use client"
import { motion } from "framer-motion";
import { Plus, Megaphone } from "lucide-react";

interface SponsorCardProps {
  delay?: number;
}

const SponsorCard = ({ delay = 0 }: SponsorCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-6 backdrop-blur-sm border border-dashed border-accent/30 rounded-[2rem] transition-all duration-300 bg-accent/5 hover:bg-accent/10 hover:border-accent shadow-sm flex flex-col items-center text-center justify-center min-h-[320px]"
    >
      <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-display font-bold rotate-6 bg-accent text-accent-foreground shadow-lg">
        Sponsor Spot
      </div>

      <div className="w-20 h-20 rounded-full border-2 border-dashed border-accent/30 flex items-center justify-center mb-6 bg-background group-hover:scale-110 transition-transform">
        <Plus className="w-8 h-8 text-accent/50" />
      </div>

      <h3 className="font-display font-bold text-xl mb-2 text-foreground">Your Product Here</h3>
      <p className="font-body text-sm text-muted-foreground mb-6 px-4">
        Support the Buna Election and showcase your brand to the community.
      </p>

      <motion.button
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        className="w-full py-3 rounded-full font-display font-bold text-sm bg-accent text-accent-foreground flex items-center justify-center gap-2 shadow-lg"
      >
        <Megaphone className="w-4 h-4" />
        Promote Now
      </motion.button>
    </motion.div>
  );
};

export default SponsorCard;
