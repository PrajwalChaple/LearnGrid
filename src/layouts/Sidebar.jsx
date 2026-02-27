import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  FileText,
  ClipboardList,
  Megaphone,
  Calendar,
  User,
  Settings,
  LogOut
} from 'lucide-react';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: FileText, label: 'Notes', path: '/notes' },
  { icon: ClipboardList, label: 'Assignments', path: '/assignments' },
  { icon: Megaphone, label: 'Announcements', path: '/announcements' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <div className="logo">
          <div className="logo-icon">
            <span>L</span>
          </div>
          <span className="logo-text">LearnGrid</span>
        </div>
      </div>

      <nav className="sidebar-nav">

        <span className="nav-section-label">GENERAL</span>
        {navItems.slice(0, 5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <div className="nav-icon-wrap">
              <item.icon size={18} strokeWidth={2.5} />
            </div>
            <span>{item.label}</span>
          </NavLink>
        ))}

        <span className="nav-section-label" style={{ marginTop: '1rem' }}>ACCOUNT</span>
        {navItems.slice(5).map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `nav-item ${isActive ? 'active' : ''}`
            }
            onClick={onClose}
          >
            <div className="nav-icon-wrap">
              <item.icon size={18} strokeWidth={2.5} />
            </div>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <button className="nav-item logout-btn" onClick={handleLogout}>
          <div className="nav-icon-wrap">
            <LogOut size={20} />
          </div>
          <span>Logout</span>
        </button>
      </div>

      <style jsx="true">{`
        .sidebar {
          width: 270px;
          height: 100vh;
          background: #f8fafc;
          border-right: 1px solid #e2e8f0;
          display: flex;
          flex-direction: column;
          position: fixed;
          left: 0;
          top: 0;
          z-index: 50;
          transition: transform var(--transition-normal);
          overflow: hidden;
        }

      .sidebar-header {
        padding: 1.5rem 1.5rem 1rem;
        }

      .logo {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        }

      .logo-icon {
        width: 32px;
        height: 32px;
        background: #2563eb;
        border-radius: 8px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-weight: 800;
        font-size: 1.2rem;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.2);
        }

      .logo-text {
        color: #0f172a;
        font-weight: 700;
        font-size: 1.2rem;
        letter-spacing: -0.5px;
        }

      .sidebar-nav {
        flex: 1;
        padding: 0.5rem 1rem;
        display: flex;
        flex-direction: column;
        gap: 2px;
        overflow-y: auto;
        }

      .nav-section-label {
        font-size: 0.7rem;
        font-weight: 700;
        color: #94a3b8;
        letter-spacing: 1.2px;
        padding: 1rem 0.75rem 0.5rem;
        text-transform: uppercase;
        margin-top: 0.5rem;
        }

      .nav-item {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        padding: 0.6rem 0.75rem;
        border-radius: 10px;
        color: #64748b;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
        text-decoration: none;
        font-weight: 600;
        font-size: 0.9rem;
        position: relative;
        border: 1px solid transparent;
        }

      .nav-icon-wrap {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s;
        }

      .nav-item:hover {
        color: #0f172a;
        background: #f1f5f9;
        }

      .nav-item.active {
        background: #e0e7ff;
        color: #312e81;
        font-weight: 700;
        }

      .sidebar-footer {
        padding: 1.5rem;
        border-top: 1px solid #f1f5f9;
        background: white;
        }

      .logout-btn {
        width: 100%;
        text-align: left;
        color: #ef4444;
        }

      .logout-btn:hover {
        background: rgba(220, 38, 38, 0.1);
      border-color: rgba(220, 38, 38, 0.2);
        }

      @media (max-width: 768px) {
          .sidebar {
        width: 80%;
      max-width: 320px;
      transform: translateX(-100%);
      box-shadow: none;
          }
      .sidebar.open {
        transform: translateX(0);
      box-shadow: 10px 0 24px rgba(0,0,0,0.2);
          }
        }
      `}</style>
    </aside >
  );
}
