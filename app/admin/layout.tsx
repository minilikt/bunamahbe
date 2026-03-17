import React from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  UserPlus, 
  BarChart3, 
  Settings,
  Coffee
} from "lucide-react";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#fafafa]">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#e5e5e5] h-full flex flex-col">
        <div className="p-6 border-b border-[#e5e5e5]">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold text-[#1a1a1a]">
            <span className="text-2xl">☕</span> Buna Admin
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-1">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#1a1a1a] rounded-lg hover:bg-[#f0f0f0] transition-colors"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </Link>
          <Link 
            href="/admin/candidates" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#555] rounded-lg hover:bg-[#f0f0f0] transition-colors"
          >
            <UserPlus className="w-4 h-4" />
            Candidates
          </Link>
          <Link 
            href="/admin/staff" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#555] rounded-lg hover:bg-[#f0f0f0] transition-colors"
          >
            <Users className="w-4 h-4" />
            Staff & Users
          </Link>
          <Link 
            href="/admin/analytics" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#555] rounded-lg hover:bg-[#f0f0f0] transition-colors"
          >
            <BarChart3 className="w-4 h-4" />
            Detailed Stats
          </Link>
        </nav>
        
        <div className="p-4 border-t border-[#e5e5e5]">
          <Link 
            href="/dashboard" 
            className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-[#555] rounded-lg hover:bg-[#f0f0f0] transition-colors"
          >
            <Settings className="w-4 h-4" />
            Exit Admin
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-7xl mx-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
