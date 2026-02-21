import React from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { StaticLayout } from './layouts/StaticLayout';
import { LandingPage } from './pages/Landing/LandingPage';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { VerifyEmail } from './pages/Auth/VerifyEmail';
import { DashboardHome } from './pages/Dashboard/Home';
import { Notes } from './pages/Notes/Notes';
import { Assignments } from './pages/Assignments/Assignments';
import { Announcements } from './pages/Announcements/Announcements';
import { Calendar } from './pages/Calendar/Calendar';
import { Profile } from './pages/Profile/Profile';
import { Settings } from './pages/Settings/Settings';
import { Features } from './pages/Static/Features';

import { Integrations } from './pages/Static/Integrations';
import { Blog } from './pages/Static/Blog';
import { Help } from './pages/Static/Help';
import { Community } from './pages/Static/Community';
import { PrivacyPolicy } from './pages/Static/PrivacyPolicy';
import { TermsOfService } from './pages/Static/TermsOfService';
import { CookiePolicy } from './pages/Static/CookiePolicy';
import { About } from './pages/Static/About';
import { Onboarding } from './pages/Onboarding/Onboarding';
import { AnimatePresence } from 'framer-motion';
import { PageTransition } from './components/PageTransition';
import { useLocation } from 'react-router-dom';

function AppContent() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Landing Page */}
        <Route path="/" element={<PageTransition><LandingPage /></PageTransition>} />

        {/* Auth Pages */}
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
        <Route path="/verify-email" element={<PageTransition><VerifyEmail /></PageTransition>} />
        <Route path="/onboarding" element={<PageTransition><Onboarding /></PageTransition>} />

        {/* Static pages with shared layout */}
        <Route element={<StaticLayout />}>
          <Route path="/features" element={<Features />} />

          <Route path="/integrations" element={<Integrations />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/help" element={<Help />} />
          <Route path="/community" element={<Community />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/about" element={<About />} />
        </Route>

        {/* Protected dashboard routes */}
        <Route element={<DashboardLayout />}>
          <Route path="/dashboard" element={<DashboardHome />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/assignments" element={<Assignments />} />
          <Route path="/announcements" element={<Announcements />} />
          <Route path="/calendar" element={<Calendar />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>

        {/* Redirect unknown routes to landing page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AnimatePresence>
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
