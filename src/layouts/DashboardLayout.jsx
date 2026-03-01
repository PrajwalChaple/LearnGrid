import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Navbar } from './Navbar';
import { useAuth } from '../context/AuthContext';
import { GlobalCalendarSync } from '../components/GlobalCalendarSync';

export function DashboardLayout() {
  const { user, isOnboarded } = useAuth();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  // Redirect to login if not authenticated
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to verify-email if email not verified
  const isGoogleUser = user.providerData?.some(p => p.providerId === 'google.com');
  if (!user.emailVerified && !isGoogleUser) {
    return <Navigate to="/verify-email" replace />;
  }

  // Redirect to onboarding if profile is incomplete
  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />;
  }

  return (
    <div className="layout">
      <GlobalCalendarSync />
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="main-content">
        <Navbar onMenuClick={() => setIsSidebarOpen(!isSidebarOpen)} />

        <main className="content-area">
          <div className="content-container animate-fade-in">
            <Outlet />
          </div>
        </main>
      </div>

      {isSidebarOpen && (
        <div
          className="overlay"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <style>{`
        .layout {
          display: flex;
          min-height: 100vh;
        }

        .main-content {
          flex: 1;
          margin-left: 270px;
          display: flex;
          flex-direction: column;
          min-width: 0;
          transition: margin-left var(--transition-normal);
          background-color: #f8fafc;
        }

        .content-area {
          flex: 1;
          padding: 2rem;
          overflow-x: hidden;
          max-width: 1600px;
          margin: 0 auto;
          width: 100%;
        }

        .content-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 var(--spacing-md);
          width: 100%;
        }

        .overlay {
          display: none;
        }

        @media (max-width: 768px) {
          .main-content {
            margin-left: 0;
          }

          .content-area {
            padding: 1rem;
          }

          .content-container {
            padding: 0;
          }

          .overlay {
            display: block;
            position: fixed;
            inset: 0;
            background-color: rgba(0, 0, 0, 0.5);
            z-index: 45;
            animation: fadeIn 0.2s ease-out;
            backdrop-filter: blur(4px);
          }
        }
      `}</style>
    </div>
  );
}
