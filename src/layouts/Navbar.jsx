import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Menu } from 'lucide-react';

export function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const initials = user?.name ? user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';
  const firstName = user?.name?.split(' ')[0] || 'User';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="search-bar">
          <Search size={18} className="search-icon" />
          <input type="text" placeholder="Search courses, notes, assignments..." />
        </div>
      </div>

      <div className="navbar-right">
        <button className="icon-btn">
          <Bell size={20} />
          <span className="notification-dot"></span>
        </button>

        <div className="user-profile">
          <div className="user-info">
            <span className="user-name">{firstName}</span>
            <span className="user-role">{user?.role || 'Student'}</span>
          </div>
          <div className="avatar-ring">
            <div className="avatar">{initials}</div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .navbar {
          height: 70px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(229, 231, 235, 0.6);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 2rem;
          position: sticky;
          top: 0;
          z-index: 40;
        }

        .navbar-left {
          display: flex;
          align-items: center;
          gap: var(--spacing-md);
          flex: 1;
        }

        .menu-btn {
          display: none;
          color: var(--color-text-muted);
          padding: 8px;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .menu-btn:hover {
          background: var(--color-primary-bg);
          color: var(--color-primary);
        }

        .search-bar {
          position: relative;
          width: 100%;
          max-width: 420px;
        }

        .search-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--color-text-muted);
        }

        .search-bar input {
          width: 100%;
          padding: 0.65rem 1rem 0.65rem 2.75rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-full);
          background-color: var(--color-background);
          transition: all var(--transition-fast);
          font-size: 0.9rem;
          color: var(--color-text-main);
        }

        .search-bar input::placeholder {
          color: #9ca3af;
        }

        .search-bar input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          background-color: white;
        }

        .navbar-right {
          display: flex;
          align-items: center;
          gap: 1.25rem;
        }

        .icon-btn {
          position: relative;
          color: var(--color-text-muted);
          padding: 10px;
          border-radius: var(--radius-lg);
          transition: all var(--transition-fast);
          background: transparent;
        }

        .icon-btn:hover {
          background-color: var(--color-primary-bg);
          color: var(--color-primary);
        }

        .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 8px;
          height: 8px;
          background-color: var(--color-danger);
          border-radius: 50%;
          border: 2px solid white;
          animation: pulse-glow 2s infinite;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          padding: 4px 4px 4px 12px;
          border-radius: var(--radius-full);
          transition: all var(--transition-fast);
        }

        .user-profile:hover {
          background: var(--color-primary-bg);
        }

        .user-info {
          text-align: right;
          display: none;
        }

        .user-name {
          display: block;
          font-weight: 600;
          font-size: 0.9rem;
          color: var(--color-text-main);
        }

        .user-role {
          display: block;
          font-size: 0.75rem;
          color: var(--color-text-muted);
        }

        .avatar-ring {
          padding: 2px;
          border-radius: 50%;
          background: var(--gradient-primary);
        }

        .avatar {
          width: 36px;
          height: 36px;
          background: var(--color-surface);
          color: var(--color-primary);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 0.85rem;
          border: 2px solid white;
        }

        @media (min-width: 768px) {
          .user-info {
            display: block;
          }
        }

        @media (max-width: 768px) {
          .menu-btn {
            display: block;
          }
          .search-bar {
            display: none;
          }
          .navbar {
            padding: 0 1rem;
          }
        }
      `}</style>
    </header>
  );
}
