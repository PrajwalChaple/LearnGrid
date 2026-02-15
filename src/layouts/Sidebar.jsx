import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
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
  { icon: FileText, label: 'My Notes', path: '/notes' },
  { icon: ClipboardList, label: 'Assignments', path: '/assignments' },
  { icon: Megaphone, label: 'Announcements', path: '/announcements' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: User, label: 'Profile', path: '/profile' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function Sidebar({ isOpen, onClose }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
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
          background: var(--gradient-sidebar);
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
          width: 40px;
          height: 40px;
          background: rgba(255,255,255,0.15);
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-weight: 800;
          font-size: 1.25rem;
        }

        .logo-text {
          color: white;
          font-weight: 700;
          font-size: 1.35rem;
          letter-spacing: -0.5px;
        }

        .sidebar-nav {
          flex: 1;
          padding: 0.5rem 0.75rem;
          display: flex;
          flex-direction: column;
          gap: 2px;
          overflow-y: auto;
        }

        .nav-section-label {
          font-size: 0.7rem;
          font-weight: 600;
          color: rgba(255,255,255,0.35);
          letter-spacing: 1.5px;
          padding: 0.75rem 0.75rem 0.5rem;
          text-transform: uppercase;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.7rem 0.75rem;
          border-radius: 10px;
          color: rgba(255,255,255,0.6);
          transition: all var(--transition-fast);
          text-decoration: none;
          font-weight: 500;
          font-size: 0.95rem;
          position: relative;
        }

        .nav-icon-wrap {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          transition: all var(--transition-fast);
          flex-shrink: 0;
        }

        .nav-item:hover {
          color: white;
          background: rgba(255,255,255,0.08);
        }

        .nav-item:hover .nav-icon-wrap {
          background: rgba(255,255,255,0.1);
        }

        .nav-item.active {
          color: white;
          background: rgba(255,255,255,0.12);
        }

        .nav-item.active .nav-icon-wrap {
          background: var(--gradient-primary);
          color: white;
          box-shadow: 0 4px 12px rgb(99 102 241 / 0.4);
        }

        .nav-item.active::before {
          content: '';
          position: absolute;
          left: -0.75rem;
          top: 50%;
          transform: translateY(-50%);
          width: 4px;
          height: 24px;
          background: var(--color-primary-light);
          border-radius: 0 4px 4px 0;
        }

        .sidebar-footer {
          padding: 0.75rem;
          border-top: 1px solid rgba(255,255,255,0.08);
        }

        .logout-btn {
          width: 100%;
          text-align: left;
          color: rgba(255,255,255,0.5);
        }

        .logout-btn:hover {
          color: #fca5a5;
          background: rgba(239, 68, 68, 0.1);
        }

        .logout-btn:hover .nav-icon-wrap {
          background: rgba(239, 68, 68, 0.15);
          color: #fca5a5;
        }

        @media (max-width: 768px) {
          .sidebar {
            transform: translateX(-100%);
          }
          .sidebar.open {
            transform: translateX(0);
          }
        }
      `}</style>
    </aside>
  );
}
