import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { FileText, Calendar, Eye, Trash2, Upload, User } from 'lucide-react';

export function Notes() {
  const { user } = useAuth();

  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem('learngrid_notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const fileInputRef = React.useRef(null);

  const isOwner = (note) => {
    return user && note.userId === user.id;
  };

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      alert('Only PDF files are allowed.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('File size must be less than 2MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const newNote = {
        id: Date.now(),
        title: file.name.replace('.pdf', ''),
        subject: 'PDF Upload',
        date: new Date().toLocaleDateString(),
        content: event.target.result,
        type: 'pdf',
        userId: user?.id,
        userName: user?.name || 'Unknown',
      };

      const updatedNotes = [newNote, ...notes];
      setNotes(updatedNotes);
      localStorage.setItem('learngrid_notes', JSON.stringify(updatedNotes));
    };
    reader.readAsDataURL(file);
    e.target.value = null;
  };

  const deleteNote = (id) => {
    const note = notes.find(n => n.id === id);
    if (note && !isOwner(note)) {
      alert('Only the uploader can delete this note.');
      return;
    }
    const updatedNotes = notes.filter(note => note.id !== id);
    setNotes(updatedNotes);
    localStorage.setItem('learngrid_notes', JSON.stringify(updatedNotes));
  };

  const viewNote = (note) => {
    if (note.type === 'pdf') {
      const win = window.open();
      win.document.write(
        `<iframe src="${note.content}" frameborder="0" style="border:0; top:0; left:0; bottom:0; right:0; width:100%; height:100%;" allowfullscreen></iframe>`
      );
    }
  };

  return (
    <div className="notes-page">
      <div className="page-header">
        <h1>My Notes</h1>
        <button className="btn-add" onClick={() => fileInputRef.current.click()}>
          <Upload size={18} />
          <span>Upload PDF</span>
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
        {notes.length > 0 ? (
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
                    <span>{note.date}</span>
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
