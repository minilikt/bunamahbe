import React from "react";
import { getAnalytics } from "../actions/admin";
import { 
  Users, 
  Vote, 
  TrendingUp, 
  Clock 
} from "lucide-react";

export default async function AdminDashboard() {
  const analytics = await getAnalytics();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1a1a1a]">Admin Dashboard</h1>
        <p className="text-[#555] mt-2">Welcome to the Buna Association administrative portal.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#555]">Total Users</p>
              <p className="text-2xl font-bold text-[#1a1a1a]">{analytics.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-50 text-green-600 rounded-xl">
              <Vote className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#555]">Total Votes</p>
              <p className="text-2xl font-bold text-[#1a1a1a]">{analytics.totalVotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#555]">Candidates</p>
              <p className="text-2xl font-bold text-[#1a1a1a]">{analytics.candidates.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-orange-50 text-orange-600 rounded-xl">
              <Clock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[#555]">Recent Activity</p>
              <p className="text-2xl font-bold text-[#1a1a1a]">Live</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Election Standings */}
        <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm flex flex-col">
          <div className="p-6 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold text-[#1a1a1a]">Election Standings</h2>
          </div>
          <div className="p-6 flex-1">
            <div className="space-y-4">
              {analytics.candidates.map((candidate) => (
                <div key={candidate.id} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium text-[#1a1a1a]">{candidate.name}</span>
                    <span className="text-[#555]">{candidate.voteCount} votes</span>
                  </div>
                  <div className="w-full h-2 bg-[#f0f0f0] rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{ 
                        width: `${analytics.totalVotes > 0 ? (candidate.voteCount / analytics.totalVotes) * 100 : 0}%` 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Votes */}
        <div className="bg-white rounded-2xl border border-[#e5e5e5] shadow-sm flex flex-col">
          <div className="p-6 border-b border-[#e5e5e5]">
            <h2 className="text-xl font-bold text-[#1a1a1a]">Recent Votes</h2>
          </div>
          <div className="p-0 flex-1">
            <div className="divide-y divide-[#e5e5e5]">
              {analytics.recentVotes.map((vote) => (
                <div key={vote.id} className="p-4 flex items-center justify-between hover:bg-[#fafafa] transition-colors">
                  <div className="flex flex-col">
                    <span className="font-medium text-[#1a1a1a]">{vote.user.name}</span>
                    <span className="text-xs text-[#555]">Voted for {vote.candidate.name}</span>
                  </div>
                  <span className="text-xs text-[#999]">
                    {new Date(vote.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              {analytics.recentVotes.length === 0 && (
                <div className="p-8 text-center text-[#999]">
                  No votes cast yet.
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
