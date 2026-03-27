import { useEffect, useState } from 'react';
import { Users, DollarSign, Heart, Trophy } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export function AnalyticsDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeSubscriptions: 0,
    totalPrizePool: 0,
    totalCharityContributions: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [usersRes, subscriptionsRes, drawsRes, contributionsRes] = await Promise.all([
      supabase.from('profiles').select('id', { count: 'exact', head: true }),
      supabase.from('subscriptions').select('id', { count: 'exact', head: true }).eq('status', 'active'),
      supabase.from('draws').select('total_pool_amount'),
      supabase.from('charity_contributions').select('amount')
    ]);

    const totalPrizePool = drawsRes.data?.reduce((sum, draw) => sum + (Number(draw.total_pool_amount) || 0), 0) || 0;
    const totalCharityContributions = contributionsRes.data?.reduce((sum, contrib) => sum + (Number(contrib.amount) || 0), 0) || 0;

    setStats({
      totalUsers: usersRes.count || 0,
      activeSubscriptions: subscriptionsRes.count || 0,
      totalPrizePool,
      totalCharityContributions,
    });

    setLoading(false);
  };

  if (loading) {
    return <div className="text-center py-8">Loading analytics...</div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-4">Platform Analytics</h3>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Users className="w-8 h-8 text-blue-600" />
          </div>
          <h4 className="text-gray-700 font-medium mb-1">Total Users</h4>
          <p className="text-3xl font-bold text-gray-900">{stats.totalUsers}</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
          <h4 className="text-gray-700 font-medium mb-1">Active Subscriptions</h4>
          <p className="text-3xl font-bold text-gray-900">{stats.activeSubscriptions}</p>
        </div>

        <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8 text-yellow-600" />
          </div>
          <h4 className="text-gray-700 font-medium mb-1">Total Prize Pool</h4>
          <p className="text-3xl font-bold text-gray-900">${stats.totalPrizePool.toFixed(2)}</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h4 className="text-gray-700 font-medium mb-1">Charity Contributions</h4>
          <p className="text-3xl font-bold text-gray-900">${stats.totalCharityContributions.toFixed(2)}</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h4 className="font-semibold text-gray-900 mb-4">Quick Actions</h4>
        <div className="grid md:grid-cols-3 gap-4">
          <button className="px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition">
            Run Monthly Draw
          </button>
          <button className="px-4 py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition">
            Add Charity
          </button>
          <button className="px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition">
            Generate Report
          </button>
        </div>
      </div>
    </div>
  );
}
