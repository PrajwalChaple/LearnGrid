import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { BookOpen, AlertCircle, Calendar, MessageSquare, ArrowRight, TrendingUp } from 'lucide-react';

const defaultStats = [
  { label: 'Total Notes', value: '0', icon: BookOpen, gradient: 'linear-gradient(135deg, #6366f1, #818cf8)', bg: '#eef2ff' },
  { label: 'Assignments', value: '0', icon: AlertCircle, gradient: 'linear-gradient(135deg, #f97316, #fb923c)', bg: '#fff7ed' },
  { label: 'Upcoming', value: '0', icon: Calendar, gradient: 'linear-gradient(135deg, #10b981, #34d399)', bg: '#ecfdf5' },
  { label: 'Announcements', value: '0', icon: MessageSquare, gradient: 'linear-gradient(135deg, #a855f7, #c084fc)', bg: '#faf5ff' },
];

export function DashboardHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [statsData, setStatsData] = useState(defaultStats);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem('learngrid_notes') || '[]');
    const savedAssignments = JSON.parse(localStorage.getItem('learngrid_assignments') || '[]');
    const savedAnnouncements = JSON.parse(localStorage.getItem('learngrid_announcements') || '[]');

    setStatsData([
      { ...defaultStats[0], value: savedNotes.length.toString() },
      { ...defaultStats[1], value: savedAssignments.length.toString() },
      { ...defaultStats[2], value: savedAssignments.filter(a => a.status === 'Pending').length.toString() },
      { ...defaultStats[3], value: savedAnnouncements.length.toString() },
    ]);

    const allActivities = [
      ...savedNotes.slice(0, 3).map(n => ({ id: 'n-' + n.id, title: `Uploaded: ${n.title}`, time: n.date, icon: BookOpen, path: '/notes' })),
      ...savedAssignments.slice(0, 3).map(a => ({ id: 'a-' + a.id, title: a.title, time: a.deadline, icon: AlertCircle, path: '/assignments' })),
      ...savedAnnouncements.slice(0, 2).map(a => ({ id: 'an-' + a.id, title: a.title, time: a.date, icon: MessageSquare, path: '/announcements' })),
    ].slice(0, 6);
    setActivities(allActivities);
  }, []);

  return (
    <div className="dashboard-home">
      <div className="welcome-banner animate-fade-in">
        <div className="welcome-content">
          <span className="welcome-tag">📚 Welcome back!</span>
          <h1>Hello, {user?.name?.split(' ')[0] || 'Student'}!</h1>
          <p>Ready to continue your learning journey? Check your progress below.</p>
        </div>
        <div className="banner-shapes">
          <div className="shape shape-1"></div>
          <div className="shape shape-2"></div>
          <div className="shape shape-3"></div>
        </div>
      </div>

      <div className="stats-grid">
        {statsData.map((stat, i) => (
          <div key={stat.label} className="stat-card animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
            <div className="stat-icon-wrap" style={{ background: stat.gradient }}>
              <stat.icon size={22} color="white" />
            </div>
            <div className="stat-info">
              <span className="stat-value">{stat.value}</span>
              <span className="stat-label">{stat.label}</span>
            </div>
            <TrendingUp size={16} className="stat-trend" />
          </div>
        ))}
      </div>

      <div className="section-grid">
        <div className="card recent-activity animate-fade-in">
          <div className="card-header">
            <h2>Recent Activity</h2>
            <button className="view-all" onClick={() => navigate('/notes')}>View All</button>
          </div>
          <div className="activity-list">
            {activities.length > 0 ? (
              activities.map((item) => (
                <div
                  key={item.id}
                  className="activity-item"
                  onClick={() => navigate(item.path)}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="activity-icon-container">
                    <item.icon size={18} />
                  </div>
                  <div className="activity-content">
                    <p className="activity-title">{item.title}</p>
                    <span className="activity-time">{item.time}</span>
                  </div>
                  <ArrowRight size={16} className="activity-arrow" />
                </div>
              ))
            ) : (
              <div className="empty-state">
                <p className="text-muted">Upload notes or add assignments to see activity here.</p>
              </div>
            )}
          </div>
        </div>

        <div className="card quick-links animate-fade-in">
          <div className="card-header">
            <h2>Quick Actions</h2>
          </div>
          <div className="quick-actions-list">
            <button className="quick-action-btn" onClick={() => navigate('/notes')}>
              <BookOpen size={20} />
              <span>Upload Note</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/assignments')}>
              <AlertCircle size={20} />
              <span>Add Assignment</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/announcements')}>
              <MessageSquare size={20} />
              <span>New Announcement</span>
            </button>
            <button className="quick-action-btn" onClick={() => navigate('/calendar')}>
              <Calendar size={20} />
              <span>View Calendar</span>
            </button>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .dashboard-home {
          display: flex;
          flex-direction: column;
          gap: 1.75rem;
        }

        .welcome-banner {
          background: var(--gradient-hero);
          color: white;
          padding: 2.5rem 2.5rem;
          border-radius: var(--radius-xl);
          position: relative;
          overflow: hidden;
          box-shadow: var(--shadow-lg);
        }

        .welcome-content { position: relative; z-index: 2; }

        .welcome-tag {
          display: inline-block;
          background: rgba(255,255,255,0.15);
          backdrop-filter: blur(8px);
          padding: 0.35rem 1rem;
          border-radius: var(--radius-full);
          font-size: 0.85rem;
          font-weight: 500;
          margin-bottom: 1rem;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .welcome-banner h1 {
          font-size: 2.25rem;
          font-weight: 800;
          margin-bottom: 0.5rem;
          letter-spacing: -0.5px;
        }

        .welcome-banner p {
          opacity: 0.85;
          font-size: 1.05rem;
          max-width: 450px;
        }

        .banner-shapes {
          position: absolute;
          top: 0; right: 0; bottom: 0;
          width: 50%;
          z-index: 1;
        }

        .shape {
          position: absolute;
          border-radius: 50%;
          opacity: 0.1;
          background: white;
        }

        .shape-1 { width: 200px; height: 200px; top: -40px; right: -20px; }
        .shape-2 { width: 120px; height: 120px; bottom: -30px; right: 80px; }
        .shape-3 { width: 80px; height: 80px; top: 30px; right: 160px; opacity: 0.06; }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1.25rem;
        }

        .stat-card {
          background: white;
          padding: 1.25rem 1.5rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          display: flex;
          align-items: center;
          gap: 1rem;
          transition: all var(--transition-fast);
          position: relative;
          overflow: hidden;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .stat-icon-wrap {
          width: 48px;
          height: 48px;
          border-radius: 14px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-info { display: flex; flex-direction: column; flex: 1; }

        .stat-value {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--color-text-main);
          line-height: 1.2;
        }

        .stat-label {
          color: var(--color-text-muted);
          font-size: 0.85rem;
          font-weight: 500;
        }

        .stat-trend {
          color: var(--color-success);
          opacity: 0.6;
        }

        .section-grid {
          display: grid;
          grid-template-columns: 1.5fr 1fr;
          gap: 1.25rem;
        }

        @media (max-width: 1024px) {
          .section-grid { grid-template-columns: 1fr; }
        }

        .card {
          background: white;
          border-radius: var(--radius-lg);
          padding: 1.5rem;
          box-shadow: var(--shadow-sm);
        }

        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.25rem;
        }

        .card-header h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-main);
        }

        .view-all {
          color: var(--color-primary);
          font-size: 0.85rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .view-all:hover { text-decoration: underline; }

        .activity-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 0;
          border-bottom: 1px solid var(--color-border);
          transition: all var(--transition-fast);
        }

        .activity-item:hover {
          background: var(--color-primary-bg);
          padding-left: 0.75rem;
          padding-right: 0.75rem;
          margin: 0 -0.75rem;
          border-radius: var(--radius-md);
          border-bottom-color: transparent;
        }

        .activity-item:last-child { border-bottom: none; }

        .activity-icon-container {
          width: 38px;
          height: 38px;
          background: var(--color-primary-bg);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .activity-item:hover .activity-icon-container {
          background: var(--gradient-primary);
          color: white;
        }

        .activity-content { flex: 1; }

        .activity-title {
          font-weight: 600;
          color: var(--color-text-main);
          font-size: 0.9rem;
          margin-bottom: 0.15rem;
        }

        .activity-time {
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .activity-arrow {
          color: var(--color-text-muted);
          opacity: 0;
          transform: translateX(-8px);
          transition: all var(--transition-fast);
        }

        .activity-item:hover .activity-arrow {
          opacity: 1;
          transform: translateX(0);
        }

        .quick-actions-list {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .quick-action-btn {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.8rem 1rem;
          border-radius: var(--radius-md);
          background: var(--color-background);
          color: var(--color-text-main);
          font-weight: 500;
          font-size: 0.9rem;
          transition: all var(--transition-fast);
          border: 1px solid transparent;
        }

        .quick-action-btn:hover {
          background: var(--color-primary-bg);
          border-color: var(--color-primary);
          color: var(--color-primary);
          transform: translateX(4px);
        }

        .empty-state {
          padding: 2rem 0;
          text-align: center;
          color: var(--color-text-muted);
        }
      `}</style>
    </div>
  );
}
