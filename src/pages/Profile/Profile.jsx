import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Award, Edit, BookOpen, ClipboardList, Building2, GraduationCap } from 'lucide-react';
import { subscribeToNotes, subscribeToAssignments } from '../../lib/firestore';

export function Profile() {
  const { user, userProfile } = useAuth();

  const displayName = userProfile?.name || user?.displayName || 'Student';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

  const [notesCount, setNotesCount] = useState(0);
  const [assignmentsCount, setAssignmentsCount] = useState(0);
  const [completedCount, setCompletedCount] = useState(0);

  // Real-time stats from Firestore
  useEffect(() => {
    if (!userProfile) return;

    const unsubNotes = subscribeToNotes(userProfile, (data) => {
      setNotesCount(data.length);
    });

    const unsubAssignments = subscribeToAssignments(userProfile, (data) => {
      setAssignmentsCount(data.length);
      setCompletedCount(data.filter(a => a.status === 'Completed').length);
    });

    return () => {
      unsubNotes();
      unsubAssignments();
    };
  }, [userProfile]);

  return (
    <div className="profile-page">
      <div className="profile-header animate-fade-in">
        <div className="cover-photo">
          <div className="cover-shapes">
            <div className="cs cs1"></div>
            <div className="cs cs2"></div>
          </div>
        </div>
        <div className="profile-info-container">
          <div className="avatar-ring-lg">
            <div className="avatar-large">{initials}</div>
          </div>
          <div className="profile-details">
            <h1>{displayName}</h1>
            <p className="role">{userProfile?.roleType === 'college' ? 'College Student' : userProfile?.roleType === 'school' ? 'School Student' : 'Student'} • LearnGrid Member</p>
            {userProfile?.institutionName && (
              <p className="institution">{userProfile.institutionName}</p>
            )}
          </div>
          <button className="edit-btn">
            <Edit size={16} />
            Edit Profile
          </button>
        </div>
      </div>

      <div className="profile-content-grid">
        <div className="card info-card animate-fade-in">
          <h2>Personal Information</h2>
          <div className="info-list">
            <div className="info-item">
              <div className="icon-box"><User size={20} /></div>
              <div>
                <label>Full Name</label>
                <p>{displayName}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="icon-box"><Mail size={20} /></div>
              <div>
                <label>Email Address</label>
                <p>{user?.email || 'student@learngrid.com'}</p>
              </div>
            </div>
            <div className="info-item">
              <div className="icon-box"><Shield size={20} /></div>
              <div>
                <label>Roll Number</label>
                <p>{userProfile?.rollNumber || 'N/A'}</p>
              </div>
            </div>
            {userProfile?.roleType === 'college' && (
              <>
                <div className="info-item">
                  <div className="icon-box"><Building2 size={20} /></div>
                  <div>
                    <label>Department</label>
                    <p>{userProfile.department} — {userProfile.year} Year</p>
                  </div>
                </div>
              </>
            )}
            {userProfile?.roleType === 'school' && (
              <div className="info-item">
                <div className="icon-box"><GraduationCap size={20} /></div>
                <div>
                  <label>Class</label>
                  <p>{userProfile.standard} — Section {userProfile.section}</p>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card stats-card animate-fade-in">
          <h2>Academic Stats</h2>
          <div className="academic-grid">
            <div className="stat-box">
              <div className="stat-icon-sm" style={{ background: 'var(--gradient-primary)' }}><BookOpen size={18} color="white" /></div>
              <span className="stat-num">{notesCount}</span>
              <span className="stat-lbl">Notes</span>
            </div>
            <div className="stat-box">
              <div className="stat-icon-sm" style={{ background: 'var(--gradient-warm)' }}><ClipboardList size={18} color="white" /></div>
              <span className="stat-num">{assignmentsCount}</span>
              <span className="stat-lbl">Assignments</span>
            </div>
            <div className="stat-box">
              <div className="stat-icon-sm" style={{ background: 'var(--gradient-success)' }}><Award size={18} color="white" /></div>
              <span className="stat-num">{completedCount}</span>
              <span className="stat-lbl">Completed</span>
            </div>
            <div className="stat-box">
              <div className="stat-icon-sm" style={{ background: 'var(--gradient-cool)' }}><Shield size={18} color="white" /></div>
              <span className="stat-num">{assignmentsCount > 0 ? Math.round((completedCount / assignmentsCount) * 100) : 0}%</span>
              <span className="stat-lbl">Progress</span>
            </div>
          </div>
        </div>
      </div>

      <style jsx="true">{`
        .profile-page { max-width: 1000px; margin: 0 auto; }

        .profile-header {
          background: white;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          margin-bottom: var(--spacing-lg);
          position: relative;
        }

        .cover-photo {
          height: 200px;
          background: var(--gradient-hero);
          position: relative;
          overflow: hidden;
        }

        .cover-shapes { position: absolute; inset: 0; }
        .cs { position: absolute; border-radius: 50%; background: rgba(255,255,255,0.08); }
        .cs1 { width: 200px; height: 200px; top: -40px; right: -20px; }
        .cs2 { width: 120px; height: 120px; bottom: -30px; right: 100px; }

        .profile-info-container {
          padding: 0 2rem 2rem 2rem;
          display: flex;
          align-items: flex-end;
          gap: var(--spacing-lg);
          margin-top: -60px;
        }

        .avatar-ring-lg {
          padding: 3px;
          background: var(--gradient-primary);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .avatar-large {
          width: 110px;
          height: 110px;
          border-radius: 50%;
          background-color: white;
          color: var(--color-primary);
          border: 4px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 2.5rem;
          font-weight: 800;
          box-shadow: var(--shadow-md);
        }

        .profile-details { flex: 1; margin-bottom: 0.5rem; }

        h1 { font-size: 1.75rem; color: var(--color-text-main); margin-bottom: 0.25rem; font-weight: 800; }

        .role { color: var(--color-text-muted); font-size: 1rem; }

        .institution { color: var(--color-primary); font-size: 0.9rem; font-weight: 600; margin-top: 0.25rem; }

        .edit-btn {
          margin-bottom: 1rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-lg);
          font-weight: 600;
          color: var(--color-text-main);
          background: white;
          transition: all var(--transition-fast);
          font-size: 0.9rem;
        }

        .edit-btn:hover { background-color: var(--color-primary-bg); color: var(--color-primary); border-color: var(--color-primary); }

        .profile-content-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: var(--spacing-lg);
        }

        @media (max-width: 768px) {
          .profile-content-grid { grid-template-columns: 1fr; }
          .profile-info-container {
            flex-direction: column;
            align-items: center;
            text-align: center;
            margin-top: -60px;
          }
          .profile-details { margin-bottom: 1rem; }
          .edit-btn { margin-bottom: 0; }
        }

        .card {
          background: white;
          padding: 2rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
        }

        h2 {
          font-size: 1.1rem;
          margin-bottom: 1.5rem;
          color: var(--color-text-main);
          border-bottom: 1px solid var(--color-border);
          padding-bottom: 1rem;
          font-weight: 700;
        }

        .info-list { display: flex; flex-direction: column; gap: 1.5rem; }

        .info-item { display: flex; gap: 1rem; align-items: center; }

        .icon-box {
          width: 42px;
          height: 42px;
          background: var(--color-primary-bg);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--color-primary);
          flex-shrink: 0;
        }

        .info-item label {
          display: block;
          font-size: 0.8rem;
          color: var(--color-text-muted);
          margin-bottom: 0.15rem;
          font-weight: 500;
        }

        .info-item p { color: var(--color-text-main); font-weight: 600; }

        .academic-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .stat-box {
          background: var(--color-background);
          padding: 1.25rem;
          border-radius: var(--radius-lg);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          transition: all var(--transition-fast);
        }

        .stat-box:hover { transform: translateY(-3px); box-shadow: var(--shadow-sm); }

        .stat-icon-sm {
          width: 36px;
          height: 36px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-num { font-size: 1.5rem; font-weight: 800; color: var(--color-text-main); }

        .stat-lbl { font-size: 0.8rem; color: var(--color-text-muted); font-weight: 500; }
      `}</style>
    </div>
  );
}
