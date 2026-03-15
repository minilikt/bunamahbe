"use client"
import { motion } from "framer-motion";
import { MessageSquare, Heart, User, MapPin, Camera, Coffee } from "lucide-react";
import { useState } from "react";

const mockPosts = [
  {
    id: "1",
    user: "Abebe K.",
    location: "Addis Ababa",
    content: "Morning buna with the family. Three rounds deep. Life is good. ☕🇪🇹",
    likes: 47,
    type: "text",
  },
  {
    id: "2",
    user: "Sara T.",
    location: "Washington, DC",
    content: "Found the best Ethiopian café in DC! The macchiato here reminds me of home 🥹",
    likes: 89,
    type: "cafe",
  },
  {
    id: "3",
    user: "Dawit M.",
    location: "Jimma",
    content: "Coffee harvest season begins! Nothing beats fresh beans straight from the farm 🫘",
    likes: 124,
    type: "text",
  },
  {
    id: "4",
    user: "Helen B.",
    location: "London",
    content: "My grandmother's jebena setup. She says the secret is patience and love ❤️",
    likes: 203,
    type: "photo",
  },
  {
    id: "5",
    user: "Yonas A.",
    location: "Toronto",
    content: "POV: You're Ethiopian and someone says they don't like coffee 😤☕",
    likes: 312,
    type: "meme",
  },
];

export default function Page() {
  const [likedPosts, setLikedPosts] = useState<Set<string>>(new Set());

  const toggleLike = (id: string) => {
    setLikedPosts((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen pt-20 ethiopian-pattern">
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center mb-12">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 text-accent font-body text-sm font-medium mb-6">
              <MessageSquare className="w-4 h-4" />
              Community Feed
            </div>
            <h1 className="font-display text-3xl md:text-5xl font-bold text-foreground mb-4 tracking-tightest" style={{ lineHeight: 0.95 }}>
              The Buna Feed
            </h1>
            <p className="font-body text-lg text-muted-foreground max-w-md mx-auto">
              Coffee stories, memes, and moments from the community.
            </p>
          </motion.div>
        </div>

        {/* Post composer placeholder */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="ceramic-surface p-6 max-w-2xl mx-auto mb-8"
        >
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
              <User className="w-5 h-5 text-muted-foreground" />
            </div>
            <div className="flex-1 px-4 py-3 rounded-2xl bg-background border border-border text-sm font-body text-muted-foreground cursor-pointer hover:border-accent/30 transition-colors">
              Share your coffee moment...
            </div>
            <button className="p-2 rounded-xl bg-clay/10 text-clay hover:bg-clay/20 transition-colors">
              <Camera className="w-5 h-5" />
            </button>
          </div>
        </motion.div>

        {/* Posts */}
        <div className="max-w-2xl mx-auto space-y-6">
          {mockPosts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="ceramic-surface p-6"
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                  <User className="w-5 h-5 text-muted-foreground" />
                </div>
                <div>
                  <h4 className="font-display font-bold text-sm text-foreground">{post.user}</h4>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground font-body">
                    <MapPin className="w-3 h-3" />
                    {post.location}
                  </div>
                </div>
                <div className="ml-auto">
                  <span className="text-xs px-2 py-1 rounded-full bg-accent/10 text-accent font-body">
                    {post.type === "meme" ? "😂 Meme" : post.type === "cafe" ? "☕ Café" : post.type === "photo" ? "📸 Photo" : "💬 Post"}
                  </span>
                </div>
              </div>
              <p className="font-body text-foreground leading-relaxed mb-4">{post.content}</p>
              <div className="flex items-center gap-4">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => toggleLike(post.id)}
                  className={`flex items-center gap-1.5 text-sm font-body transition-colors ${
                    likedPosts.has(post.id) ? "text-clay" : "text-muted-foreground hover:text-clay"
                  }`}
                >
                  <Heart className={`w-4 h-4 ${likedPosts.has(post.id) ? "fill-clay" : ""}`} />
                  {post.likes + (likedPosts.has(post.id) ? 1 : 0)}
                </motion.button>
                <button className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors">
                  <MessageSquare className="w-4 h-4" />
                  Reply
                </button>
              </div>
            </motion.div>
          ))}

          {/* Load More */}
          <div className="text-center pt-4">
            <motion.button
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.98 }}
              className="px-6 py-3 rounded-full border border-border bg-card text-foreground font-display font-bold text-sm hover:border-accent/30 transition-all inline-flex items-center gap-2"
            >
              <Coffee className="w-4 h-4" />
              Load More
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

