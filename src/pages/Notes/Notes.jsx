import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, Calendar, Eye, Trash2, Upload, User, Loader2, Plus, X, Search } from 'lucide-react';
import { subscribeToNotes, addNote, hideNoteDoc } from '../../lib/firestore';
import { uploadToCloudinary } from '../../lib/cloudinary';
import { NotificationModal } from '../../components/NotificationModal';

export function Notes() {
  const { user, userProfile, refreshProfile } = useAuth();

  const [notes, setNotes] = useState([]);
  const [filteredNotes, setFilteredNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [pendingNoteData, setPendingNoteData] = useState(null); // Data prepared but NOT saved yet
  const [formData, setFormData] = useState({ title: '', description: '' });
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = React.useRef(null);
  const isOpeningFileDialog = React.useRef(false);

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

  // Clear file selection when form opens
  useEffect(() => {
    if (showForm) {
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [showForm]); // eslint-disable-line react-hooks/exhaustive-deps

  // Filter notes based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredNotes(notes);
      return;
    }
    const query = searchQuery.toLowerCase();
    const filtered = notes.filter(note => {
      const title = (note.title || '').toLowerCase();
      const description = (note.description || '').toLowerCase();
      const fileName = (note.fileName || '').toLowerCase();
      return title.includes(query) || description.includes(query) || fileName.includes(query);
    });
    setFilteredNotes(filtered);
  }, [searchQuery, notes]);

  const isOwner = (note) => {
    return user && note.userId === user.uid;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a title.');
      return;
    }
    if (!fileInputRef.current?.files?.[0]) {
      alert('Please select a PDF file.');
      return;
    }

    const file = fileInputRef.current.files[0];
    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert('File size must be less than 10MB.');
      return;
    }

    // Only prepare metadata — do NOT upload to Cloudinary yet
    const noteData = {
      title: formData.title.trim(),
      description: formData.description.trim() || '',
      subject: 'PDF Upload',
      date: new Date().toISOString(),
      fileName: file.name,
      fileSize: file.size,
      type: 'pdf',
      userId: user.uid,
      userName: user.displayName || userProfile?.name || 'Unknown',
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
      _file: file, // Store raw file for later upload
    };

    // Show Notification Modal — upload happens ONLY on Confirm
    setPendingNoteData(noteData);
    setShowNotificationModal(true);
    setShowForm(false);
    setFormData({ title: '', description: '' });
    setSelectedFile(null); // Clear selected file display
    fileInputRef.current.value = '';
  };

  // Called by NotificationModal on Confirm — does Cloudinary upload + Firestore save
  const handleUploadNote = async (audienceParams) => {
    if (!pendingNoteData) return null;
    setUploading(true);
    try {
      const file = pendingNoteData._file;

      // 1. Upload to Cloudinary/Pinata NOW
      console.log('[Notes] Uploading to Cloudinary...');
      const { url, publicId, downloadUrl } = await uploadToCloudinary(file, user.uid);
      console.log('[Notes] Upload success:', url);

      // 2. Save to Firestore with the URL
      const { _file, ...noteMetadata } = pendingNoteData; // Remove raw file from data
      const finalData = {
        ...noteMetadata,
        ...audienceParams, // Overwrite with targeted class/audience!
        fileUrl: url,
        downloadUrl: downloadUrl || url,
        cloudinaryId: publicId,
      };

      console.log('[Notes] Saving to Firestore...');
      const newNoteId = await addNote(finalData);
      console.log('[Notes] Saved! ID:', newNoteId);
      return { ...finalData, id: newNoteId };
    } catch (err) {
      console.error('[Notes] Upload/save error:', err);
      alert('Failed to upload note. Please try again.');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteNote = async (id) => {
    try {
      // Soft-delete to hide just from the current user
      await hideNoteDoc(id, user.uid);
      await refreshProfile();
    } catch (err) {
      console.error('[Notes] Error hiding note:', err);
      alert('Failed to delete note.');
    }
  };

  const viewNote = (note) => {
    const url = note.fileUrl || note.content;
    if (url) {
      window.open(url, '_blank');
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
          setPendingNoteData(null);
        }}
        noteData={pendingNoteData}
        userProfile={userProfile}
        onUpload={handleUploadNote}
        onConfirmSuccess={() => {
          setShowNotificationModal(false);
          setPendingNoteData(null);
          setSelectedFile(null); // Clear selected file after successful upload
        }}
      />
      <div className="page-header">
        <h1>Notes</h1>
        <button className="btn-add" onClick={() => {
          if (!showForm) {
            // Opening form - clear previous state
            setSelectedFile(null);
            setFormData({ title: '', description: '' });
            if (fileInputRef.current) fileInputRef.current.value = '';
          }
          setShowForm(!showForm);
        }} disabled={uploading}>
          <Plus size={18} />
          <span>Add Notes</span>
        </button>
      </div>

      {showForm && (
        <form className="add-notes-form animate-fade-in" onSubmit={handleFormSubmit}>
          <div className="form-row">
            <input
              type="text"
              placeholder="Note Title *"
              required
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              className="form-input"
            />
          </div>
          <div className="form-row">
            <textarea
              placeholder="Description (optional)"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              className="form-textarea"
              rows="3"
            />
          </div>
          <div className="form-row">
            <div className="file-upload-label" onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isOpeningFileDialog.current) return;
              isOpeningFileDialog.current = true;
              fileInputRef.current?.click();
              setTimeout(() => { isOpeningFileDialog.current = false; }, 500);
            }}>
              <Upload size={18} />
              <span>Upload PDF *</span>
              {selectedFile && (
                <span className="file-name">{selectedFile.name}</span>
              )}
            </div>
            <input
              type="file"
              accept="application/pdf"
              ref={fileInputRef}
              onChange={(e) => {
                const file = e.target.files?.[0] || null;
                isOpeningFileDialog.current = false;
                setSelectedFile(file);
              }}
              required
              style={{ display: 'none' }}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={uploading}>
              {uploading ? <Loader2 size={18} className="spin-icon" /> : 'Save Note'}
            </button>
            <button type="button" className="btn-cancel" onClick={() => {
              setShowForm(false);
              setFormData({ title: '', description: '' });
              setSelectedFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}>
              <X size={18} />
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="notes-grid">
        {loading ? (
          <div className="empty-state">
            <div className="empty-icon"><FileText size={48} /></div>
            <h3>Loading notes...</h3>
          </div>
        ) : filteredNotes.length > 0 ? (
          filteredNotes.map((note, i) => (
            <div key={note.id} className="note-card animate-fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="note-accent"></div>
              <div className="note-body">
                <div className="note-header">
                  <div className="pdf-badge">
                    <FileText size={14} />
                    PDF
                  </div>
                  {!isOwner(note) && (
                    <span className="owner-badge" title={`Uploaded by ${note.userName || 'Unknown'}`}>
                      <User size={12} />
                      {note.userName?.split(' ')[0] || 'Other'}
                    </span>
                  )}
                  <button className="delete-btn" onClick={() => deleteNote(note.id)} title="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>

                <h3 className="note-title">{note.title}</h3>
                {note.description && (
                  <p className="note-description">{note.description}</p>
                )}
                {note.fileName && (
                  <div className="note-file-name">
                    <FileText size={12} />
                    <span>{note.fileName}</span>
                  </div>
                )}

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
        ) : searchQuery ? (
          <div className="empty-state">
            <div className="empty-icon">
              <Search size={48} />
            </div>
            <h3>No notes found</h3>
            <p>Try a different search term.</p>
          </div>
        ) : (
          <div className="empty-state">
            <div className="empty-icon">
              <FileText size={48} />
            </div>
            <h3>No notes yet</h3>
            <p>Click "Add Notes" to create your first note.</p>
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

        .search-container {
          margin-bottom: 1.5rem;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: white;
          padding: 0.75rem 1rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          border: 1px solid var(--color-border);
        }

        .search-box svg {
          color: var(--color-text-muted);
          flex-shrink: 0;
        }

        .search-input {
          flex: 1;
          border: none;
          outline: none;
          font-size: 0.9rem;
          color: var(--color-text-main);
        }

        .search-input::placeholder {
          color: var(--color-text-muted);
        }

        .add-notes-form {
          background: white;
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          margin-bottom: 1.5rem;
          border: 1px solid var(--color-primary-bg);
        }

        .form-row {
          margin-bottom: 1rem;
        }

        .form-row:last-of-type {
          margin-bottom: 0;
        }

        .form-input, .form-textarea {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          transition: border-color var(--transition-fast);
          font-family: inherit;
        }

        .form-input:focus, .form-textarea:focus {
          outline: none;
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
        }

        .form-textarea {
          resize: vertical;
          min-height: 80px;
        }

        .file-upload-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          color: var(--color-text-muted);
        }

        .file-upload-label:hover {
          border-color: var(--color-primary);
          background: var(--color-primary-bg);
          color: var(--color-primary);
        }

        .file-name {
          margin-left: auto;
          font-size: 0.85rem;
          color: var(--color-primary);
          font-weight: 500;
        }

        .form-actions {
          display: flex;
          gap: 0.75rem;
          margin-top: 1rem;
        }

        .btn-save {
          flex: 1;
          padding: 0.75rem 1.25rem;
          background: var(--gradient-primary);
          color: white;
          border-radius: var(--radius-md);
          font-weight: 600;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.5rem;
          transition: all var(--transition-fast);
        }

        .btn-save:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .btn-save:disabled {
          opacity: 0.7;
          cursor: not-allowed;
          transform: none;
        }

        .btn-cancel {
          padding: 0.75rem 1.25rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          color: var(--color-text-muted);
          font-weight: 500;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 0.5rem;
          transition: all var(--transition-fast);
        }

        .btn-cancel:hover {
          background: var(--color-primary-bg);
          border-color: var(--color-primary);
          color: var(--color-primary);
        }

        .note-description {
          font-size: 0.85rem;
          color: var(--color-text-muted);
          line-height: 1.5;
          margin-top: 0.5rem;
          word-break: break-word;
        }

        .note-file-name {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.75rem;
          color: var(--color-text-muted);
          margin-top: 0.5rem;
          padding: 0.25rem 0.5rem;
          background: var(--color-primary-bg);
          border-radius: var(--radius-sm);
          width: fit-content;
        }

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
