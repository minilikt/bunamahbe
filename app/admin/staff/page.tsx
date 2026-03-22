import React from "react";
export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { 
  Shield, 
  User as UserIcon,
  Search,
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
} from "lucide-react";
import Link from "next/link";
import { updateUserRole, getCandidatesList } from "@/app/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { UserEditDialog } from "@/components/admin/UserEditDialog";

export default async function StaffManagement({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string; candidateId?: string; verified?: string }>;
}) {
  await requireAdmin();

  const { q: query, page: pageStr, candidateId, verified } = await searchParams;
  const page = pageStr ? parseInt(pageStr) : 1;
  const limit = 50;
  const skip = (page - 1) * limit;

  const where = {
    ...(query ? {
      OR: [
        { name: { contains: query, mode: "insensitive" as any } },
        { email: { contains: query, mode: "insensitive" as any } },
      ],
    } : {}),
    ...(candidateId && candidateId !== "all" ? {
      votes: {
        some: { candidateId }
      }
    } : {}),
    ...(verified === "true" ? { emailVerified: true } : verified === "false" ? { emailVerified: false } : {}),
  };

  const [users, totalUsers, candidates] = await Promise.all([
    prisma.user.findMany({
      where,
      include: {
        votes: {
          include: {
            candidate: {
              select: { name: true }
            }
          }
        }
      },
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
    }) as Promise<any[]>,
    prisma.user.count({ where }),
    getCandidatesList(),
  ]);

  const totalPages = Math.ceil(totalUsers / limit);

  function buildPageLink(p: number) {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    if (candidateId && candidateId !== "all") params.set("candidateId", candidateId);
    if (verified) params.set("verified", verified);
    params.set("page", String(p));
    return `/admin/staff?${params.toString()}`;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Staff & User Management</h1>
          <p className="text-muted-foreground font-body">Manage user roles and permissions across the platform.</p>
        </div>
      </div>

      <form method="GET" action="/admin/staff" className="flex flex-wrap items-center gap-4">
        <div className="relative flex-1 min-w-[240px] max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            name="q"
            placeholder="Search users..." 
            className="pl-8 bg-card/50 border-border/30"
            defaultValue={query || ""}
          />
        </div>
        
        <div className="w-[200px]">
          <Select name="candidateId" defaultValue={candidateId || "all"}>
            <SelectTrigger className="bg-card/50 border-border/30">
              <SelectValue placeholder="Filter by candidate" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Candidates</SelectItem>
              {candidates.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="w-[180px]">
          <Select name="verified" defaultValue={verified || "all"}>
            <SelectTrigger className="bg-card/50 border-border/30">
              <SelectValue placeholder="Verification Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Status</SelectItem>
              <SelectItem value="true">Verified Only</SelectItem>
              <SelectItem value="false">Unverified Only</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-display">
          Apply Filters
        </Button>
        
        {(query || (candidateId && candidateId !== "all") || (verified && verified !== "all")) && (
          <Button variant="ghost" size="sm" asChild>
            <a href="/admin/staff">Clear</a>
          </Button>
        )}
      </form>

      <Card className="overflow-hidden border-border/50 shadow-sm bg-card/40 backdrop-blur-sm">
        <CardHeader className="p-4 md:p-6 bg-muted/30 border-b border-border/50">
          <CardTitle className="text-lg font-display">
            {query ? `Search Results for "${query}"` : "Users"}
          </CardTitle>
          <CardDescription className="font-body">
            {query ? `Found ${users.length} matching users.` : "A list of recent users and their current roles."}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-border/30 bg-muted/20">
                  <th className="p-4 font-semibold text-sm font-display">User</th>
                  <th className="p-4 font-semibold text-sm hidden md:table-cell text-muted-foreground font-display">Location</th>
                  <th className="p-4 font-semibold text-sm text-muted-foreground font-display">Role</th>
                  <th className="p-4 font-semibold text-sm text-muted-foreground font-display">Voted For</th>
                  <th className="p-4 font-semibold text-sm text-right text-muted-foreground font-display">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 border-border/30">
                          <AvatarImage src={user.image!} alt={user.name!} />
                          <AvatarFallback className="bg-muted text-xs">
                            <UserIcon className="h-4 w-4 text-muted-foreground" />
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                          <span className="font-semibold text-sm line-clamp-1">{user.name}</span>
                          <div className="flex items-center gap-1.5">
                            <span className="text-xs text-muted-foreground line-clamp-1">{user.email}</span>
                            {user.emailVerified && (
                              <span title="Verified email">
                                <CheckCircle2 className="h-3 w-3 text-primary fill-primary/10" />
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 hidden md:table-cell text-sm text-muted-foreground font-body">
                      {user.city || "Not specified"}
                    </td>
                    <td className="p-4">
                      <Badge 
                        variant={user.role === "ADMIN" ? "default" : user.role === "STAFF" ? "secondary" : "outline"}
                        className={`gap-1 font-medium ${
                          user.role === "ADMIN" ? "bg-primary/20 text-primary border-primary/30" : 
                          user.role === "STAFF" ? "bg-muted/40 text-muted-foreground border-border/20" : 
                          "border-border/20 text-muted-foreground"
                        }`}
                      >
                        {user.role === "ADMIN" && <Shield className="h-3 w-3" />}
                        {user.role}
                      </Badge>
                    </td>
                    <td className="p-4 text-sm font-body">
                      {user.votes && user.votes.length > 0 ? (
                        <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                          {user.votes[0].candidate.name}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground italic">No vote</span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <UserEditDialog user={user} />
                        {user.role === "USER" && (
                          <form action={updateUserRole.bind(null, user.id, "STAFF")}>
                            <Button size="sm" variant="outline" className="h-8 text-xs font-display border-border/40 hover:bg-muted/30">
                              Make Staff
                            </Button>
                          </form>
                        )}
                        {user.role === "STAFF" && (
                          <div className="flex gap-2">
                            <form action={updateUserRole.bind(null, user.id, "ADMIN")}>
                              <Button size="sm" className="h-8 text-xs font-display bg-primary text-primary-foreground hover:bg-primary/90">
                                Make Admin
                              </Button>
                            </form>
                            <form action={updateUserRole.bind(null, user.id, "USER")}>
                              <Button size="sm" variant="ghost" className="h-8 text-xs font-display text-destructive hover:bg-destructive/10 hover:text-destructive">
                                Demote
                              </Button>
                            </form>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
                {users.length === 0 && (
                  <tr>
                    <td colSpan={4} className="p-12 text-center text-muted-foreground font-body italic">
                      No users found matching "{query}".
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
        {totalPages > 1 && (
          <div className="p-4 border-t border-border/30 bg-muted/30 flex flex-col md:flex-row items-center justify-between gap-4">
            <Button
              variant="outline"
              size="sm"
              disabled={page <= 1}
              asChild={page > 1}
              className="w-full md:w-auto"
            >
              {page > 1 ? (
                <Link href={buildPageLink(page - 1)}>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </Link>
              ) : (
                <>
                  <ChevronLeft className="h-4 w-4 mr-2" />
                  Previous
                </>
              )}
            </Button>

            <div className="flex items-center gap-1">
              {(() => {
                const pages = [];
                const maxVisible = 5;
                let start = Math.max(1, page - 2);
                let end = Math.min(totalPages, start + maxVisible - 1);
                
                if (end === totalPages) {
                  start = Math.max(1, end - maxVisible + 1);
                }

                if (start > 1) {
                  pages.push(1);
                  if (start > 2) pages.push("...");
                }

                for (let i = start; i <= end; i++) {
                  pages.push(i);
                }

                if (end < totalPages) {
                  if (end < totalPages - 1) pages.push("...");
                  pages.push(totalPages);
                }

                return pages.map((p, i) => (
                  <React.Fragment key={i}>
                    {typeof p === "number" ? (
                      <Button
                        variant={p === page ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 font-body ${p === page ? "bg-primary text-primary-foreground" : "bg-card/40 border-border/30"}`}
                        asChild={p !== page}
                      >
                        {p === page ? (
                          <span>{p}</span>
                        ) : (
                          <Link href={buildPageLink(p)}>{p}</Link>
                        )}
                      </Button>
                    ) : (
                      <span className="px-1 text-muted-foreground">...</span>
                    )}
                  </React.Fragment>
                ));
              })()}
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={page >= totalPages}
              asChild={page < totalPages}
              className="w-full md:w-auto"
            >
              {page < totalPages ? (
                <Link href={buildPageLink(page + 1)}>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Link>
              ) : (
                <>
                  Next
                  <ChevronRight className="h-4 w-4 ml-2" />
                </>
              )}
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
