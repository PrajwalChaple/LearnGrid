import React, { Suspense, lazy } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layouts — eagerly loaded (small, shared across many routes)
import { DashboardLayout } from './layouts/DashboardLayout';
import { StaticLayout } from './layouts/StaticLayout';

// ─── AUTH PAGES — EAGERLY LOADED (critical, must render instantly) ───
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { VerifyEmail } from './pages/Auth/VerifyEmail';
import { Onboarding } from './pages/Onboarding/Onboarding';

// ─── LAZY LOADED PAGES (only load when user visits) ───
const LandingPage = lazy(() => import('./pages/Landing/LandingPage').then(m => ({ default: m.LandingPage })));

// Dashboard pages
const DashboardHome = lazy(() => import('./pages/Dashboard/Home').then(m => ({ default: m.DashboardHome })));
const Notes = lazy(() => import('./pages/Notes/Notes').then(m => ({ default: m.Notes })));
const Assignments = lazy(() => import('./pages/Assignments/Assignments').then(m => ({ default: m.Assignments })));
const Announcements = lazy(() => import('./pages/Announcements/Announcements').then(m => ({ default: m.Announcements })));
const Calendar = lazy(() => import('./pages/Calendar/Calendar').then(m => ({ default: m.Calendar })));
const Profile = lazy(() => import('./pages/Profile/Profile').then(m => ({ default: m.Profile })));
const Settings = lazy(() => import('./pages/Settings/Settings').then(m => ({ default: m.Settings })));
const AIBuddyPage = lazy(() => import('./pages/AIBuddy/AIBuddy').then(m => ({ default: m.AIBuddy })));

// Static pages
const Features = lazy(() => import('./pages/Static/Features').then(m => ({ default: m.Features })));
const Pricing = lazy(() => import('./pages/Static/Pricing').then(m => ({ default: m.Pricing })));
const Integrations = lazy(() => import('./pages/Static/Integrations').then(m => ({ default: m.Integrations })));
const Help = lazy(() => import('./pages/Static/Help').then(m => ({ default: m.Help })));
const Community = lazy(() => import('./pages/Static/Community').then(m => ({ default: m.Community })));
const PrivacyPolicy = lazy(() => import('./pages/Static/PrivacyPolicy').then(m => ({ default: m.PrivacyPolicy })));
const TermsOfService = lazy(() => import('./pages/Static/TermsOfService').then(m => ({ default: m.TermsOfService })));
const CookiePolicy = lazy(() => import('./pages/Static/CookiePolicy').then(m => ({ default: m.CookiePolicy })));
const About = lazy(() => import('./pages/Static/About').then(m => ({ default: m.About })));

// ─── ERROR BOUNDARY (catch lazy loading failures gracefully) ───
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh', display: 'flex', alignItems: 'center',
          justifyContent: 'center', backgroundColor: '#f8fafc',
          flexDirection: 'column', gap: '1rem', padding: '2rem', textAlign: 'center'
        }}>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>Something went wrong. Please check your connection.</p>
          <button
            onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
            style={{
              padding: '0.6rem 1.5rem', backgroundColor: '#4f46e5', color: '#fff',
              border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '0.9rem', fontWeight: 600
            }}
          >Retry</button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── LOADING FALLBACK ───
function LoadingSpinner() {
  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', backgroundColor: '#f8fafc'
    }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
        <div style={{
          width: '40px', height: '40px', border: '4px solid #e0e7ff',
          borderTop: '4px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
        }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    </div>
  );
}

// ─── MINI LOADING (for inside dashboard) ───
function MiniLoader() {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '4rem 0' }}>
      <div style={{
        width: '32px', height: '32px', border: '3px solid #e0e7ff',
        borderTop: '3px solid #4f46e5', borderRadius: '50%', animation: 'spin 0.8s linear infinite'
      }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}

function AppContent() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<LoadingSpinner />}>
        <Routes>
          {/* Public Landing Page */}
          <Route path="/" element={<LandingPage />} />

          {/* Auth Pages — eagerly loaded, no white screen */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Static pages with shared layout */}
          <Route element={<StaticLayout />}>
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
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
            <Route path="/ai-buddy" element={<Suspense fallback={<MiniLoader />}><AIBuddyPage /></Suspense>} />
          </Route>

          {/* Redirect unknown routes to landing page */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

