"use client"
import { motion, AnimatePresence } from "framer-motion";
import { User, Vote, Play, X, ExternalLink } from "lucide-react";
import { useState } from "react";

interface CandidateCardProps {
  id: string;
  name: string;
  handle: string;
  image: string;
  statement: string;
  voteCount: number;
  tiktokVideoId?: string;
  delay?: number;
  onVote?: () => void;
  isCurrentVote?: boolean;
}

const CandidateCard = ({ id, name, image, handle, statement, voteCount, tiktokVideoId, delay = 0, onVote, isCurrentVote }: CandidateCardProps) => {
  const [showSteam, setShowSteam] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);

  const handleVote = () => {
    if (isCurrentVote) return;
    setShowSteam(true);
    onVote?.();
    setTimeout(() => setShowSteam(false), 2000);
  };

  const tiktokHandle = handle.startsWith("@") ? handle : `@${handle}`;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay }}
        className={`group relative p-6 backdrop-blur-sm border rounded-[2rem] transition-all duration-300 ${
          isCurrentVote 
            ? "bg-accent/10 border-accent shadow-[0_0_20px_rgba(var(--accent-rgb),0.1)]" 
            : "bg-card/50 border-border hover:border-accent/50"
        }`}
      >
        <div className={`absolute -top-3 -right-3 px-3 py-1 rounded-full text-xs font-display font-bold rotate-6 transition-colors ${
          isCurrentVote ? "bg-accent text-accent-foreground" : "bg-primary text-primary-foreground"
        }`}>
          {isCurrentVote ? "Your Choice" : "Candidate"}
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
            className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 overflow-hidden transition-transform relative ${
              isCurrentVote ? "ring-2 ring-accent ring-offset-2 ring-offset-background" : "gold-ring"
            }`}
          >
            <img 
              src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`} 
              alt={name} 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
              }}
            />
          </div>

          {/* Handle */}
          <a 
            href={`https://www.tiktok.com/${tiktokHandle}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-sm font-body text-accent font-medium mb-1 hover:underline cursor-pointer"
          >
            {tiktokHandle}
          </a>

          {/* Name */}
          <h3 className="font-display font-bold text-lg mb-3 text-foreground">{name}</h3>

          {/* Watch Campaign Video CTA */}
          {tiktokVideoId && (
            <motion.button
              whileHover={{ scale: 1.03, y: -1 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setVideoLoaded(false); setIsPopupOpen(true); }}
              className="w-full mb-4 py-2.5 rounded-full border border-border/60 bg-background/60 hover:bg-accent/10 hover:border-accent/50 transition-all flex items-center justify-center gap-2 font-body text-sm text-muted-foreground hover:text-accent"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              Watch Campaign Video
            </motion.button>
          )}

          {/* Vote count */}
          <div className="text-xs font-body text-muted-foreground mb-4">
            <span className="font-display font-bold text-foreground text-lg tabular-nums">{voteCount}</span> votes
          </div>

          {/* Vote button */}
          <motion.button
            whileHover={!isCurrentVote ? { y: -2 } : {}}
            whileTap={!isCurrentVote ? { scale: 0.98 } : {}}
            onClick={handleVote}
            disabled={isCurrentVote}
            className={`w-full py-3 rounded-full font-display font-bold text-sm transition-all flex items-center justify-center gap-2 ${
              isCurrentVote
                ? "bg-accent text-accent-foreground cursor-default"
                : "btn-clay"
            }`}
          >
            <Vote className="w-4 h-4" />
            {isCurrentVote ? "Voted ☕" : "Brew Your Vote"}
          </motion.button>
        </div>
      </motion.div>

      {/* TikTok Video Modal */}
      <AnimatePresence>
        {isPopupOpen && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ backgroundColor: "rgba(0,0,0,0.75)", backdropFilter: "blur(6px)" }}
            onClick={() => setIsPopupOpen(false)}
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="relative w-full max-w-xs rounded-[2rem] overflow-hidden shadow-2xl"
              style={{ background: "var(--card)" }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center gap-3 p-4 border-b border-border/30">
                <img
                  src={image || `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`}
                  alt={name}
                  className="w-10 h-10 rounded-full object-cover gold-ring flex-shrink-0"
                  onError={(e) => {
                    e.currentTarget.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
                  }}
                />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-bold text-sm text-foreground truncate">{name}</p>
                  <a
                    href={`https://www.tiktok.com/${tiktokHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-body text-accent hover:underline flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {tiktokHandle}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                <button
                  onClick={() => setIsPopupOpen(false)}
                  className="w-8 h-8 rounded-full bg-secondary/60 hover:bg-secondary flex items-center justify-center transition-colors flex-shrink-0"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Video */}
              <div className="relative bg-black" style={{ height: "560px", maxHeight: "60vh" }}>
                {/* Loading skeleton */}
                {!videoLoaded && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black">
                    <div className="w-10 h-10 rounded-full border-2 border-accent/30 border-t-accent animate-spin" />
                    <p className="text-xs font-body text-white/40">Loading campaign video…</p>
                  </div>
                )}
                {tiktokVideoId && (
                  <iframe
                    src={`https://www.tiktok.com/embed/${tiktokVideoId}`}
                    style={{ width: "100%", height: "100%", border: "none", display: "block" }}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    allowFullScreen
                    onLoad={() => setVideoLoaded(true)}
                  />
                )}
              </div>

              {/* Footer — quick vote */}
              <div className="p-4 border-t border-border/30 flex items-center justify-between gap-3">
                <div className="text-xs font-body text-muted-foreground">
                  <span className="font-display font-bold text-foreground text-base tabular-nums">{voteCount}</span> votes
                </div>
                <motion.button
                  whileHover={!isCurrentVote ? { y: -1 } : {}}
                  whileTap={!isCurrentVote ? { scale: 0.97 } : {}}
                  onClick={() => { handleVote(); setIsPopupOpen(false); }}
                  disabled={isCurrentVote}
                  className={`flex-1 py-2.5 rounded-full font-display font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                    isCurrentVote
                      ? "bg-accent text-accent-foreground cursor-default"
                      : "btn-clay"
                  }`}
                >
                  <Vote className="w-4 h-4" />
                  {isCurrentVote ? "Voted ☕" : "Brew Your Vote"}
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CandidateCard;
