import { motion } from "framer-motion";
import { MapPin, Users } from "lucide-react";

interface CommunityCardProps {
  name: string;
  delay?: number;
  description: String;
  flavorNotes: string[];
  rating: number;
}

const CoffeeRegionCard = ({ name, description, flavorNotes, rating, delay = 0 }: CommunityCardProps) => {
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
      className="ceramic-surface ceramic-surface-hover p-5 cursor-pointer group flex-col items-center justify-between"
    >
      <div className="flex justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-clay/10 flex items-center justify-center group-hover:bg-clay/20 transition-colors">
            <MapPin className="w-5 h-5 text-clay" />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg text-foreground leading-none">{name}</h3>
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mt-1">Ethiopia</p>
          </div>
        </div>

        <div className="flex items-center gap-1.5 bg-accent/10 text-accent px-2.5 py-1 rounded-lg">
          {rating}
        </div>
      </div>
      <div className="mt-4">
        <p className="text-sm">{description}</p>
        <p className="mt-4 text-sm">{flavorNotes}</p>
      </div>

    </motion.div>
  );
};

export default CoffeeRegionCard;
