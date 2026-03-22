import React from "react";
export const dynamic = "force-dynamic";
import { getAnalytics } from "../actions/admin";
import { requireAdmin } from "@/lib/require-admin";
import { 
  Users, 
  Vote, 
  TrendingUp, 
  Clock,
  ExternalLink,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";

export default async function AdminDashboard() {
  await requireAdmin();

  const analytics = await getAnalytics();

  const stats = [
    {
      title: "Total Users",
      value: analytics.totalUsers,
      icon: Users,
      color: "text-blue-600",
      bg: "bg-blue-50",
    },
    {
      title: "Total Votes",
      value: analytics.totalVotes,
      icon: Vote,
      color: "text-green-600",
      bg: "bg-green-50",
    },
    {
      title: "Candidates",
      value: analytics.candidates.length,
      icon: TrendingUp,
      color: "text-purple-600",
      bg: "bg-purple-50",
    },
    {
      title: "Recent Activity",
      value: "Live",
      icon: Clock,
      color: "text-orange-600",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Admin Dashboard</h1>
          <p className="text-muted-foreground font-body">Welcome to the Buna Association administrative portal.</p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <Card key={stat.title} className="border-border/50 shadow-sm bg-card/40 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-xl bg-background border border-border/20 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Election Standings */}
        <Card className="border-border/50 shadow-sm flex flex-col bg-card/40 backdrop-blur-sm overflow-hidden">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="text-lg">Election Standings</CardTitle>
            <CardDescription>Real-time vote counts for each candidate.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 flex-1">
            <div className="space-y-6">
              {analytics.candidates.map((candidate) => (
                <div key={candidate.id} className="space-y-2">
                  <div className="flex items-center justify-between text-sm p-1 rounded transition-colors hover:bg-muted/20">
                    <div className="flex items-center gap-2">
                      <Avatar className="h-6 w-6 border-border/40">
                        <AvatarImage src={candidate.image!} />
                        <AvatarFallback className="bg-muted text-xs">{candidate.name[0]}</AvatarFallback>
                      </Avatar>
                      <span className="font-semibold">{candidate.name}</span>
                    </div>
                    <span className="text-muted-foreground font-medium">{candidate.voteCount} votes</span>
                  </div>
                  <Progress 
                    value={analytics.totalVotes > 0 ? (candidate.voteCount / analytics.totalVotes) * 100 : 0} 
                    className="h-2 bg-muted/30" 
                  />
                </div>
              ))}
              {analytics.candidates.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">No candidates found.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Votes */}
        <Card className="border-border/50 shadow-sm flex flex-col overflow-hidden bg-card/40 backdrop-blur-sm">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <CardTitle className="text-lg">Recent Votes</CardTitle>
            <CardDescription>The latest activity from the community.</CardDescription>
          </CardHeader>
          <CardContent className="p-0 flex-1">
            <div className="divide-y divide-border/30">
              {analytics.recentVotes.map((vote) => (
                <div key={vote.id} className="p-4 flex items-center justify-between hover:bg-muted/20 transition-colors">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-8 w-8 border-border/40">
                      <AvatarImage src={vote.user.image!} />
                      <AvatarFallback className="bg-muted text-xs">{vote.user.name![0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <span className="font-semibold text-sm">{vote.user.name}</span>
                      <span className="text-xs text-muted-foreground">Voted for {vote.candidate.name}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground bg-muted/40 px-2 py-0.5 rounded">
                    {new Date(vote.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {analytics.recentVotes.length === 0 && (
                <div className="p-12 text-center text-muted-foreground">
                  No votes cast yet.
                </div>
              )}
            </div>
          </CardContent>
          <div className="p-4 border-t border-border/30 bg-muted/30">
            <Button variant="ghost" className="w-full text-xs font-bold uppercase tracking-widest text-muted-foreground hover:bg-muted/40" asChild>
              <a href="/admin/votes">View All Votes <ExternalLink className="h-3 w-3 ml-2" /></a>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
