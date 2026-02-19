import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Megaphone, Calendar, Plus, Trash2, User } from 'lucide-react';
import { subscribeToAnnouncements, addAnnouncement, deleteAnnouncementDoc } from '../../lib/firestore';
import { NotificationModal } from '../../components/NotificationModal';

export function Announcements() {
  const { user, userProfile } = useAuth();

  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', description: '', type: 'General' });
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [createdItemData, setCreatedItemData] = useState(null);

  // Real-time listener
  useEffect(() => {
    if (!userProfile) return;
    const unsubscribe = subscribeToAnnouncements(userProfile, (data) => {
      setAnnouncements(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userProfile]);

  const isOwner = (item) => {
    return user && item.userId === user.uid;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const announcementData = {
      ...formData,
      date: new Date().toLocaleDateString(),
      userId: user.uid,
      userName: user.displayName || userProfile?.name || 'Unknown',
      roleType: userProfile.roleType,
      institutionName: userProfile.institutionName,
      ...(userProfile.roleType === 'college'
        ? { department: userProfile.department, year: userProfile.year }
        : { standard: userProfile.standard, section: userProfile.section }),
    };

    try {
      const newId = await addAnnouncement(announcementData);
      setFormData({ title: '', description: '', type: 'General' });
      setShowForm(false);
      // Trigger notification modal
      setCreatedItemData({ ...announcementData, id: newId, title: announcementData.title });
      setShowNotificationModal(true);
    } catch (err) {
      console.error('Error adding announcement:', err);
      alert('Failed to post announcement.');
    }
  };

  const deleteAnnouncementItem = async (id) => {
    const item = announcements.find(a => a.id === id);
    if (item && !isOwner(item)) {
      alert('Only the creator can delete this announcement.');
      return;
    }
    try {
      await deleteAnnouncementDoc(id);
    } catch (err) {
      console.error('Error deleting announcement:', err);
      alert('Failed to delete announcement.');
    }
  };

  const typeColors = {
    General: { bg: '#eef2ff', color: '#4f46e5' },
    Urgent: { bg: '#fef2f2', color: '#dc2626' },
    Event: { bg: '#ecfdf5', color: '#059669' },
    Update: { bg: '#fff7ed', color: '#ea580c' },
  };

  return (
    <div className="announcements-page">
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => { setShowNotificationModal(false); setCreatedItemData(null); }}
        noteData={createdItemData}
        userProfile={userProfile}
        itemType="announcement"
        onConfirmSuccess={() => { setShowNotificationModal(false); setCreatedItemData(null); }}
      />
      <div className="page-header">
        <h1>Announcements</h1>
        <button className="btn-add" onClick={() => setShowForm(!showForm)}>
          <Plus size={18} />
          <span>New Announcement</span>
        </button>
      </div>

      {showForm && (
        <form className="add-form animate-fade-in" onSubmit={handleAdd}>
          <div className="form-row">
            <input
              type="text" placeholder="Title" required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
            <select
              value={formData.type}
              onChange={e => setFormData({ ...formData, type: e.target.value })}
            >
              <option>General</option>
              <option>Urgent</option>
              <option>Event</option>
              <option>Update</option>
            </select>
          </div>
          <textarea
            placeholder="Description..." required rows={3}
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
          />
          <div className="form-actions">
            <button type="submit" className="btn-save">Post</button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div className="announcements-list">
        {loading ? (
          <div className="empty-state">
            <div className="empty-icon"><Megaphone size={36} /></div>
            <h3>Loading announcements...</h3>
          </div>
        ) : announcements.length > 0 ? (
          announcements.map((item) => {
            const colors = typeColors[item.type] || typeColors.General;
            return (
              <div key={item.id} className="announcement-card animate-fade-in">
                <div className="accent-bar" style={{ background: colors.color }}></div>
                <div className="card-body">
                  <div className="card-top">
                    <div className="card-top-left">
                      <span className="type-badge" style={{ background: colors.bg, color: colors.color }}>{item.type}</span>
                      <span className="posted-by">
                        <User size={12} />
                        {isOwner(item) ? 'You' : (item.userName?.split(' ')[0] || 'Someone')}
                      </span>
                    </div>
                    <div className="card-meta">
                      <span className="date">
                        <Calendar size={14} />
                        {item.date}
                      </span>
                      {isOwner(item) && (
                        <button className="delete-btn" onClick={() => deleteAnnouncementItem(item.id)}>
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </div>
                  <h2>{item.title}</h2>
                  <p>{item.description}</p>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <Megaphone size={36} />
            </div>
            <h3>No announcements</h3>
            <p>Post your first announcement to get started.</p>
          </div>
        )}
      </div>

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.75rem;
        }

        h1 { font-size: 1.75rem; font-weight: 800; color: var(--color-text-main); }

        .btn-add {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1.25rem;
          background: var(--gradient-primary);
          color: white;
          border-radius: var(--radius-lg);
          font-weight: 600;
          font-size: 0.9rem;
          transition: all var(--transition-fast);
          box-shadow: var(--shadow-sm);
        }

        .btn-add:hover { transform: translateY(-2px); box-shadow: var(--shadow-md); }

        .add-form {
          background: white;
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          margin-bottom: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border: 1px solid var(--color-primary-bg);
        }

        .form-row { display: flex; gap: 0.75rem; }

        .add-form input, .add-form select, .add-form textarea {
          flex: 1;
          padding: 0.65rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          font-family: inherit;
          transition: border-color var(--transition-fast);
          resize: vertical;
        }

        .add-form input:focus, .add-form select:focus, .add-form textarea:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-actions { display: flex; gap: 0.5rem; }

        .btn-save {
          padding: 0.65rem 1.5rem;
          background: var(--color-primary);
          color: white;
          border-radius: var(--radius-md);
          font-weight: 600;
        }

        .btn-save:hover { background: var(--color-primary-dark); }

        .btn-cancel {
          padding: 0.65rem 1.25rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          font-weight: 500;
        }

        .announcements-list {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .announcement-card {
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          display: flex;
          overflow: hidden;
          transition: all var(--transition-fast);
        }

        .announcement-card:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-md);
        }

        .accent-bar {
          width: 5px;
          flex-shrink: 0;
        }

        .card-body {
          flex: 1;
          padding: 1.25rem 1.5rem;
        }

        .card-top {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.75rem;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .card-top-left {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .type-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .posted-by {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          color: var(--color-text-muted);
        }

        .card-meta {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .date {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.8rem;
          color: var(--color-text-muted);
        }

        .delete-btn {
          color: var(--color-text-muted);
          padding: 4px;
          border-radius: var(--radius-sm);
          transition: all var(--transition-fast);
        }

        .delete-btn:hover {
          background: #fef2f2;
          color: var(--color-danger);
        }

        h2 {
          font-size: 1.1rem;
          font-weight: 700;
          color: var(--color-text-main);
          margin-bottom: 0.4rem;
        }

        p {
          color: var(--color-text-muted);
          line-height: 1.6;
          font-size: 0.9rem;
        }

        .empty-state {
          background: white;
          padding: 3rem;
          border-radius: var(--radius-lg);
          border: 2px dashed var(--color-border);
          text-align: center;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .empty-icon {
          color: var(--color-text-muted);
          background: var(--color-primary-bg);
          padding: 1rem;
          border-radius: 50%;
          margin-bottom: 1rem;
        }

        .empty-state h3 { font-size: 1.1rem; color: var(--color-text-main); margin-bottom: 0.5rem; }
        .empty-state p { font-size: 0.9rem; }
      `}</style>
    </div>
  );
}
