import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import { AuthProvider, useAuth } from './contexts/AuthContext';
import { Header } from './components/layout/Header';
import { HomePage } from './pages/HomePage';
import { HowItWorksPage } from './pages/HowItWorksPage';
import { CharitiesPage } from './pages/CharitiesPage';
import { UserDashboard } from './pages/UserDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { LoginForm } from './components/auth/LoginForm';
import { SignupForm } from './components/auth/SignupForm';

type Page = 'home' | 'how-it-works' | 'charities' | 'login' | 'signup' | 'dashboard' | 'admin';

/* 🔥 Only small change → added initialPage */
function AppContent({ initialPage = 'home' }: { initialPage?: Page }) {
  const [currentPage, setCurrentPage] = useState<Page>(initialPage);
  const { user, loading, isAdmin } = useAuth();

  useEffect(() => {
    if (user && (currentPage === 'login' || currentPage === 'signup')) {
      setCurrentPage('dashboard');
    }
  }, [user, currentPage]);

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={handleNavigate} currentPage={currentPage} />

      <main>
        {currentPage === 'home' && <HomePage onNavigate={handleNavigate} />}
        {currentPage === 'how-it-works' && <HowItWorksPage onNavigate={handleNavigate} />}
        {currentPage === 'charities' && <CharitiesPage />}

        {currentPage === 'login' && !user && (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
            <LoginForm
              onSuccess={() => setCurrentPage('dashboard')}
              onSwitchToSignup={() => setCurrentPage('signup')}
            />
          </div>
        )}

        {currentPage === 'signup' && !user && (
          <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12">
            <SignupForm
              onSuccess={() => setCurrentPage('dashboard')}
              onSwitchToLogin={() => setCurrentPage('login')}
            />
          </div>
        )}

        {currentPage === 'dashboard' && user && <UserDashboard />}

        {/* ✅ Admin condition unchanged */}
        {currentPage === 'admin' && user && isAdmin && <AdminDashboard />}

        {currentPage === 'dashboard' && !user && (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Please log in</h2>
              <button
                onClick={() => setCurrentPage('login')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                Go to Login
              </button>
            </div>
          </div>
        )}

        {currentPage === 'admin' && !isAdmin && (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h2>
              <p className="text-gray-600 mb-4">You don't have admin privileges</p>
              <button
                onClick={() => setCurrentPage('home')}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                Go Home
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

/* 🔥 Routing added here ONLY */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Default App */}
          <Route path="/" element={<AppContent />} />

          {/* ✅ Admin Route */}
          <Route path="/admin" element={<AppContent initialPage="admin" />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;