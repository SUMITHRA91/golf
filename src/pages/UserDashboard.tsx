import { useEffect, useState } from 'react';
import { Trophy, Heart, TrendingUp, CreditCard, Calendar, Award } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { ScoreEntry } from '../components/dashboard/ScoreEntry';
import { CharitySelection } from '../components/dashboard/CharitySelection';
import { SubscriptionStatus } from '../components/dashboard/SubscriptionStatus';

interface Profile {
  id: string;
  email: string;
  full_name: string | null;
}

interface Subscription {
  id: string;
  plan_type: string;
  status: string;
  current_period_end: string;
  amount: number;
}

export function UserDashboard() {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'scores' | 'charity' | 'subscription'>('overview');

  useEffect(() => {
    if (user) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    const [profileRes, subscriptionRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user!.id).maybeSingle(),
      supabase.from('subscriptions').select('*').eq('user_id', user!.id).eq('status', 'active').maybeSingle()
    ]);

    if (profileRes.data) setProfile(profileRes.data);
    if (subscriptionRes.data) setSubscription(subscriptionRes.data);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {profile?.full_name || 'Golfer'}!
          </h1>
          <p className="text-gray-600">Manage your scores, charity, and subscription</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('overview')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'overview'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('scores')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'scores'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Scores
              </button>
              <button
                onClick={() => setActiveTab('charity')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'charity'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Charity
              </button>
              <button
                onClick={() => setActiveTab('subscription')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition ${
                  activeTab === 'subscription'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Subscription
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'overview' && <DashboardOverview subscription={subscription} />}
            {activeTab === 'scores' && <ScoreEntry userId={user!.id} />}
            {activeTab === 'charity' && <CharitySelection userId={user!.id} />}
            {activeTab === 'subscription' && <SubscriptionStatus subscription={subscription} />}
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardOverview({ subscription }: { subscription: Subscription | null }) {
  return (
    <div className="space-y-6">
      {!subscription && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
          <div className="flex items-start">
            <Award className="w-6 h-6 text-yellow-600 mr-3 mt-1" />
            <div>
              <h3 className="text-lg font-semibold text-yellow-900 mb-2">No Active Subscription</h3>
              <p className="text-yellow-700 mb-4">
                Subscribe now to enter monthly draws and support your favorite charity!
              </p>
              <button className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition">
                Subscribe Now
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <TrendingUp className="w-8 h-8 text-blue-600" />
          </div>
          <h3 className="text-gray-700 font-medium mb-1">Latest Score</h3>
          <p className="text-3xl font-bold text-gray-900">--</p>
          <p className="text-sm text-gray-600 mt-1">Add your first score</p>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Trophy className="w-8 h-8 text-green-600" />
          </div>
          <h3 className="text-gray-700 font-medium mb-1">Total Winnings</h3>
          <p className="text-3xl font-bold text-gray-900">$0</p>
          <p className="text-sm text-gray-600 mt-1">0 prizes won</p>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <Heart className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-gray-700 font-medium mb-1">Charity Impact</h3>
          <p className="text-3xl font-bold text-gray-900">$0</p>
          <p className="text-sm text-gray-600 mt-1">Total contributed</p>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-6 h-6 mr-2 text-blue-600" />
          Upcoming Draws
        </h3>
        <p className="text-gray-600">No upcoming draws at this time. Check back soon!</p>
      </div>
    </div>
  );
}
