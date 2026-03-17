"use client"
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Heart, MessageCircle, Share2, MoreVertical, Flame, ArrowRight, Loader2, Flag, MapPin, User, MoreHorizontal, Send, MessageSquare, Coffee } from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { getPosts, createPost, toggleLike as toggleLikeAction, addComment, reportPost } from "@/lib/actions/community";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const availableTags = ["☕ Coffee", "😂 Meme", "📸 Photo", "🏺 Ceremony", "💡 Tips", "🌍 Diaspora"];

interface Reply {
  id: string;
  user: string;
  content: string;
  time: string;
}

interface Post {
  id: string;
  user: string;
  location: string;
  content: string;
  likes: number;
  tags: string[];
  time: string;
  replies: Reply[];
  likedBy: string[];
}

const Community = () => {
  const { data: session } = authClient.useSession();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [newPostContent, setNewPostContent] = useState("");
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [expandedReplies, setExpandedReplies] = useState<Set<string>>(new Set());
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isPosting, setIsPosting] = useState(false);
  const [filterTag, setFilterTag] = useState<string | null>(null);
  
  const [reportDialogPostId, setReportDialogPostId] = useState<string | null>(null);
  const [reportReason, setReportReason] = useState("");
  const [isReporting, setIsReporting] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    const data = await getPosts(filterTag || undefined);
    setPosts(data as Post[]);
    setLoading(false);
  }, [filterTag]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const toggleLike = async (postId: string) => {
    if (!session) {
      toast.error("Please sign in to like posts");
      return;
    }

    const userId = session.user.id;

    // Optimistic update
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id === postId) {
          const isLiked = p.likedBy.includes(userId);
          return {
            ...p,
            likes: isLiked ? p.likes - 1 : p.likes + 1,
            likedBy: isLiked ? p.likedBy.filter(id => id !== userId) : [...p.likedBy, userId]
          };
        }
        return p;
      })
    );

    try {
      await toggleLikeAction(postId);
    } catch (error) {
      toast.error("Failed to toggle like");
      // Rollback (simplified)
      fetchPosts();
    }
  };

  const handlePost = async () => {
    if (!newPostContent.trim()) return;
    if (!session) {
      toast.error("Please sign in to post");
      return;
    }

    setIsPosting(true);
    try {
      const tags = selectedTags.length > 0 ? selectedTags : ["☕ Coffee"];
      await createPost(newPostContent, tags);
      setNewPostContent("");
      setSelectedTags([]);
      fetchPosts();
      toast.success("Post created!");
    } catch (error) {
      toast.error("Failed to create post");
    } finally {
      setIsPosting(false);
    }
  };

  const handleShare = async (postId: string) => {
    try {
      await navigator.clipboard.writeText(`${window.location.origin}/community?post=${postId}`);
      toast.success("Link copied to clipboard!");
    } catch (err) {
      toast.error("Failed to copy link");
    }
  };

  const submitReport = async () => {
    if (!reportDialogPostId || !session) return;
    
    setIsReporting(true);
    try {
      await reportPost(reportDialogPostId, reportReason);
      toast.success("Post reported successfully. Thank you for keeping our community safe.");
      setReportDialogPostId(null);
      setReportReason("");
    } catch (error) {
      toast.error("Failed to report post. Please try again later.");
    } finally {
      setIsReporting(false);
    }
  };

  const handleReply = async (postId: string) => {
    if (!replyContent.trim()) return;
    if (!session) {
      toast.error("Please sign in to reply");
      return;
    }

    try {
      await addComment(postId, replyContent);
      setReplyContent("");
      setReplyingTo(null);
      setExpandedReplies((prev) => new Set(prev).add(postId));
      fetchPosts();
      toast.success("Reply added!");
    } catch (error) {
      toast.error("Failed to add reply");
    }
  };

  const toggleTag = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
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

        {/* Post Composer */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="ceramic-surface p-6 max-w-2xl mx-auto mb-4"
        >
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center flex-shrink-0 mt-1">
              {session?.user.image ? (
                <img src={session.user.image} alt={session.user.name} className="w-full h-full rounded-full object-cover" />
              ) : (
                <User className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <textarea
                value={newPostContent}
                onChange={(e) => setNewPostContent(e.target.value)}
                placeholder={session ? "Share your coffee moment..." : "Sign in to share your coffee moment..."}
                rows={3}
                disabled={!session || isPosting}
                className="w-full rounded-xl border border-border bg-background px-4 py-3 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 resize-none disabled:opacity-50"
              />
              <div className="flex flex-wrap gap-2 mt-3">
                {availableTags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() => toggleTag(tag)}
                    disabled={!session || isPosting}
                    className={`text-xs px-3 py-1 rounded-full border transition-all font-body ${selectedTags.includes(tag)
                        ? "border-accent bg-accent/10 text-accent"
                        : "border-border text-muted-foreground hover:border-accent/30"
                      } disabled:opacity-50`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
              <div className="flex items-end justify-end mt-3">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={handlePost}
                  disabled={!newPostContent.trim() || !session || isPosting}
                  className="btn-mahber text-xs py-2 px-4 inline-flex items-center gap-1.5 disabled:opacity-40 disabled:pointer-events-none"
                >
                  {isPosting ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Send className="w-3.5 h-3.5" />} Post
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Tag Filter */}
        <div className="max-w-2xl mx-auto mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => setFilterTag(null)}
            className={`text-xs px-3 py-1 rounded-full border transition-all font-body ${!filterTag ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/30"
              }`}
          >
            All
          </button>
          {availableTags.map((tag) => (
            <button
              key={tag}
              onClick={() => setFilterTag(filterTag === tag ? null : tag)}
              className={`text-xs px-3 py-1 rounded-full border transition-all font-body ${filterTag === tag ? "border-accent bg-accent/10 text-accent" : "border-border text-muted-foreground hover:border-accent/30"
                }`}
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="max-w-2xl mx-auto space-y-6">
          {loading ? (
            <div className="flex flex-col items-center py-12 gap-3">
              <Loader2 className="w-8 h-8 animate-spin text-accent" />
              <p className="text-sm text-muted-foreground font-body">Brewing the feed...</p>
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground font-body">No posts yet. Be the first to share a moment!</p>
            </div>
          ) : (
            posts.map((post, i) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="ceramic-surface p-6"
              >
                <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10 border-2 border-primary/20">
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {post.user.substring(0, 2).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-heading font-bold text-base leading-tight">
                            {post.user}
                          </p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <span>{post.time}</span>
                            <span>•</span>
                            <span>{post.location}</span>
                          </p>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-foreground">
                            <MoreVertical className="h-5 w-5" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 font-body">
                          <DropdownMenuItem onClick={() => handleShare(post.id)} className="cursor-pointer font-medium hover:bg-primary/10">
                            <Share2 className="h-4 w-4 mr-2 text-primary" />
                            Share
                          </DropdownMenuItem>
                          {session && session.user.id !== post.user && (
                            <DropdownMenuItem 
                              onClick={() => setReportDialogPostId(post.id)} 
                              className="cursor-pointer text-destructive focus:text-destructive font-medium hover:bg-destructive/10"
                            >
                              <Flag className="h-4 w-4 mr-2" />
                              Report
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>

                <p className="font-body text-foreground leading-relaxed mb-3 whitespace-pre-wrap">{post.content}</p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 mb-3">
                  {post.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-accent/10 text-accent font-body">
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4 pt-2 border-t border-border">
                  <motion.button
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-sm font-body transition-colors ${session && post.likedBy.includes(session.user.id) ? "text-clay" : "text-muted-foreground hover:text-clay"
                      }`}
                  >
                    <Heart className={`w-4 h-4 ${session && post.likedBy.includes(session.user.id) ? "fill-clay" : ""}`} />
                    {post.likes}
                  </motion.button>
                  <button
                    onClick={() => {
                      setReplyingTo(replyingTo === post.id ? null : post.id);
                      setExpandedReplies((prev) => new Set(prev).add(post.id));
                    }}
                    className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {post.replies.length > 0 ? post.replies.length : "Reply"}
                  </button>
                  <button className="flex items-center gap-1.5 text-sm font-body text-muted-foreground hover:text-foreground transition-colors ml-auto">
                    <Share2 className="w-4 h-4" />
                  </button>
                </div>

                {/* Replies */}
                {expandedReplies.has(post.id) && post.replies.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pl-6 border-l-2 border-border space-y-3"
                  >
                    {post.replies.map((reply) => (
                      <div key={reply.id} className="flex items-start gap-2">
                        <div className="w-7 h-7 rounded-full bg-secondary flex items-center justify-center flex-shrink-0">
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-display font-bold text-xs text-foreground">{reply.user}</span>
                            <span className="text-xs text-muted-foreground font-body">{reply.time}</span>
                          </div>
                          <p className="font-body text-sm text-foreground">{reply.content}</p>
                        </div>
                      </div>
                    ))}
                  </motion.div>
                )}

                {/* Reply input */}
                {replyingTo === post.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 flex items-center gap-2"
                  >
                    <input
                      type="text"
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder={session ? "Write a reply..." : "Sign in to reply..."}
                      disabled={!session}
                      onKeyDown={(e) => e.key === "Enter" && handleReply(post.id)}
                      className="flex-1 h-9 rounded-full border border-border bg-background px-4 text-sm font-body placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50"
                    />
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleReply(post.id)}
                      disabled={!replyContent.trim() || !session}
                      className="p-2 rounded-full bg-clay text-white disabled:opacity-40"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </motion.button>
                  </motion.div>
                )}
              </motion.div>
            ))
          )}

          {/* Load More */}
          {!loading && posts.length > 0 && (
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
          )}
        </div>

        {/* Ad Placeholder */}
        <div className="max-w-2xl mx-auto mt-12 border border-dashed border-border rounded-2xl p-8 text-center bg-secondary/30">
          <p className="font-body text-sm text-muted-foreground">📢 You can advertise here</p>
          <p className="font-body text-xs text-muted-foreground/60 mt-1">Reach the Ethiopian coffee community</p>
        </div>
      </div>

      {/* Report Dialog */}
      <Dialog open={!!reportDialogPostId} onOpenChange={(open) => !open && setReportDialogPostId(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="font-heading text-xl">Report Post</DialogTitle>
            <DialogDescription className="font-body text-muted-foreground">
              Please let us know why you are reporting this post. Our team will review it.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea 
              placeholder="Reason for reporting (e.g., spam, inappropriate content)..." 
              className="resize-none font-body"
              rows={4}
              value={reportReason}
              onChange={(e) => setReportReason(e.target.value)}
            />
          </div>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setReportDialogPostId(null)}
              className="font-heading"
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive"
              onClick={submitReport}
              disabled={isReporting || !reportReason.trim()}
              className="font-heading px-6"
            >
              {isReporting ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Flag className="h-4 w-4 mr-2" />}
              Submit Report
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Community;
