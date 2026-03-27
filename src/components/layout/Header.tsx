import { Heart, LogOut, User, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface HeaderProps {
  onNavigate: (page: string) => void;
  currentPage: string;
}

export function Header({ onNavigate, currentPage }: HeaderProps) {
  const { user, signOut, isAdmin } = useAuth();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <button
            onClick={() => onNavigate('home')}
            className="flex items-center space-x-2 group"
          >
            <Heart className="w-8 h-8 text-blue-600 group-hover:text-blue-700 transition" fill="currentColor" />
            <span className="text-xl font-bold text-gray-900">GolfCharity</span>
          </button>

          <nav className="hidden md:flex items-center space-x-8">
            <button
              onClick={() => onNavigate('home')}
              className={`text-sm font-medium transition ${
                currentPage === 'home' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Home
            </button>
            <button
              onClick={() => onNavigate('charities')}
              className={`text-sm font-medium transition ${
                currentPage === 'charities' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Charities
            </button>
            <button
              onClick={() => onNavigate('how-it-works')}
              className={`text-sm font-medium transition ${
                currentPage === 'how-it-works' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              How It Works
            </button>
          </nav>

          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {isAdmin && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                  >
                    <LayoutDashboard className="w-4 h-4" />
                    <span>Admin</span>
                  </button>
                )}
                <button
                  onClick={() => onNavigate('dashboard')}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  <User className="w-4 h-4" />
                  <span>Dashboard</span>
                </button>
                <button
                  onClick={() => signOut()}
                  className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-red-600 hover:text-red-700 transition"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => onNavigate('login')}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition"
                >
                  Login
                </button>
                <button
                  onClick={() => onNavigate('signup')}
                  className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
