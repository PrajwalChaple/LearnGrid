import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { DashboardLayout } from './layouts/DashboardLayout';
import { Login } from './pages/Auth/Login';
import { Register } from './pages/Auth/Register';
import { DashboardHome } from './pages/Dashboard/Home';
import { Notes } from './pages/Notes/Notes';
import { Assignments } from './pages/Assignments/Assignments';
import { Announcements } from './pages/Announcements/Announcements';
import { Calendar } from './pages/Calendar/Calendar';
import { Profile } from './pages/Profile/Profile';
import { Settings } from './pages/Settings/Settings';

// Redirects root "/" to /dashboard (if logged in) or /login (if not)
function AuthRedirect() {
  const { user } = useAuth();
  return user ? <Navigate to="/dashboard" replace /> : <Navigate to="/login" replace />;
}

function App() {
  return (
    <AuthProvider>
      <HashRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Root path: immediately redirect based on auth state */}
          <Route path="/" element={<AuthRedirect />} />

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

          {/* Redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </HashRouter>
    </AuthProvider>
  );
}

export default App;
