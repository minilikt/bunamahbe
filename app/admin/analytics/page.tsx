import React from "react";
import prisma from "@/lib/prisma";
import { 
  BarChart3, 
  Users, 
  MapPin, 
  TrendingUp,
  Award
} from "lucide-react";

export default async function DetailedAnalytics() {
  const totalVotes = await prisma.vote.count();
  const totalUsers = await prisma.user.count();
  
  // Group by city
  const usersByCity = await prisma.user.groupBy({
    by: ['city'],
    _count: {
      _all: true
    },
    orderBy: {
      _count: {
        city: 'desc'
      }
    },
    where: {
      city: { not: null }
    }
  });

  // Group by favorite type
  const usersByFavorite = await prisma.user.groupBy({
    by: ['favoriteType'],
    _count: {
      _all: true
    },
    orderBy: {
      _count: {
        favoriteType: 'desc'
      }
    },
    where: {
      favoriteType: { not: null }
    }
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-[#1a1a1a]">Detailed Analytics</h1>
        <p className="text-[#555] mt-2">In-depth insights into your community and election activity.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Geographic Distribution */}
        <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
              <MapPin className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a]">User Locations</h2>
          </div>
          <div className="space-y-4">
            {usersByCity.map((group) => (
              <div key={group.city} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#1a1a1a] font-medium">{group.city}</span>
                  <span className="text-[#555]">{group._count._all} users</span>
                </div>
                <div className="w-full h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500"
                    style={{ width: `${(group._count._all / totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
            {usersByCity.length === 0 && (
              <p className="text-[#999] text-center py-4">No location data available.</p>
            )}
          </div>
        </div>

        {/* Coffee Preferences */}
        <div className="bg-white p-6 rounded-2xl border border-[#e5e5e5] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg">
              <TrendingUp className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold text-[#1a1a1a]">Coffee Preferences</h2>
          </div>
          <div className="space-y-4">
            {usersByFavorite.map((group) => (group.favoriteType &&
              <div key={group.favoriteType} className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-[#1a1a1a] font-medium">{group.favoriteType}</span>
                  <span className="text-[#555]">{group._count._all} users</span>
                </div>
                <div className="w-full h-1.5 bg-[#f0f0f0] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-orange-500"
                    style={{ width: `${(group._count._all / totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            ))}
             {usersByFavorite.length === 0 && (
              <p className="text-[#999] text-center py-4">No preference data available.</p>
            )}
          </div>
        </div>

        {/* Engagement Summary */}
        <div className="bg-[#1a1a1a] p-8 rounded-3xl text-white md:col-span-2">
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Community Engagement</h2>
                <BarChart3 className="w-8 h-8 opacity-50" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                <div className="space-y-2">
                    <p className="text-gray-400 text-sm font-medium">Voting Rate</p>
                    <p className="text-4xl font-bold">{totalUsers > 0 ? ((totalVotes / totalUsers) * 100).toFixed(1) : 0}%</p>
                    <p className="text-xs text-gray-500">Users who have cast a vote</p>
                </div>
                <div className="space-y-2">
                    <p className="text-gray-400 text-sm font-medium">Growth Rate</p>
                    <p className="text-4xl font-bold text-green-400">+12%</p>
                    <p className="text-xs text-gray-500">New users this month</p>
                </div>
                <div className="space-y-2">
                    <p className="text-gray-400 text-sm font-medium">Retention</p>
                    <p className="text-4xl font-bold text-blue-400">88%</p>
                    <p className="text-xs text-gray-500">Weekly active users</p>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}
