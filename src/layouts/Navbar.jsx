import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, Menu, User, LogOut, Settings, BookOpen, AlertCircle, MessageSquare } from 'lucide-react';
import { NotificationDropdown, useUnreadCount } from '../components/NotificationDropdown';
import { subscribeToNotes, subscribeToAssignments, subscribeToAnnouncements } from '../lib/firestore';

const SEARCH_FILTERS = [
  { key: 'all', label: 'All', icon: Search },
  { key: 'notes', label: 'Notes', icon: BookOpen },
  { key: 'assignments', label: 'Assignments', icon: AlertCircle },
  { key: 'announcements', label: 'Announcements', icon: MessageSquare },
];

export function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const { user, userProfile, logout } = useAuth();
  const displayName = userProfile?.name || user?.displayName || user?.name || 'User';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const firstName = displayName.split(' ')[0];
  const photoURL = userProfile?.photoURL || user?.photoURL || null;
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const profileMenuRef = useRef(null);
  const unreadCount = useUnreadCount();

  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFilter, setSearchFilter] = useState('all');
  const searchBarRef = useRef(null);
  const [notes, setNotes] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [announcements, setAnnouncements] = useState([]);

  useEffect(() => {
    if (!userProfile) return;
    const unsubNotes = subscribeToNotes(userProfile, setNotes);
    const unsubAssignments = subscribeToAssignments(userProfile, setAssignments);
    const unsubAnnouncements = subscribeToAnnouncements(userProfile, setAnnouncements);
    return () => {
      unsubNotes();
      unsubAssignments();
      unsubAnnouncements();
    };
  }, [userProfile]);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const matchText = (text) => !q || (text && String(text).toLowerCase().includes(q));
    const list = [];
    const noteLabel = (n) => (n.title && n.subject ? `${n.title} (${n.subject})` : (n.title || n.subject));
    const assignmentLabel = (a) => (a.title && a.subject ? `${a.title} (${a.subject})` : (a.title || a.subject));

    if (searchFilter === 'all' || searchFilter === 'notes') {
      notes
        .filter((n) =>
          matchText(n.title) ||
          matchText(n.subject) ||
          matchText(n.description) ||
          matchText(n.fileName)
        )
        .forEach((n) =>
          list.push({
            type: 'note',
            id: n.id,
            title: noteLabel(n),
            path: '/notes',
          })
        );
    }

    if (searchFilter === 'all' || searchFilter === 'assignments') {
      assignments
        .filter((a) =>
          matchText(a.title) ||
          matchText(a.subject)
        )
        .forEach((a) =>
          list.push({
            type: 'assignment',
            id: a.id,
            title: assignmentLabel(a),
            path: '/assignments',
          })
        );
    }

    if (searchFilter === 'all' || searchFilter === 'announcements') {
      announcements
        .filter((a) => matchText(a.title))
        .forEach((a) =>
          list.push({
            type: 'announcement',
            id: a.id,
            title: a.title,
            path: '/announcements',
          })
        );
    }

    return list.slice(0, 20);
  }, [searchQuery, searchFilter, notes, assignments, announcements]);

  useEffect(() => {
    if (!profileMenuOpen) return;
    const handleClick = (e) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setProfileMenuOpen(false);
      }
    };
    const timer = setTimeout(() => document.addEventListener('mousedown', handleClick), 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
    };
  }, [profileMenuOpen]);

  useEffect(() => {
    if (!searchOpen) return;
    const handleClick = (e) => {
      if (searchBarRef.current && !searchBarRef.current.contains(e.target)) {
        setSearchOpen(false);
      }
    };
    const handleKey = (e) => {
      if (e.key === 'Escape') setSearchOpen(false);
    };
    const timer = setTimeout(() => {
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('keydown', handleKey);
    }, 50);
    return () => {
      clearTimeout(timer);
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('keydown', handleKey);
    };
  }, [searchOpen]);

  return (
    <header className="navbar">
      <div className="navbar-left">
        <button className="menu-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
        <div className="search-bar-wrapper" ref={searchBarRef}>
          <div className="search-bar">
            <Search size={18} className="search-icon" />
            <input
              type="text"
              placeholder="Search courses, notes, assignments..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => setSearchOpen(true)}
            />
          </div>
          {searchOpen && (
            <div className="search-dropdown">
              <div className="search-dropdown-filters">
                {SEARCH_FILTERS.map(({ key, label, icon: Icon }) => (
                  <button
                    key={key}
                    type="button"
                    className={`search-filter-chip ${searchFilter === key ? 'active' : ''}`}
                    onClick={() => setSearchFilter(key)}
                  >
                    <Icon size={14} />
                    {label}
                  </button>
                ))}
              </div>
              <div className="search-dropdown-results">
                {searchQuery.trim() ? (
                  searchResults.length > 0 ? (
                    searchResults.map((item) => (
                      <button
                        key={`${item.type}-${item.id}`}
                        type="button"
                        className="search-result-item"
                        onClick={() => {
                          setSearchOpen(false);
                          setSearchQuery('');
                          navigate(item.path);
                        }}
                      >
                        {item.type === 'note' && <BookOpen size={16} className="search-result-icon notes" />}
                        {item.type === 'assignment' && <AlertCircle size={16} className="search-result-icon assignments" />}
                        {item.type === 'announcement' && <MessageSquare size={16} className="search-result-icon announcements" />}
                        <span className="search-result-title">{item.title}</span>
                      </button>
                    ))
                  ) : (
                    <p className="search-dropdown-empty">No results for &quot;{searchQuery}&quot;</p>
                  )
                ) : (
                  <p className="search-dropdown-empty">Type to search notes, assignments, and announcements</p>
                )}
              </div>
            </div>
          )}
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

        <div className="user-profile-wrapper" ref={profileMenuRef}>
          <button
            type="button"
            className="user-profile"
            onClick={() => setProfileMenuOpen(!profileMenuOpen)}
            aria-expanded={profileMenuOpen}
            aria-haspopup="true"
          >
            <div className="user-info">
              <span className="user-name">{firstName}</span>
              <span className="user-role">{user?.role || 'Student'}</span>
            </div>
            <div className="avatar-ring">
              <div className="avatar">
                {photoURL ? <img src={photoURL} alt="" className="navbar-avatar-img" /> : initials}
              </div>
            </div>
          </button>
          {profileMenuOpen && (
            <div className="user-profile-dropdown">
              <Link
                to="/profile"
                className="user-profile-dropdown-item"
                onClick={() => setProfileMenuOpen(false)}
              >
                <User size={18} />
                My Profile
              </Link>
              <Link
                to="/settings"
                className="user-profile-dropdown-item"
                onClick={() => setProfileMenuOpen(false)}
              >
                <Settings size={18} />
                Settings
              </Link>
              <button
                type="button"
                className="user-profile-dropdown-item user-profile-dropdown-item-logout"
                onClick={async () => {
                  setProfileMenuOpen(false);
                  await logout();
                }}
              >
                <LogOut size={18} />
                Log out
              </button>
            </div>
          )}
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

        .search-bar-wrapper {
          position: relative;
          width: 100%;
          max-width: 420px;
        }
        .search-bar {
          position: relative;
          width: 100%;
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
        .search-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.06);
          z-index: 50;
          overflow: hidden;
          animation: search-dropdown-in 0.2s ease;
        }
        @keyframes search-dropdown-in {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .search-dropdown-filters {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          padding: 0.75rem 1rem;
          border-bottom: 1px solid var(--color-border);
          background: var(--color-background);
        }
        .search-filter-chip {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.75rem;
          border-radius: var(--radius-full);
          border: 1px solid var(--color-border);
          background: white;
          font-size: 0.8rem;
          font-weight: 500;
          color: var(--color-text-muted);
          cursor: pointer;
          transition: all 0.15s;
        }
        .search-filter-chip:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
        }
        .search-filter-chip.active {
          background: var(--color-primary);
          border-color: var(--color-primary);
          color: white;
        }
        .search-dropdown-results {
          max-height: 320px;
          overflow-y: auto;
          padding: 0.5rem;
        }
        .search-result-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          width: 100%;
          padding: 0.6rem 0.75rem;
          border: none;
          border-radius: var(--radius-md);
          background: none;
          font-size: 0.9rem;
          color: var(--color-text-main);
          cursor: pointer;
          text-align: left;
          transition: background 0.15s;
        }
        .search-result-item:hover {
          background: var(--color-primary-bg);
        }
        .search-result-icon {
          flex-shrink: 0;
          color: var(--color-text-muted);
        }
        .search-result-icon.notes { color: #6366f1; }
        .search-result-icon.assignments { color: #f59e0b; }
        .search-result-icon.announcements { color: #8b5cf6; }
        .search-result-title {
          flex: 1;
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .search-dropdown-empty {
          padding: 1rem 0.75rem;
          margin: 0;
          font-size: 0.875rem;
          color: var(--color-text-muted);
          text-align: center;
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

        .user-profile-wrapper {
          position: relative;
        }

        .user-profile {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          cursor: pointer;
          padding: 4px 4px 4px 12px;
          border-radius: var(--radius-full);
          transition: all var(--transition-fast);
          border: none;
          background: transparent;
          font: inherit;
          color: inherit;
        }

        .user-profile:hover {
          background: var(--color-primary-bg);
        }

        .user-profile-dropdown {
          position: absolute;
          top: calc(100% + 6px);
          right: 0;
          min-width: 180px;
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: 0 10px 40px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.05);
          padding: 0.5rem;
          z-index: 50;
          animation: profile-dropdown-in 0.2s ease;
        }
        @keyframes profile-dropdown-in {
          from { opacity: 0; transform: translateY(-4px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .user-profile-dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.6rem;
          width: 100%;
          padding: 0.6rem 0.75rem;
          border-radius: var(--radius-md);
          border: none;
          background: none;
          font-size: 0.9rem;
          font-weight: 500;
          color: var(--color-text-main);
          cursor: pointer;
          text-decoration: none;
          transition: background 0.15s;
          text-align: left;
        }
        .user-profile-dropdown-item:hover {
          background: var(--color-primary-bg);
          color: var(--color-primary);
        }
        .user-profile-dropdown-item-logout:hover {
          background: #fef2f2;
          color: #b91c1c;
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
          overflow: hidden;
        }
        .navbar-avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
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
          .search-bar-wrapper {
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

