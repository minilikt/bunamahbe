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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { updateUser } from "@/app/actions/admin";
import { Pencil } from "lucide-react";
import { toast } from "sonner";

interface UserEditDialogProps {
  user: {
    id: string;
    name: string | null;
    email: string;
    image: string | null;
    role: string;
  };
}

export function UserEditDialog({ user }: UserEditDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(event.currentTarget);
    try {
      await updateUser(user.id, formData);
      toast.success("User updated successfully");
      setOpen(false);
    } catch (error) {
      toast.error("Failed to update user");
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
        <DialogContent className="sm:max-w-[425px] bg-card border-border/50">
          <DialogHeader>
            <DialogTitle className="font-display">Edit User Profile</DialogTitle>
            <DialogDescription className="font-body">
              Make changes to the user's profile here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-medium">Name</Label>
              <Input 
                id="name" 
                name="name" 
                defaultValue={user.name || ""} 
                className="bg-background/50 border-border/30" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium">Email</Label>
              <Input 
                id="email" 
                name="email" 
                type="email" 
                defaultValue={user.email} 
                className="bg-background/50 border-border/30" 
                required 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="image" className="text-sm font-medium">Image URL</Label>
              <Input 
                id="image" 
                name="image" 
                defaultValue={user.image || ""} 
                className="bg-background/50 border-border/30" 
                placeholder="https://..." 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role" className="text-sm font-medium">Role</Label>
              <Select name="role" defaultValue={user.role}>
                <SelectTrigger className="bg-background/50 border-border/30">
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent className="bg-card border-border/50">
                  <SelectItem value="USER">User</SelectItem>
                  <SelectItem value="STAFF">Staff</SelectItem>
                  <SelectItem value="ADMIN">Admin</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter className="pt-4">
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
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
