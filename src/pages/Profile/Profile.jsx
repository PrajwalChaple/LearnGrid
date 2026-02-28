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
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [editSaving, setEditSaving] = useState(false);
  const [editError, setEditError] = useState('');
  const fileInputRef = React.useRef(null);

  const handleEditClick = () => {
    const edits = userProfile?.editCount || 0;
    if (edits >= 2) {
      alert("You have reached the maximum limit of 2 profile edits. Please contact the administrator/support for further changes.");
      return;
    }
    setEditForm({
      name: userProfile?.name || user?.displayName || '',
      institutionName: userProfile?.institutionName || '',
      standard: userProfile?.standard || '',
      department: userProfile?.department || '',
      year: userProfile?.year || '',
      section: userProfile?.section || '',
      rollNumber: userProfile?.rollNumber || ''
    });
    setEditError('');
    setShowEditModal(true);
  };

  const handleEditSave = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    setEditSaving(true);
    setEditError('');
    try {
      const updatedData = {
        name: editForm.name.trim(),
        institutionName: editForm.institutionName.toUpperCase().trim(),
        rollNumber: editForm.rollNumber.toUpperCase().trim(),
        editCount: (userProfile?.editCount || 0) + 1
      };
      if (userProfile?.roleType === 'school') {
        updatedData.standard = editForm.standard;
        updatedData.section = editForm.section.toUpperCase().trim();
      } else {
        updatedData.department = editForm.department.toUpperCase().trim();
        updatedData.year = editForm.year;
        updatedData.section = editForm.section.toUpperCase().trim();
      }
      await saveUserProfile(user.uid, updatedData);
      if (updatedData.name !== user?.displayName) {
        await updateAuthProfile({ displayName: updatedData.name });
      }
      await refreshProfile();
      setShowEditModal(false);
    } catch (err) {
      console.error('Profile edit error:', err);
      setEditError('Failed to save profile details. Please try again.');
    } finally {
      setEditSaving(false);
    }
  };

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
          <div className="edit-header-wrap">
            <h2>Personal Information</h2>
            <button type="button" className="edit-header-btn" onClick={handleEditClick}>
              <Pencil size={16} /> Edit Details
            </button>
          </div>
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
                {userProfile?.section && (
                  <div className="info-item">
                    <div className="icon-box"><GraduationCap size={20} /></div>
                    <div>
                      <label>Section</label>
                      <p>{userProfile.section}</p>
                    </div>
                  </div>
                )}
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

      {showEditModal && editForm && (
        <div className="modal-overlay" onClick={() => !editSaving && setShowEditModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Edit Profile Details</h3>
              <p className="subtitle">You can edit your details a maximum of 2 times. ({(userProfile?.editCount || 0)}/2 used)</p>
            </div>
            <form onSubmit={handleEditSave} className="edit-form">
              {editError && <div className="error-banner">{editError}</div>}

              <div className="form-group">
                <label>Full Name</label>
                <input type="text" value={editForm.name} onChange={e => setEditForm({ ...editForm, name: e.target.value })} required className="input" />
              </div>

              <div className="form-group">
                <label>Institution Name</label>
                <input type="text" value={editForm.institutionName} onChange={e => setEditForm({ ...editForm, institutionName: e.target.value })} required className="input uppercase" />
              </div>

              {userProfile?.roleType === 'school' ? (
                <div className="grid-2">
                  <div className="form-group">
                    <label>Standard</label>
                    <select value={editForm.standard} onChange={e => setEditForm({ ...editForm, standard: e.target.value })} required className="input bg-white">
                      <option value="">Select</option>
                      {['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th', '10th', '11th', '12th'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Section</label>
                    <input type="text" value={editForm.section} onChange={e => setEditForm({ ...editForm, section: e.target.value })} required className="input uppercase" />
                  </div>
                </div>
              ) : (
                <div className="grid-2">
                  <div className="form-group">
                    <label>Department</label>
                    <input type="text" value={editForm.department} onChange={e => setEditForm({ ...editForm, department: e.target.value })} required className="input uppercase" />
                  </div>
                  <div className="form-group">
                    <label>Year</label>
                    <select value={editForm.year} onChange={e => setEditForm({ ...editForm, year: e.target.value })} required className="input bg-white">
                      <option value="">Select</option>
                      {['1st', '2nd', '3rd', '4th'].map(y => <option key={y} value={y}>{y} Year</option>)}
                    </select>
                  </div>
                </div>
              )}

              <div className="grid-2">
                {userProfile?.roleType === 'college' && (
                  <div className="form-group">
                    <label>Section</label>
                    <input type="text" value={editForm.section} onChange={e => setEditForm({ ...editForm, section: e.target.value })} required className="input uppercase" />
                  </div>
                )}
                <div className="form-group" style={userProfile?.roleType === 'school' ? { gridColumn: '1 / -1' } : {}}>
                  <label>Class Roll Number</label>
                  <input type="text" value={editForm.rollNumber} onChange={e => setEditForm({ ...editForm, rollNumber: e.target.value })} required className="input uppercase" />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowEditModal(false)} disabled={editSaving}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={editSaving}>
                  {editSaving ? <Loader2 size={16} className="spin" /> : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
          color: var(--color-text-main);
          font-weight: 700;
        }

        .edit-header-wrap {
          display: flex;
          align-items: center;
          width: 100%;
          border-bottom: 1px solid var(--color-border);
          margin: 0 0 1.5rem 0;
          padding-bottom: 1rem;
        }
        
        .edit-header-btn {
          margin-left: auto;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: var(--color-surface);
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-main);
          font-weight: 500;
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .edit-header-btn:hover {
          border-color: var(--color-primary);
          color: var(--color-primary);
          background: var(--color-primary-bg);
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

        .modal-overlay {
          position: fixed; inset: 0; background: rgba(0,0,0,0.4); backdrop-filter: blur(4px);
          display: flex; align-items: center; justify-content: center; z-index: 100; padding: 1rem;
        }
        .modal-card {
          background: var(--color-surface); border-radius: var(--radius-xl); padding: 1.5rem 2rem;
          max-width: 500px; width: 100%; box-shadow: 0 20px 60px rgba(0,0,0,0.2); border: 1px solid var(--color-border);
        }
        .modal-header h3 { margin: 0 0 0.25rem 0; font-size: 1.25rem; color: var(--color-text-main); }
        .modal-header .subtitle { margin: 0 0 1.5rem 0; font-size: 0.85rem; color: var(--color-text-muted); }
        .error-banner { background: #fef2f2; color: #b91c1c; border: 1px solid #fecaca; padding: 0.75rem 1rem; border-radius: var(--radius-md); margin-bottom: 1rem; font-size: 0.9rem; }
        .form-group { margin-bottom: 1rem; }
        .form-group label { display: block; font-size: 0.85rem; font-weight: 600; color: var(--color-text-muted); margin-bottom: 0.4rem; }
        .form-group .input { width: 100%; padding: 0.65rem 1rem; border: 1px solid var(--color-border); border-radius: var(--radius-md); font-size: 0.95rem; background: var(--color-surface); color: var(--color-text-main); transition: all 0.2s; }
        .form-group .input:focus { outline: none; border-color: var(--color-primary); box-shadow: 0 0 0 3px var(--color-primary-bg); }
        .form-group .uppercase { text-transform: uppercase; }
        .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .modal-actions { display: flex; gap: 0.75rem; justify-content: flex-end; margin-top: 1.5rem; padding-top: 1rem; border-top: 1px solid var(--color-border); }
        .btn-secondary { padding: 0.6rem 1.2rem; border-radius: var(--radius-md); border: 1px solid var(--color-border); background: var(--color-surface); color: var(--color-text-main); font-weight: 600; cursor: pointer; font-size: 0.9rem; }
        .btn-secondary:hover:not(:disabled) { background: var(--color-primary-bg); border-color: var(--color-primary); color: var(--color-primary); }
        .btn-primary { padding: 0.6rem 1.2rem; border-radius: var(--radius-md); border: none; background: var(--gradient-primary); color: white; font-weight: 600; cursor: pointer; font-size: 0.9rem; display: inline-flex; align-items: center; gap: 0.5rem; }
        .btn-primary:hover:not(:disabled) { opacity: 0.95; }
        .btn-primary:disabled, .btn-secondary:disabled { opacity: 0.7; cursor: not-allowed; }
      `}</style>
    </div>
  );
}
