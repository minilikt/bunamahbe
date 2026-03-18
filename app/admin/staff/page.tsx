import React from "react";
export const dynamic = "force-dynamic";
import prisma from "@/lib/prisma";
import { 
  Shield, 
  User as UserIcon,
  Search,
  MoreVertical,
} from "lucide-react";
import { updateUserRole } from "@/app/actions/admin";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { UserEditDialog } from "@/components/admin/UserEditDialog";

export default async function StaffManagement({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q: query } = await searchParams;

  const users = await prisma.user.findMany({
    where: query
      ? {
          OR: [
            { name: { contains: query, mode: "insensitive" } },
            { email: { contains: query, mode: "insensitive" } },
          ],
        }
      : {},
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Staff & User Management</h1>
          <p className="text-muted-foreground font-body">Manage user roles and permissions across the platform.</p>
        </div>
      </div>

      <form method="GET" action="/admin/staff" className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input 
            name="q"
            placeholder="Search users..." 
            className="pl-8 bg-card/50 border-border/30"
            defaultValue={query || ""}
          />
        </div>
        <Button type="submit" size="sm" className="bg-primary text-primary-foreground font-display">
          Search
        </Button>
        {query && (
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
                          <span className="text-xs text-muted-foreground line-clamp-1">{user.email}</span>
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
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <UserEditDialog user={user} />
                        {user.role === "USER" && (
                          <form action={async () => { "use server"; await updateUserRole(user.id, "STAFF"); }}>
                            <Button size="sm" variant="outline" className="h-8 text-xs font-display border-border/40 hover:bg-muted/30">
                              Make Staff
                            </Button>
                          </form>
                        )}
                        {user.role === "STAFF" && (
                          <div className="flex gap-2">
                            <form action={async () => { "use server"; await updateUserRole(user.id, "ADMIN"); }}>
                              <Button size="sm" className="h-8 text-xs font-display bg-primary text-primary-foreground hover:bg-primary/90">
                                Make Admin
                              </Button>
                            </form>
                            <form action={async () => { "use server"; await updateUserRole(user.id, "USER"); }}>
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
      </Card>
    </div>
  );
}
