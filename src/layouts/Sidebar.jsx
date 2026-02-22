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
        <span className="nav-section-label">MENU</span>
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
              <item.icon size={20} />
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
              <item.icon size={20} />
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
      background: #1e1b4b; /* Solid dark color as base */
      background-image: linear-gradient(160deg, #1e1b4b 0%, #312e81 100%);
      display: flex;
      flex-direction: column;
      position: fixed;
      left: 0;
      top: 0;
      z-index: 50;
      transition: transform var(--transition-normal);
      overflow: hidden;
      box-shadow: 4px 0 24px rgba(0,0,0,0.15);
        }

      .sidebar-header {
        padding: 2rem 1.75rem 1.5rem;
        }

      .logo {
        display: flex;
      align-items: center;
      gap: 1rem;
        }

      .logo-icon {
        width: 42px;
      height: 42px;
      background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: 800;
      font-size: 1.4rem;
      box-shadow: 0 4px 12px rgba(99, 102, 241, 0.4);
        }

      .logo-text {
        color: white;
      font-weight: 700;
      font-size: 1.35rem;
      letter-spacing: -0.5px;
        }

      .sidebar-nav {
        flex: 1;
      padding: 0.5rem 1rem;
      display: flex;
      flex-direction: column;
      gap: 4px;
      overflow-y: auto;
        }

      .nav-section-label {
        font - size: 0.7rem;
      font-weight: 700;
      color: rgba(255,255,255,0.4);
      letter-spacing: 1.2px;
      padding: 1rem 0.75rem 0.5rem;
      text-transform: uppercase;
      margin-top: 0.5rem;
        }

      .nav-item {
        display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.8rem 1rem;
      border-radius: 12px;
      color: rgba(255,255,255,0.7);
      transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      text-decoration: none;
      font-weight: 500;
      font-size: 0.95rem;
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
        color: white;
      background: rgba(255,255,255,0.08);
      transform: translateX(4px);
        }

      .nav-item.active {
        background: linear-gradient(90deg, rgba(99, 102, 241, 0.15) 0%, rgba(99, 102, 241, 0.05) 100%);
      color: white;
      font-weight: 600;
      border: 1px solid rgba(99, 102, 241, 0.3);
      box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        }

      .nav-item.active .nav-icon-wrap {
        color: #a5b4fc;
      transform: scale(1.1);
        }

      .sidebar-footer {
        padding: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.08);
      background: rgba(0,0,0,0.1);
        }

      .logout-btn {
        width: 100%;
      text-align: left;
      color: #fca5a5;
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
