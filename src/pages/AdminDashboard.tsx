import { useState } from 'react';
import { Users, Trophy, Heart, Award, BarChart } from 'lucide-react';
import { UserManagement } from '../components/admin/UserManagement';
import { DrawManagement } from '../components/admin/DrawManagement';
import { CharityManagement } from '../components/admin/CharityManagement';
import { WinnerManagement } from '../components/admin/WinnerManagement';
import { AnalyticsDashboard } from '../components/admin/AnalyticsDashboard';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'users' | 'draws' | 'charities' | 'winners' | 'analytics'>('analytics');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
          <p className="text-gray-600">Manage platform operations and content</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6" aria-label="Tabs">
              <button
                onClick={() => setActiveTab('analytics')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition flex items-center space-x-2 ${
                  activeTab === 'analytics'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <BarChart className="w-4 h-4" />
                <span>Analytics</span>
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition flex items-center space-x-2 ${
                  activeTab === 'users'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Users className="w-4 h-4" />
                <span>Users</span>
              </button>
              <button
                onClick={() => setActiveTab('draws')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition flex items-center space-x-2 ${
                  activeTab === 'draws'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Trophy className="w-4 h-4" />
                <span>Draws</span>
              </button>
              <button
                onClick={() => setActiveTab('charities')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition flex items-center space-x-2 ${
                  activeTab === 'charities'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Heart className="w-4 h-4" />
                <span>Charities</span>
              </button>
              <button
                onClick={() => setActiveTab('winners')}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition flex items-center space-x-2 ${
                  activeTab === 'winners'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Award className="w-4 h-4" />
                <span>Winners</span>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'analytics' && <AnalyticsDashboard />}
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'draws' && <DrawManagement />}
            {activeTab === 'charities' && <CharityManagement />}
            {activeTab === 'winners' && <WinnerManagement />}
          </div>
        </div>
      </div>
    </div>
  );
}
