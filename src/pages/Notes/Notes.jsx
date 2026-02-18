import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, Calendar, Eye, Trash2, Upload, User, Loader2 } from 'lucide-react';
import { subscribeToNotes, addNote, deleteNoteDoc } from '../../lib/firestore';
import { NotificationModal } from '../../components/NotificationModal';

export function Notes() {
  const { user, userProfile } = useAuth();

  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [uploadedNoteData, setUploadedNoteData] = useState(null);
  const fileInputRef = React.useRef(null);

  // Real-time listener — notes auto-sync from Firestore
  useEffect(() => {
    if (!userProfile) return;
    setLoading(true);
    const unsubscribe = subscribeToNotes(userProfile, (data) => {
      console.log('[Notes] Received', data.length, 'notes from Firestore');
      setNotes(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userProfile]);

  const isOwner = (note) => {
    return user && note.userId === user.uid;
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }

    // 700KB limit: base64 adds ~33% overhead, keeping total under Firestore's 1MB doc limit
    if (file.size > 700 * 1024) {
      alert('File size must be less than 700KB.');
      return;
    }

    setUploading(true);

    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const base64Content = event.target.result;
        console.log('[Notes] Base64 size:', Math.round(base64Content.length / 1024), 'KB');

        const noteData = {
          title: file.name.replace('.pdf', ''),
          subject: 'PDF Upload',
          date: new Date().toISOString(),
          content: base64Content,
          type: 'pdf',
          userId: user.uid,
          userName: user.displayName || userProfile?.name || 'Unknown',
          // Class isolation fields
          roleType: userProfile.roleType || '',
          institutionName: userProfile.institutionName || '',
          ...(userProfile.roleType === 'college'
            ? {
              department: userProfile.department || '',
              year: userProfile.year || '',
            }
            : {
              standard: userProfile.standard || '',
              section: userProfile.section || '',
            }),
        };

        console.log('[Notes] Saving note with fields:', {
          roleType: noteData.roleType,
          institutionName: noteData.institutionName,
          department: noteData.department,
          year: noteData.year,
          standard: noteData.standard,
          section: noteData.section,
        });

        const newNoteId = await addNote(noteData);
        console.log('[Notes] Note saved successfully with ID:', newNoteId);

        // Trigger Notification Modal
        setUploadedNoteData({ ...noteData, id: newNoteId });
        setShowNotificationModal(true);
      } catch (err) {
        console.error('[Notes] Error adding note:', err);
        alert('Failed to upload note: ' + (err.code || err.message || 'Unknown error'));
      } finally {
        setUploading(false);
      }
    };
    reader.onerror = () => {
      alert('Failed to read file.');
      setUploading(false);
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const deleteNote = async (id) => {
    const note = notes.find(n => n.id === id);
    if (note && !isOwner(note)) {
      alert('Only the uploader can delete this note.');
      return;
    }
    try {
      await deleteNoteDoc(id);
    } catch (err) {
      console.error('[Notes] Error deleting note:', err);
      alert('Failed to delete note.');
    }
  };

  const viewNote = (note) => {
    if (note.content) {
      window.open(note.content, '_blank');
    } else if (note.fileUrl) {
      window.open(note.fileUrl, '_blank');
    }
  };

  const formatDate = (dateStr) => {
    try {
      return new Date(dateStr).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="notes-page">
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => {
          setShowNotificationModal(false);
          setUploadedNoteData(null);
        }}
        noteData={uploadedNoteData}
        userProfile={userProfile}
        onConfirmSuccess={() => {
          setShowNotificationModal(false);
          setUploadedNoteData(null);
        }}
      />
      <div className="page-header">
        <h1>My Notes</h1>
        <button className="btn-add" onClick={() => fileInputRef.current.click()} disabled={uploading}>
          {uploading ? <Loader2 size={18} className="spin-icon" /> : <Upload size={18} />}
          <span>{uploading ? 'Uploading...' : 'Upload PDF'}</span>
        </button>
        <input
          type="file"
          accept="application/pdf"
          ref={fileInputRef}
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
      </div>

      <div className="notes-grid">
        {loading ? (
          <div className="empty-state">
            <div className="empty-icon"><FileText size={48} /></div>
            <h3>Loading notes...</h3>
          </div>
        ) : notes.length > 0 ? (
          notes.map((note, i) => (
            <div key={note.id} className="note-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="note-accent"></div>
              <div className="note-body">
                <div className="note-header">
                  <div className="pdf-badge">
                    <FileText size={14} />
                    PDF
                  </div>
                  {isOwner(note) ? (
                    <button className="delete-btn" onClick={() => deleteNote(note.id)} title="Delete">
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <span className="owner-badge" title={`Uploaded by ${note.userName || 'Unknown'}`}>
                      <User size={12} />
                      {note.userName?.split(' ')[0] || 'Other'}
                    </span>
                  )}
                </div>

                <h3 className="note-title">{note.title}</h3>

                <div className="note-footer">
                  <div className="note-date">
                    <Calendar size={14} />
                    <span>{formatDate(note.date)}</span>
                  </div>
                  <button className="view-btn" onClick={() => viewNote(note)}>
                    <Eye size={16} />
                    <span>View</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FileText size={48} />
            </div>
            <h3>No notes yet</h3>
            <p>Upload your first PDF note to get started.</p>
          </div>
        )}
      </div>

      <style jsx="true">{`
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
        .btn-add:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }

        .spin-icon { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        .notes-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
          gap: 1.25rem;
          min-height: 200px;
        }

        .notes-grid:has(.empty-state) { display: block; }

        .note-card {
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          transition: all var(--transition-fast);
          display: flex;
          overflow: hidden;
          opacity: 0;
          animation-fill-mode: forwards;
        }

        .note-card:hover {
          transform: translateY(-4px);
          box-shadow: var(--shadow-md);
        }

        .note-accent {
          width: 5px;
          background: var(--gradient-primary);
          flex-shrink: 0;
        }

        .note-body {
          flex: 1;
          padding: 1.25rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .note-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .pdf-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          font-weight: 700;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          background: #fef2f2;
          color: #dc2626;
          text-transform: uppercase;
        }

        .owner-badge {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.7rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          background: var(--color-primary-bg);
          color: var(--color-primary);
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

        .note-title {
          font-size: 1.05rem;
          font-weight: 700;
          color: var(--color-text-main);
          line-height: 1.4;
          word-break: break-word;
        }

        .note-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 0.75rem;
          border-top: 1px solid var(--color-border);
        }

        .note-date {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          color: var(--color-text-muted);
          font-size: 0.8rem;
        }

        .view-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 12px;
          background: var(--color-primary-bg);
          color: var(--color-primary);
          border-radius: var(--radius-md);
          font-size: 0.8rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .view-btn:hover {
          background: var(--color-primary);
          color: white;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 4rem 1rem;
          text-align: center;
          background: white;
          border-radius: var(--radius-lg);
          border: 2px dashed var(--color-border);
          color: var(--color-text-muted);
        }

        .empty-icon {
          background: var(--color-primary-bg);
          padding: 1.25rem;
          border-radius: 50%;
          margin-bottom: 1rem;
          color: var(--color-primary);
        }

        .empty-state h3 { font-size: 1.15rem; color: var(--color-text-main); margin-bottom: 0.5rem; }
      `}</style>
    </div>
  );
}
