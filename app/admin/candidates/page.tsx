import React from "react";
import prisma from "@/lib/prisma";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  User as UserIcon,
} from "lucide-react";
import { addCandidate, deleteCandidate } from "@/app/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

export default async function CandidateManagement() {
  const candidates = await prisma.candidate.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Candidate Management</h1>
          <p className="text-muted-foreground font-body">Manage the candidates for the upcoming election.</p>
        </div>
      </div>

      <Card className="border-border/50 shadow-sm bg-card/40 backdrop-blur-sm">
        <CardHeader className="p-4 md:p-6 bg-muted/30 border-b border-border/50">
          <CardTitle className="text-lg font-display">Quick Add Candidate</CardTitle>
          <CardDescription className="font-body">Fill in the details to add a new candidate to the ballot.</CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <form action={addCandidate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium font-body">Name</label>
              <Input name="name" placeholder="Candidate Name" required className="bg-background/50 border-border/30" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium font-body">Username</label>
              <Input name="username" placeholder="Username (optional)" className="bg-background/50 border-border/30" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium font-body">Role</label>
              <Input name="role" placeholder="e.g. Regional Manager" required className="bg-background/50 border-border/30" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium font-body">Image URL</label>
              <Input name="image" placeholder="https://..." required className="bg-background/50 border-border/30" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium font-body">TikTok ID</label>
              <Input name="tiktokVideoId" placeholder="Video ID (optional)" className="bg-background/50 border-border/30" />
            </div>
            <div className="space-y-2 md:col-span-2 lg:col-span-3">
              <label className="text-sm font-medium font-body">Biography</label>
              <Textarea name="bio" placeholder="Short biography..." required className="bg-background/50 border-border/30 h-24" />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex justify-end pt-2">
              <Button type="submit" className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 px-8 font-display">
                Save Candidate
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <Card className="overflow-hidden border-border/50 shadow-sm bg-card/40 backdrop-blur-sm">
        <CardHeader className="p-4 md:p-6 bg-muted/30 border-b border-border/50">
          <CardTitle className="text-lg font-display">Candidate List</CardTitle>
          <CardDescription className="font-body">All active candidates currently on the ballot.</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20">
                  <th className="p-4 font-semibold text-sm font-display">Candidate</th>
                  <th className="p-4 font-semibold text-sm hidden md:table-cell text-muted-foreground font-display">Role</th>
                  <th className="p-4 font-semibold text-sm hidden lg:table-cell text-muted-foreground font-display">Bio Preview</th>
                  <th className="p-4 font-semibold text-sm text-center text-muted-foreground font-display">Votes</th>
                  <th className="p-4 font-semibold text-sm text-right text-muted-foreground font-display">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {candidates.map((candidate) => (
                  <tr key={candidate.id} className="hover:bg-muted/10 transition-colors group">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-border/30">
                          <AvatarImage src={candidate.image!} alt={candidate.name!} />
                          <AvatarFallback className="bg-muted text-xs">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm line-clamp-1">{candidate.name}</span>
                          <span className="text-xs text-muted-foreground line-clamp-1">@{candidate.username || "no-username"}</span>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-muted-foreground">
                      <span className="px-2 py-0.5 bg-muted/40 rounded text-xs font-medium border border-border/20">{candidate.role}</span>
                    </td>
                    <td className="p-4 hidden lg:table-cell text-sm text-muted-foreground font-body">
                      <p className="line-clamp-1 max-w-xs">{candidate.bio}</p>
                    </td>
                    <td className="p-4 text-center">
                      <span className="font-bold text-primary">{candidate.voteCount}</span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity">
                        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-muted/30">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <form action={async () => { "use server"; await deleteCandidate(candidate.id); }}>
                          <Button 
                            type="submit"
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
                {candidates.length === 0 && (
                  <tr>
                    <td colSpan={5} className="p-12 text-center text-muted-foreground font-body">
                      No candidates found. Start by adding one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
