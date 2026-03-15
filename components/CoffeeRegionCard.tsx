import { motion } from "framer-motion";
import { MapPin, Star } from "lucide-react";

interface CoffeeRegionCardProps {
  name: string;
  description: string;
  flavorNotes: string[];
  rating: number;
  delay?: number;
}

const CoffeeRegionCard = ({ name, description, flavorNotes, rating, delay = 0 }: CoffeeRegionCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4 }}
      className="ceramic-surface ceramic-surface-hover p-6 cursor-pointer group"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-clay/10 flex items-center justify-center">
          <MapPin className="w-5 h-5 text-clay" />
        </div>
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-accent fill-accent" />
          <span className="text-sm font-display font-bold">{rating}</span>
        </div>
      </div>
      <h3 className="font-display font-bold text-xl mb-2 text-foreground leading-tight">{name}</h3>
      <p className="font-body text-sm text-muted-foreground mb-4 leading-relaxed">{description}</p>
      <div className="flex flex-wrap gap-2">
        {flavorNotes.map((note) => (
          <span key={note} className="text-xs font-body px-3 py-1 rounded-full bg-accent/10 text-accent font-medium">
            {note}
          </span>
        ))}
      </div>
    </motion.div>
  );
};

export default CoffeeRegionCard;
