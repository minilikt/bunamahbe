"use client";

import React, { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { updateCandidate } from "@/app/actions/admin";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

interface CandidateEditDialogProps {
  candidate: {
    id: string;
    name: string;
    username: string | null;
    role: string;
    bio: string;
    image: string | null;
    tiktokVideoId: string | null;
  };
}

export function CandidateEditDialog({ candidate }: CandidateEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      await updateCandidate(candidate.id, formData);
      toast.success("Candidate updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update candidate");
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Button 
        variant="ghost" 
        size="icon" 
        className="h-8 w-8 hover:bg-muted/30" 
        onClick={() => setOpen(true)}
      >
        <Pencil className="h-4 w-4" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-[525px] bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display">Edit Candidate Profile</DialogTitle>
            <DialogDescription className="font-body">
              Make changes to the candidate's information here.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Name</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={candidate.name} 
                className="bg-background/50 border-border/30" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-medium">Username</Label>
              <Input 
                id="username" 
                name="username" 
                defaultValue={candidate.username || ""} 
                className="bg-background/50 border-border/30" 
                placeholder="Username (optional)"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">Role</Label>
              <Input 
                id="role" 
                name="role" 
                defaultValue={candidate.role} 
                className="bg-background/50 border-border/30" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium">Image URL</Label>
              <Input 
                id="image" 
                name="image" 
                defaultValue={candidate.image || ""} 
                className="bg-background/50 border-border/30" 
                placeholder="https://..." 
                required
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="tiktokVideoId" className="text-sm font-medium">TikTok Video ID</Label>
              <Input 
                id="tiktokVideoId" 
                name="tiktokVideoId" 
                defaultValue={candidate.tiktokVideoId || ""} 
                className="bg-background/50 border-border/30" 
                placeholder="Video ID (optional)"
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="bio" className="text-sm font-medium">Biography</Label>
              <Textarea 
                id="bio" 
                name="bio" 
                defaultValue={candidate.bio} 
                className="bg-background/50 border-border/30 h-32" 
                required 
              />
            </div>
            <div className="md:col-span-2 flex justify-end gap-2 pt-4">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
