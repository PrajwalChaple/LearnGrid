import React, { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';

// Layouts — keep eagerly loaded (small, shared across many routes)
import { DashboardLayout } from './layouts/DashboardLayout';
import { StaticLayout } from './layouts/StaticLayout';

// ─── LAZY LOADED PAGES ───
// Each page only loads when the user navigates to it (code splitting)
const LandingPage = lazy(() => import('./pages/Landing/LandingPage').then(m => ({ default: m.LandingPage })));
const Login = lazy(() => import('./pages/Auth/Login').then(m => ({ default: m.Login })));
const Register = lazy(() => import('./pages/Auth/Register').then(m => ({ default: m.Register })));
const VerifyEmail = lazy(() => import('./pages/Auth/VerifyEmail').then(m => ({ default: m.VerifyEmail })));
const Onboarding = lazy(() => import('./pages/Onboarding/Onboarding').then(m => ({ default: m.Onboarding })));

// Dashboard pages
const DashboardHome = lazy(() => import('./pages/Dashboard/Home').then(m => ({ default: m.DashboardHome })));
const Notes = lazy(() => import('./pages/Notes/Notes').then(m => ({ default: m.Notes })));
const Assignments = lazy(() => import('./pages/Assignments/Assignments').then(m => ({ default: m.Assignments })));
const Announcements = lazy(() => import('./pages/Announcements/Announcements').then(m => ({ default: m.Announcements })));
const Calendar = lazy(() => import('./pages/Calendar/Calendar').then(m => ({ default: m.Calendar })));
const Profile = lazy(() => import('./pages/Profile/Profile').then(m => ({ default: m.Profile })));
const Settings = lazy(() => import('./pages/Settings/Settings').then(m => ({ default: m.Settings })));

// Static pages
const Features = lazy(() => import('./pages/Static/Features').then(m => ({ default: m.Features })));
const Integrations = lazy(() => import('./pages/Static/Integrations').then(m => ({ default: m.Integrations })));
const Help = lazy(() => import('./pages/Static/Help').then(m => ({ default: m.Help })));
const Community = lazy(() => import('./pages/Static/Community').then(m => ({ default: m.Community })));
const PrivacyPolicy = lazy(() => import('./pages/Static/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/Static/TermsOfService').then(m => ({ default: m.TermsOfService })));
const CookiePolicy = lazy(() => import('./pages/Static/CookiePolicy').then(m => ({ default: m.CookiePolicy })));
const About = lazy(() => import('./pages/Static/About').then(m => ({ default: m.About })));

// ─── LOADING FALLBACK ───
function LoadingSpinner() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#f8fafc'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '1rem'
      }}>
        <div style={{
          width: '40px',
          height: '40px',
          border: '4px solid #e0e7ff',
          borderTop: '4px solid #4f46e5',
          borderRadius: '50%',
          animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

// ─── MINI LOADING (for inside dashboard) ───
function MiniLoader() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '4rem 0'
    }}>
      <div style={{
        width: '32px',
        height: '32px',
        border: '3px solid #e0e7ff',
        borderTop: '3px solid #4f46e5',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function AppContent() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        {/* Public Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/onboarding" element={<Onboarding />} />

        {/* Static pages with shared layout */}
        <Route element={<StaticLayout />}>
          <Route path="/features" element={<Features />} />
          <Route path="/integrations" element={<Integrations />} />
          <Route path="/help" element={<Help />} />
          <Route path="/community" element={<Community />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Protected dashboard routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<Suspense fallback={<MiniLoader />}><DashboardHome /></Suspense>} />
          <Route path="/notes" element={<Suspense fallback={<MiniLoader />}><Notes /></Suspense>} />
          <Route path="/assignments" element={<Suspense fallback={<MiniLoader />}><Assignments /></Suspense>} />
          <Route path="/announcements" element={<Suspense fallback={<MiniLoader />}><Announcements /></Suspense>} />
          <Route path="/calendar" element={<Suspense fallback={<MiniLoader />}><Calendar /></Suspense>} />
          <Route path="/profile" element={<Suspense fallback={<MiniLoader />}><Profile /></Suspense>} />
          <Route path="/settings" element={<Suspense fallback={<MiniLoader />}><Settings /></Suspense>} />
        </Route>

        {/* Redirect unknown routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <HashRouter>
          <AppContent />
        </HashRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;
