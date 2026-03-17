import React from "react";
import prisma from "@/lib/prisma";
import { 
  Users, 
  Shield, 
  User as UserIcon,
  Search,
  CheckCircle2,
  XCircle
} from "lucide-react";
import { updateUserRole } from "@/app/actions/admin";

export default async function StaffManagement() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    take: 50, // Limit for now
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Staff & User Management</h1>
          <p className="text-[#555] mt-2">Manage user roles and permissions across the platform.</p>
        </div>
      </div>

      {/* Search Bar - Placeholder for now as it needs client-side filtering or server actions with query */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#999]" />
        <input 
          placeholder="Search users by name or email..." 
          className="w-full pl-10 pr-4 py-2 bg-white border border-[#e5e5e5] rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* User Table */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fafafa] border-b border-[#e5e5e5]">
              <th className="p-4 font-bold text-[#1a1a1a] text-sm">User</th>
              <th className="p-4 font-bold text-[#1a1a1a] text-sm md:table-cell hidden">Location</th>
              <th className="p-4 font-bold text-[#1a1a1a] text-sm">Current Role</th>
              <th className="p-4 font-bold text-[#1a1a1a] text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5]">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-[#fafafa] transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f0f0f0] overflow-hidden relative border border-[#e5e5e5]">
                      {user.image ? (
                        <img 
                          src={user.image} 
                          alt={user.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#999]">
                          <UserIcon className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1a1a1a]">{user.name}</span>
                      <span className="text-xs text-[#555]">{user.email}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 md:table-cell hidden text-[#555] text-sm">
                  {user.city || "Not specified"}
                </td>
                <td className="p-4">
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${
                    user.role === "ADMIN" 
                      ? "bg-purple-50 text-purple-700 border border-purple-100" 
                      : user.role === "STAFF"
                      ? "bg-blue-50 text-blue-700 border border-blue-100"
                      : "bg-gray-50 text-gray-700 border border-gray-100"
                  }`}>
                    {user.role === "ADMIN" && <Shield className="w-3 h-3" />}
                    {user.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {user.role === "USER" && (
                      <form action={async () => { "use server"; await updateUserRole(user.id, "STAFF"); }}>
                        <button 
                          type="submit"
                          className="px-3 py-1.5 text-xs font-semibold bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Make Staff
                        </button>
                      </form>
                    )}
                    {user.role === "STAFF" && (
                      <>
                        <form action={async () => { "use server"; await updateUserRole(user.id, "ADMIN"); }}>
                          <button 
                            type="submit"
                            className="px-3 py-1.5 text-xs font-semibold bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                          >
                            Make Admin
                          </button>
                        </form>
                        <form action={async () => { "use server"; await updateUserRole(user.id, "USER"); }}>
                          <button 
                            type="submit"
                            className="px-3 py-1.5 text-xs font-semibold bg-[#f0f0f0] text-[#1a1a1a] rounded-lg hover:bg-[#e5e5e5] transition-colors"
                          >
                            Demote to User
                          </button>
                        </form>
                      </>
                    )}
                    {user.role === "ADMIN" && (
                      <span className="text-xs text-[#999] italic">Super User</span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
