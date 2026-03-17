import React from "react";
import prisma from "@/lib/prisma";
import { 
  Plus, 
  Pencil, 
  Trash2, 
  ExternalLink,
  User 
} from "lucide-react";
import { addCandidate, deleteCandidate } from "@/app/actions/admin";
import Image from "next/image";

export default async function CandidateManagement() {
  const candidates = await prisma.candidate.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-[#1a1a1a]">Candidate Management</h1>
          <p className="text-[#555] mt-2">Manage the candidates for the upcoming election.</p>
        </div>
        
        {/* Simple Add Button (this could be a modal in a real app, but for now we'll use a simple form below or a separate page) */}
        <button className="flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] text-white rounded-lg hover:bg-[#333] transition-colors">
          <Plus className="w-4 h-4" />
          Add Candidate
        </button>
      </div>

      {/* Quick Add Form */}
      <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-sm">
        <h2 className="text-lg font-bold text-[#1a1a1a] mb-4">Quick Add Candidate</h2>
        <form action={addCandidate} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <input 
            name="name" 
            placeholder="Candidate Name" 
            required 
            className="px-4 py-2 rounded-lg border border-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            name="username" 
            placeholder="Username (optional)" 
            className="px-4 py-2 rounded-lg border border-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            name="role" 
            placeholder="Role (e.g. Regional Manager)" 
            required 
            className="px-4 py-2 rounded-lg border border-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            name="image" 
            placeholder="Image URL" 
            required 
            className="px-4 py-2 rounded-lg border border-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <input 
            name="tiktokVideoId" 
            placeholder="TikTok Video ID (optional)" 
            className="px-4 py-2 rounded-lg border border-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <textarea 
            name="bio" 
            placeholder="Biography" 
            required 
            className="px-4 py-2 rounded-lg border border-[#e5e5e5] focus:outline-none focus:ring-2 focus:ring-blue-500 md:col-span-2 lg:col-span-3 h-24"
          />
          <div className="lg:col-span-3 flex justify-end">
            <button 
              type="submit" 
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Save Candidate
            </button>
          </div>
        </form>
      </div>

      {/* Candidate List */}
      <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#fafafa] border-b border-[#e5e5e5]">
              <th className="p-4 font-bold text-[#1a1a1a] text-sm">Candidate</th>
              <th className="p-4 font-bold text-[#1a1a1a] text-sm md:table-cell hidden">Role</th>
              <th className="p-4 font-bold text-[#1a1a1a] text-sm lg:table-cell hidden">Bio Preview</th>
              <th className="p-4 font-bold text-[#1a1a1a] text-sm text-center">Votes</th>
              <th className="p-4 font-bold text-[#1a1a1a] text-sm text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#e5e5e5]">
            {candidates.map((candidate) => (
              <tr key={candidate.id} className="hover:bg-[#fafafa] transition-colors group">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#f0f0f0] overflow-hidden relative border border-[#e5e5e5]">
                      {candidate.image ? (
                        <img 
                          src={candidate.image} 
                          alt={candidate.name} 
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-[#999]">
                          <User className="w-5 h-5" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-col">
                      <span className="font-bold text-[#1a1a1a]">{candidate.name}</span>
                      <span className="text-xs text-[#555]">@{candidate.username || "no-username"}</span>
                    </div>
                  </div>
                </td>
                <td className="p-4 md:table-cell hidden">
                  <span className="inline-block px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                    {candidate.role}
                  </span>
                </td>
                <td className="p-4 lg:table-cell hidden">
                  <p className="text-sm text-[#555] line-clamp-1 max-w-xs">{candidate.bio}</p>
                </td>
                <td className="p-4 text-center">
                  <span className="font-bold text-blue-600">{candidate.voteCount}</span>
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    {/* Placeholder for Edit - would need more complex state handling for inline edit */}
                    <button className="p-2 text-[#555] hover:bg-white rounded-lg border border-transparent hover:border-[#e5e5e5]">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <form action={async () => { "use server"; await deleteCandidate(candidate.id); }}>
                      <button 
                        type="submit"
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
            {candidates.length === 0 && (
              <tr>
                <td colSpan={5} className="p-12 text-center text-[#999]">
                  No candidates found. Start by adding one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
