"use client"
import { motion } from "framer-motion";
import { User, Vote, Watch } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface CandidateCardProps {
  name: string;
  handle: string;
  image: string;
  statement: string;
  voteCount: number;
  tiktokVideoId?: string;
  delay?: number;
  onVote?: () => void;
  hasVoted?: boolean;
}

const CandidateCard = ({ name, image, handle, statement, voteCount, tiktokVideoId, delay = 0, onVote, hasVoted }: CandidateCardProps) => {
  const [showSteam, setShowSteam] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);

  const handleVote = () => {
    setShowSteam(true);
    onVote?.();
    setTimeout(() => setShowSteam(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="group relative p-6 bg-card/50 backdrop-blur-sm border border-border rounded-[2rem] hover:border-accent/50 transition-colors"
    >
      <div className="absolute -top-3 -right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-display font-bold rotate-6">
        Candidate
      </div>

      {/* Steam particles */}
      {showSteam && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 pointer-events-none">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-accent/40 animate-steam"
              style={{
                left: `${(i - 2) * 12}px`,
                animationDelay: `${i * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}

      <div className="flex flex-col items-center text-center">
        {/* Avatar */}
        <div 
          onClick={() => tiktokVideoId && setIsPopupOpen(true)}
          className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-4 gold-ring overflow-hidden hover:scale-105 transition-transform cursor-pointer relative"
        >
          <img 
            src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`} 
            alt={name} 
            className="w-full h-full object-cover" 
            onError={(e) => {
              e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
            }}
          />
          {tiktokVideoId && (
            <div className="absolute inset-0 bg-black/20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              <Watch className="w-8 h-8 text-white" />
            </div>
          )}
        </div>

        {/* Handle */}
        <a 
          href={`https://www.tiktok.com/${handle.startsWith("@") ? handle : `@${handle}`}`} 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-sm font-body text-accent font-medium mb-1 hover:underline cursor-pointer"
        >
          {handle}
        </a>

        {/* Name */}
        <h3 className="font-display font-bold text-lg mb-3 text-foreground">{name}</h3>

        {/* Statement */}
        <p className="font-body text-sm text-muted-foreground italic leading-relaxed mb-4 min-h-[3.5rem]">
          "{statement}"
        </p>

        {/* Vote count */}
        <div className="text-xs font-body text-muted-foreground mb-4">
          <span className="font-display font-bold text-foreground text-lg tabular-nums">{voteCount}</span> votes
        </div>

        {/* Vote button */}
        <motion.button
          whileHover={{ y: -2 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleVote}
          disabled={hasVoted}
          className={`w-full py-3 rounded-full font-display font-bold text-sm transition-all flex items-center justify-center gap-2 ${
            hasVoted
              ? "bg-secondary text-muted-foreground cursor-not-allowed"
              : "btn-clay"
          }`}
        >
          <Vote className="w-4 h-4" />
          {hasVoted ? "Vote Cast ☕" : "Brew Your Vote"}
        </motion.button>
      </div>

      <Dialog open={isPopupOpen} onOpenChange={setIsPopupOpen}>
        <DialogContent className="sm:max-w-[425px] p-0 bg-black border-none overflow-hidden h-[80vh] sm:h-auto">
          <DialogHeader className="hidden">
            <DialogTitle>{name}'s TikTok</DialogTitle>
          </DialogHeader>
          {tiktokVideoId && (
            <div className="w-full aspect-[9/16] max-h-[70vh] rounded-2xl overflow-hidden shadow-2xl relative bg-black">
              <iframe
                src={`https://www.tiktok.com/embed/${tiktokVideoId}`}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};

export default CandidateCard;
