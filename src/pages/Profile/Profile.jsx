import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { User, Mail, Shield, Building2, GraduationCap, Loader2, Pencil } from 'lucide-react';
import { saveUserProfile } from '../../lib/firestore';
import { uploadProfilePictureToCloudinary } from '../../lib/cloudinary';
import { updateAuthProfile } from '../../auth';

export function Profile() {
  const { user, userProfile, refreshProfile } = useAuth();

  const displayName = userProfile?.name || user?.displayName || 'Student';
  const initials = displayName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  const photoURL = userProfile?.photoURL || user?.photoURL || null;

  const [avatarUploading, setAvatarUploading] = useState(false);
  const fileInputRef = React.useRef(null);

  const handleAvatarClick = () => fileInputRef.current?.click();
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file || !user?.uid) return;
    if (!file.type.startsWith('image/')) return;
    e.target.value = '';
    setAvatarUploading(true);
    try {
      const url = await uploadProfilePictureToCloudinary(file, user.uid);
      await saveUserProfile(user.uid, { photoURL: url });
      await updateAuthProfile({ photoURL: url });
      await refreshProfile();
    } catch (err) {
      console.error('Avatar upload error:', err);
    } finally {
      setAvatarUploading(false);
    }
  };

  return (
    <div className="profile-page">
      <div className="profile-header animate-fade-in">
        <div className="profile-info-container">
          <div className="avatar-wrap">
            <div className="avatar-ring-lg">
              <div className="avatar-large">
                {photoURL ? (
                  <img src={photoURL} alt="" className="avatar-img" />
                ) : (
                  initials
                )}
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="avatar-file-input"
              onChange={handleAvatarChange}
            />
            <button
              type="button"
              className="avatar-edit-btn"
              onClick={handleAvatarClick}
              disabled={avatarUploading}
              aria-label="Change profile picture"
            >
              {avatarUploading ? <Loader2 size={14} className="spin" /> : <Pencil size={14} />}
            </button>
          </div>
          <div className="profile-details">
            <h1>{displayName}</h1>
            <p className="role">{userProfile?.roleType === 'college' ? 'College Student' : userProfile?.roleType === 'school' ? 'School Student' : 'Student'} • LearnGrid Member</p>
            {userProfile?.institutionName && (
              <p className="institution">{userProfile.institutionName}</p>
            )}
          </div>
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
      </div>

      <style jsx="true">{`
        .profile-page { max-width: 1000px; margin: 0 auto; }

        .profile-header {
          background: white;
          border-radius: var(--radius-xl);
          overflow: hidden;
          box-shadow: var(--shadow-sm);
          margin-bottom: 1.5rem;
          position: relative;
          border: 1px solid rgba(0,0,0,0.06);
        }

        .profile-info-container {
          padding: 1.5rem 2rem;
          display: flex;
          align-items: center;
          gap: 2rem;
        }

        .avatar-wrap {
          position: relative;
          flex-shrink: 0;
        }
        .avatar-file-input {
          position: absolute;
          width: 0;
          height: 0;
          opacity: 0;
          pointer-events: none;
        }
        .avatar-edit-btn {
          position: absolute;
          bottom: 4px;
          right: 4px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid white;
          background: var(--color-primary);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          box-shadow: var(--shadow-sm);
          transition: transform 0.15s, background 0.15s;
        }
        .avatar-edit-btn:hover:not(:disabled) {
          background: var(--color-primary);
          transform: scale(1.05);
        }
        .avatar-edit-btn:disabled {
          opacity: 0.8;
          cursor: wait;
        }
        .avatar-ring-lg {
          padding: 3px;
          background: var(--gradient-primary);
          border-radius: 50%;
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
          overflow: hidden;
        }
        .avatar-large .avatar-img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
        .avatar-edit-btn .spin { animation: avatar-spin 0.8s linear infinite; }
        @keyframes avatar-spin { to { transform: rotate(360deg); } }

        .profile-details {
          flex: 1;
          min-width: 0;
          text-align: left;
          margin-left: 0.25rem;
        }
        .profile-details h1,
        .profile-details .role,
        .profile-details .institution {
          margin: 0;
          padding: 0;
          display: block;
          line-height: 1.45;
        }
        .profile-details h1 {
          font-size: 1.75rem;
          color: var(--color-text-main);
          font-weight: 800;
          margin-bottom: 0.5rem;
        }
        .profile-details .role {
          color: var(--color-text-muted);
          font-size: 1rem;
          margin-bottom: 0.4rem;
        }
        .profile-details .institution {
          color: var(--color-primary);
          font-size: 0.9rem;
          font-weight: 600;
        }

        .profile-content-grid {
          display: block;
          margin-top: 0;
        }

        .profile-content-grid .card {
          border: 1px solid rgba(0,0,0,0.06);
          margin-top: 0;
        }

        @media (max-width: 768px) {
          .profile-info-container {
            flex-direction: column;
            align-items: center;
            text-align: center;
          }
          .profile-details { margin-bottom: 1rem; }
        }

        .card {
          background: white;
          padding: 2rem;
          border-radius: var(--radius-xl);
          box-shadow: var(--shadow-sm);
        }

        .card h2 {
          font-size: 1.1rem;
          margin: 0 0 1.5rem 0;
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
      `}</style>
    </div>
  );
}
