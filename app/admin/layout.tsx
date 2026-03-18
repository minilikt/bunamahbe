import React from "react";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { TooltipProvider } from "@/components/ui/tooltip";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <TooltipProvider>
      <div className="dark">
        <SidebarProvider>
          <div className="flex h-screen w-full bg-background text-foreground">
            <AdminSidebar />
            <SidebarInset className="bg-background">
              <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4 md:px-6 bg-card sticky top-0 z-10">
                <SidebarTrigger className="-ml-1" />
                <Separator orientation="vertical" className="mr-2 h-4" />
                <div className="flex flex-1 items-center justify-between">
                  <h1 className="text-lg font-bold font-display">
                    Admin Panel
                  </h1>
                </div>
              </header>
              <main className="flex-1 overflow-y-auto">
                <div className="max-w-7xl mx-auto p-4 md:p-8">
                  {children}
                </div>
              </main>
            </SidebarInset>
          </div>
        </SidebarProvider>
      </div>
    </TooltipProvider>
  );
}
