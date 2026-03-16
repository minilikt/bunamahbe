import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";

interface CommunityCardProps {
  name: string;
  count: number;
  delay?: number;
}

const CoffeeRegionCard = ({ name, count, delay = 0 }: CommunityCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ 
        type: "spring",
        stiffness: 300,
        damping: 20,
        delay 
      }}
      whileHover={{ y: -4, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="ceramic-surface ceramic-surface-hover p-5 cursor-pointer group flex items-center justify-between"
    >
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-clay/10 flex items-center justify-center group-hover:bg-clay/20 transition-colors">
          <MapPin className="w-5 h-5 text-clay" />
        </div>
        <div>
          <h3 className="font-display font-bold text-lg text-foreground leading-none">{name}</h3>
          <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-1">Ethiopia</p>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-2.5 py-1 rounded-lg">
          <Users className="w-3 h-3" />
          <span className="text-xs font-display font-bold">{count}</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CoffeeRegionCard;
