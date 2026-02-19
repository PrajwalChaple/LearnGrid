import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Menu } from 'lucide-react';
import { NotificationDropdown, useUnreadCount } from '../components/NotificationDropdown';

export function Navbar({ onMenuClick }) {
  const { user } = useAuth();
  const displayName = user?.displayName || user?.name || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const firstName = displayName.split(' ')[0];
  const [notifOpen, setNotifOpen] = useState(false);
  const unreadCount = useUnreadCount();

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
        <div className="notif-bell-wrapper">
          <button className="icon-btn" onClick={() => setNotifOpen(!notifOpen)}>
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="notification-badge">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
          <NotificationDropdown isOpen={notifOpen} onClose={() => setNotifOpen(false)} />
        </div>

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

      <style>{`
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

        .notif-bell-wrapper {
          position: relative;
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

        .notification-badge {
          position: absolute;
          top: 4px;
          right: 4px;
          min-width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #ef4444, #dc2626);
          color: white;
          border-radius: 20px;
          font-size: 0.6rem;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          border: 2px solid white;
          animation: badge-pop 0.3s ease-out;
        }

        @keyframes badge-pop {
          from { transform: scale(0); }
          50% { transform: scale(1.2); }
          to { transform: scale(1); }
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

