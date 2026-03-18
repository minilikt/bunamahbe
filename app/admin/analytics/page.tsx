import React from "react";
import prisma from "@/lib/prisma";
import { 
  BarChart3, 
  MapPin, 
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default async function DetailedAnalytics() {
  const totalVotes = await prisma.vote.count();
  const totalUsers = await prisma.user.count();
  
  // Group by city
  const usersByCity = await prisma.user.groupBy({
    by: ['city'],
    _count: { _all: true },
    orderBy: { _count: { city: 'desc' } },
    where: { city: { not: null } }
  });

  // Group by favorite type
  const usersByFavorite = await prisma.user.groupBy({
    by: ['favoriteType'],
    _count: { _all: true },
    orderBy: { _count: { favoriteType: 'desc' } },
    where: { favoriteType: { not: null } }
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Detailed Analytics</h1>
          <p className="text-muted-foreground font-body">In-depth insights into your community and activity.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Locations */}
        <Card className="border-border/50 shadow-sm bg-card/40 backdrop-blur-sm">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary" />
              <CardTitle className="text-lg font-display">User Locations</CardTitle>
            </div>
            <CardDescription className="font-body">Geographic distribution of your members.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {usersByCity.map((group) => (
                <div key={group.city} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{group.city}</span>
                    <span className="text-muted-foreground font-body">{group._count._all} users</span>
                  </div>
                  <Progress 
                    value={totalUsers > 0 ? (group._count._all / totalUsers) * 100 : 0} 
                    className="h-2 bg-muted/30" 
                  />
                </div>
              ))}
              {usersByCity.length === 0 && (
                <div className="text-center py-8 text-muted-foreground font-body">No location data available.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Coffee Preferences */}
        <Card className="border-border/50 shadow-sm bg-card/40 backdrop-blur-sm">
          <CardHeader className="bg-muted/30 border-b border-border/50">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-accent" />
              <CardTitle className="text-lg font-display">Coffee Preferences</CardTitle>
            </div>
            <CardDescription className="font-body">What your community loves to drink.</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-6">
              {usersByFavorite.map((group) => (group.favoriteType &&
                <div key={group.favoriteType} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{group.favoriteType}</span>
                    <span className="text-muted-foreground font-body">{group._count._all} users</span>
                  </div>
                  <Progress 
                    value={totalUsers > 0 ? (group._count._all / totalUsers) * 100 : 0} 
                    className="h-2 bg-muted/30"
                  />
                </div>
              ))}
              {usersByFavorite.length === 0 && (
                <div className="text-center py-8 text-muted-foreground font-body">No preference data available.</div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Community Engagement */}
        <Card className="bg-background/80 md:col-span-2 border border-border/50 shadow-xl overflow-hidden relative backdrop-blur-sm">
          <div className="absolute top-0 right-0 p-8">
            <BarChart3 className="h-12 w-12 text-primary/10" />
          </div>
          <CardHeader>
            <CardTitle className="text-2xl font-display">Community Engagement</CardTitle>
            <CardDescription className="text-muted-foreground font-body">Metric summaries for the platform.</CardDescription>
          </CardHeader>
          <CardContent className="p-8 pt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider font-display">Voting Rate</p>
                <p className="text-4xl font-bold font-display">{totalUsers > 0 ? ((totalVotes / totalUsers) * 100).toFixed(1) : 0}%</p>
                <div className="h-1 w-12 bg-primary rounded-full mt-2" />
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider font-display">Growth Rate</p>
                <p className="text-4xl font-bold text-green-500 font-display">+12%</p>
                <div className="h-1 w-12 bg-green-500 rounded-full mt-2" />
              </div>
              <div className="space-y-1">
                <p className="text-muted-foreground text-xs font-bold uppercase tracking-wider font-display">Retention</p>
                <p className="text-4xl font-bold text-primary font-display">88%</p>
                <div className="h-1 w-12 bg-primary rounded-full mt-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
