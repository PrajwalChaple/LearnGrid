import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, FileQuestion, Plus, X, User, Upload, FileText, Eye } from 'lucide-react';
import { subscribeToAssignments, addAssignment, deleteAssignmentDoc, updateAssignment } from '../../lib/firestore';
import { NotificationModal } from '../../components/NotificationModal';
import { uploadAssignmentPDFToCloudinary } from '../../lib/cloudinary';

export function Assignments() {
  const { user, userProfile } = useAuth();

  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ subject: '', title: '', deadline: '', description: '' });
  const [uploading, setUploading] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [pendingItemData, setPendingItemData] = useState(null); // Prepared but NOT saved yet
  const [pendingFile, setPendingFile] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = React.useRef(null);
  const isOpeningFileDialog = React.useRef(false);

  // Real-time listener
  useEffect(() => {
    if (!userProfile) return;
    const unsubscribe = subscribeToAssignments(userProfile, (data) => {
      setAssignments(data);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [userProfile]);

  // Clear file selection when form opens
  useEffect(() => {
    if (showForm) {
      setSelectedFile(null);
      setPendingFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  }, [showForm]); // eslint-disable-line react-hooks/exhaustive-deps

  const isOwner = (item) => {
    return user && item.userId === user.uid;
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    const file = fileInputRef.current?.files?.[0];

    // Only prepare the data — do NOT save to Firestore yet
    const assignmentData = {
      ...formData,
      status: 'Pending',
      grade: '-',
      userId: user.uid,
      userName: user.displayName || userProfile?.name || 'Unknown',
      roleType: userProfile.roleType,
      institutionName: userProfile.institutionName,
      ...(userProfile.roleType === 'college'
        ? { department: userProfile.department, year: userProfile.year }
        : { standard: userProfile.standard, section: userProfile.section }),
      _file: file, // Store file for later upload
    };

    // Show notification modal — save happens ONLY on Confirm
    setPendingItemData(assignmentData);
    setPendingFile(file);
    setFormData({ subject: '', title: '', deadline: '', description: '' });
    setSelectedFile(null); // Clear selected file display
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowForm(false);
    setShowNotificationModal(true);
  };

  // Called by NotificationModal on Confirm — does the actual Firestore save + Calendar sync + PDF upload
  const handleUploadAssignment = async (audienceParams) => {
    if (!pendingItemData) return null;
    setUploading(true);
    try {
      let fileUrl = null;
      let downloadUrl = null;
      let cloudinaryId = null;
      let fileName = null;

      // Upload PDF if present
      if (pendingFile) {
        if (pendingFile.type !== 'application/pdf') {
          alert('Only PDF files are allowed.');
          setUploading(false);
          return null;
        }
        if (pendingFile.size > 10 * 1024 * 1024) {
          alert('File size must be less than 10MB.');
          setUploading(false);
          return null;
        }
        console.log('[Assignments] Uploading PDF to Cloudinary...');
        const uploadResult = await uploadAssignmentPDFToCloudinary(pendingFile, user.uid);
        fileUrl = uploadResult.url;
        downloadUrl = uploadResult.downloadUrl;
        cloudinaryId = uploadResult.publicId;
        fileName = pendingFile.name;
        console.log('[Assignments] PDF uploaded:', fileUrl);
      }

      // Prepare final data (remove _file)
      const { _file, ...finalData } = pendingItemData;
      const assignmentData = {
        ...finalData,
        ...audienceParams, // Overwrite with targeted class/audience!
        ...(fileUrl && { fileUrl, downloadUrl, cloudinaryId, fileName }),
      };

      const newId = await addAssignment(assignmentData);

      // GlobalCalendarSync handles Calendar integration automatically now

      return { ...assignmentData, id: newId, title: assignmentData.title };
    } catch (err) {
      console.error('Error adding assignment:', err);
      alert('Failed to add assignment. Please try again.');
      return null;
    } finally {
      setUploading(false);
      setPendingFile(null);
    }
  };

  // Get current user's status for an assignment
  const getMyStatus = (assignment) => {
    if (assignment.userStatuses && assignment.userStatuses[user.uid]) {
      return assignment.userStatuses[user.uid];
    }
    // Fallback: if creator, use top-level status; otherwise default Pending
    if (isOwner(assignment)) return assignment.status || 'Pending';
    return 'Pending';
  };

  const getMyGrade = (assignment) => {
    if (assignment.userGrades && assignment.userGrades[user.uid]) {
      return assignment.userGrades[user.uid];
    }
    if (isOwner(assignment)) return assignment.grade || '-';
    return '-';
  };

  const toggleStatus = async (id) => {
    const item = assignments.find(a => a.id === id);
    if (!item) return;
    const currentStatus = getMyStatus(item);
    const newStatus = currentStatus === 'Pending' ? 'Completed' : 'Pending';
    const newGrade = newStatus === 'Completed' ? 'A' : '-';

    try {
      await updateAssignment(id, {
        [`userStatuses.${user.uid}`]: newStatus,
        [`userGrades.${user.uid}`]: newGrade,
      });

      // GlobalCalendarSync handles Calendar sync based on the updated state
    } catch (err) {
      console.error('Error updating assignment:', err);
    }
  };

  const deleteAssignmentItem = async (id) => {
    const item = assignments.find(a => a.id === id);
    if (item && !isOwner(item)) {
      alert('Only the creator can delete this assignment.');
      return;
    }
    try {
      // GlobalCalendarSync removes events when the Assignment is no longer active
      await deleteAssignmentDoc(id);
    } catch (err) {
      console.error('Error deleting assignment:', err);
      alert('Failed to delete assignment.');
    }
  };

  const filtered = filter === 'All' ? assignments : assignments.filter(a => getMyStatus(a) === filter);

  return (
    <div className="assignments-page">
      <NotificationModal
        isOpen={showNotificationModal}
        onClose={() => { setShowNotificationModal(false); setPendingItemData(null); }}
        noteData={pendingItemData}
        userProfile={userProfile}
        itemType="assignment"
        onUpload={handleUploadAssignment}
        onConfirmSuccess={() => {
          setShowNotificationModal(false);
          setPendingItemData(null);
          setSelectedFile(null);
          setPendingFile(null);
        }}
      />
      <div className="page-header">
        <h1>Assignments</h1>
        <div className="header-actions">
          <div className="filters">
            {['All', 'Pending', 'Completed'].map(f => (
              <button key={f} className={`filter-btn ${filter === f ? 'active' : ''}`} onClick={() => setFilter(f)}>
                {f}
              </button>
            ))}
          </div>
          <button className="btn-add" onClick={() => {
            if (!showForm) {
              // Opening form - clear previous state
              setSelectedFile(null);
              setPendingFile(null);
              setFormData({ subject: '', title: '', deadline: '', description: '' });
              if (fileInputRef.current) fileInputRef.current.value = '';
            }
            setShowForm(!showForm);
          }}>
            <Plus size={18} />
            <span>Add Assignment</span>
          </button>
        </div>
      </div>

      {showForm && (
        <form className="add-form animate-fade-in" onSubmit={handleAdd}>
          <input
            type="text" placeholder="Subject" required
            value={formData.subject}
            onChange={e => setFormData({ ...formData, subject: e.target.value })}
          />
          <input
            type="text" placeholder="Assignment Title" required
            value={formData.title}
            onChange={e => setFormData({ ...formData, title: e.target.value })}
          />
          <input
            type="date" required
            value={formData.deadline}
            onChange={e => setFormData({ ...formData, deadline: e.target.value })}
          />
          <textarea
            placeholder="Description (optional)"
            value={formData.description}
            onChange={e => setFormData({ ...formData, description: e.target.value })}
            className="form-textarea"
            rows="3"
          />
          <div className="file-upload-label" onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (isOpeningFileDialog.current) return;
            isOpeningFileDialog.current = true;
            fileInputRef.current?.click();
            setTimeout(() => { isOpeningFileDialog.current = false; }, 500);
          }}>
            <Upload size={18} />
            <span>Upload PDF (optional)</span>
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
              setPendingFile(file);
            }}
            style={{ display: 'none' }}
          />
          <div className="form-actions">
            <button type="submit" className="btn-save" disabled={uploading}>
              {uploading ? 'Saving...' : 'Save'}
            </button>
            <button type="button" className="btn-cancel" onClick={() => {
              setShowForm(false);
              setFormData({ subject: '', title: '', deadline: '', description: '' });
              setSelectedFile(null);
              setPendingFile(null);
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}>
              <X size={18} />
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="table-container">
        <table className="assignments-table">
          <thead>
            <tr>
              <th>Subject</th>
              <th>Assignment Title</th>
              <th>Deadline</th>
              <th>Status</th>
              <th>Created By</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <p>Loading assignments...</p>
                  </div>
                </td>
              </tr>
            ) : filtered.length > 0 ? (
              filtered.map((assignment) => (
                <tr key={assignment.id} className="animate-fade-in">
                  <td>
                    <span className="subject-tech">{assignment.subject}</span>
                  </td>
                  <td className="title-cell">
                    <div className="title-with-desc">
                      <div className="assignment-title">{assignment.title}</div>
                      {assignment.description && (
                        <div className="assignment-description">{assignment.description}</div>
                      )}
                      {assignment.fileUrl && (
                        <a
                          href={assignment.fileUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="pdf-link"
                          onClick={e => e.stopPropagation()}
                        >
                          <FileText size={14} />
                          <span>{assignment.fileName || 'View PDF'}</span>
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="date-cell">{assignment.deadline}</td>
                  <td>
                    <span
                      className={`status-badge ${getMyStatus(assignment).toLowerCase()}`}
                      onClick={() => toggleStatus(assignment.id)}
                      style={{ cursor: 'pointer' }}
                      title="Click to toggle your status"
                    >
                      {getMyStatus(assignment) === 'Completed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {getMyStatus(assignment)}
                    </span>
                  </td>
                  <td>
                    <span className={`creator-badge ${isOwner(assignment) ? 'is-you' : ''}`}>
                      <User size={12} />
                      {isOwner(assignment) ? 'You' : (assignment.userName?.split(' ')[0] || 'Other')}
                    </span>
                    {isOwner(assignment) && (
                      <button className="delete-btn" onClick={() => deleteAssignmentItem(assignment.id)} style={{ marginLeft: '8px' }}>Delete</button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">
                  <div className="empty-state">
                    <FileQuestion size={32} className="empty-icon-sm" />
                    <p>No assignments found.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <style>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.75rem;
          flex-wrap: wrap;
          gap: 1rem;
        }

        h1 {
          font-size: 1.75rem;
          font-weight: 800;
          color: var(--color-text-main);
        }

        .header-actions {
          display: flex;
          gap: 0.75rem;
          align-items: center;
          flex-wrap: wrap;
        }

        .filters {
          display: flex;
          gap: 4px;
          background-color: white;
          padding: 4px;
          border-radius: var(--radius-lg);
          border: 1px solid var(--color-border);
          box-shadow: var(--shadow-sm);
        }

        .filter-btn {
          padding: 0.45rem 1rem;
          border-radius: var(--radius-md);
          font-size: 0.85rem;
          color: var(--color-text-muted);
          font-weight: 500;
          transition: all var(--transition-fast);
        }

        .filter-btn:hover { color: var(--color-primary); }

        .filter-btn.active {
          background: var(--gradient-primary);
          color: white;
          font-weight: 600;
          box-shadow: var(--shadow-sm);
        }

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

        .btn-add:hover {
          transform: translateY(-2px);
          box-shadow: var(--shadow-md);
        }

        .add-form {
          background: white;
          padding: 1.5rem;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-md);
          margin-bottom: 1.5rem;
          display: flex;
          gap: 0.75rem;
          flex-wrap: wrap;
          align-items: flex-end;
          border: 1px solid var(--color-primary-bg);
        }

        .add-form input, .add-form textarea {
          flex: 1;
          min-width: 180px;
          padding: 0.65rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          transition: border-color var(--transition-fast);
          font-family: inherit;
        }

        .add-form textarea {
          resize: vertical;
          min-height: 80px;
        }

        .add-form input:focus, .add-form textarea:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
          outline: none;
        }

        .file-upload-label {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.65rem 1rem;
          border: 2px dashed var(--color-border);
          border-radius: var(--radius-md);
          cursor: pointer;
          transition: all var(--transition-fast);
          color: var(--color-text-muted);
          flex: 1;
          min-width: 180px;
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
          gap: 0.5rem;
        }

        .btn-save {
          padding: 0.65rem 1.25rem;
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

        .table-container {
          background: white;
          border-radius: var(--radius-lg);
          box-shadow: var(--shadow-sm);
          overflow-x: auto;
          border: 1px solid rgba(229, 231, 235, 0.5);
        }

        .assignments-table {
          width: 100%;
          border-collapse: collapse;
          min-width: 800px;
        }

        th {
          text-align: left;
          padding: 1rem 1.25rem;
          border-bottom: 1px solid var(--color-border);
          color: var(--color-text-muted);
          font-weight: 600;
          font-size: 0.8rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        td {
          padding: 0.9rem 1.25rem;
          border-bottom: 1px solid rgba(229, 231, 235, 0.5);
          color: var(--color-text-main);
          font-size: 0.9rem;
        }

        tr:last-child td { border-bottom: none; }

        tr:hover td { background-color: var(--color-primary-bg); }

        .subject-tech {
          font-weight: 600;
          color: var(--color-primary);
        }

        .title-cell { font-weight: 500; }

        .title-with-desc {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .assignment-title {
          font-weight: 500;
        }

        .assignment-description {
          font-size: 0.8rem;
          color: var(--color-text-muted);
          line-height: 1.4;
        }

        .pdf-link {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--color-primary);
          text-decoration: none;
          font-weight: 500;
          margin-top: 0.25rem;
          transition: all var(--transition-fast);
        }

        .pdf-link:hover {
          color: var(--color-primary-dark);
          text-decoration: underline;
        }

        .status-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: var(--radius-full);
          font-size: 0.8rem;
          font-weight: 600;
          transition: all var(--transition-fast);
        }

        .status-badge:hover {
          transform: scale(1.05);
        }

        .status-badge.pending {
          background-color: #fff7ed;
          color: #c2410c;
        }

        .status-badge.completed {
          background-color: #ecfdf5;
          color: #047857;
        }

        .grade-cell { font-weight: 700; color: var(--color-primary); }

        .creator-badge {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          padding: 3px 10px;
          border-radius: var(--radius-full);
          background: #f3f4f6;
          color: var(--color-text-muted);
        }

        .creator-badge.is-you {
          background: var(--color-primary-bg);
          color: var(--color-primary);
        }

        .delete-btn {
          color: var(--color-danger);
          font-weight: 500;
          font-size: 0.85rem;
          padding: 0.3rem 0.75rem;
          border-radius: var(--radius-md);
          transition: all var(--transition-fast);
        }

        .delete-btn:hover {
          background: #fef2f2;
        }

        .view-only-label {
          font-size: 0.75rem;
          color: var(--color-text-muted);
          font-style: italic;
        }

        .empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 3rem;
          color: var(--color-text-muted);
          gap: 0.75rem;
        }

        .empty-icon-sm { opacity: 0.4; }
      `}</style>
    </div >
  );
}
