import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { CheckCircle, Clock, FileQuestion, Plus, X, User } from 'lucide-react';

export function Assignments() {
  const { user } = useAuth();

  const [assignments, setAssignments] = useState(() => {
    return JSON.parse(localStorage.getItem('learngrid_assignments') || '[]');
  });
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ subject: '', title: '', deadline: '' });

  const isOwner = (item) => {
    return user && item.userId === user.id;
  };

  const saveAssignments = (updated) => {
    setAssignments(updated);
    localStorage.setItem('learngrid_assignments', JSON.stringify(updated));
  };

  const handleAdd = (e) => {
    e.preventDefault();
    const newAssignment = {
      id: Date.now(),
      ...formData,
      status: 'Pending',
      grade: '-',
      userId: user?.id,
      userName: user?.name || 'Unknown',
    };
    saveAssignments([newAssignment, ...assignments]);
    setFormData({ subject: '', title: '', deadline: '' });
    setShowForm(false);
  };

  const toggleStatus = (id) => {
    const item = assignments.find(a => a.id === id);
    if (item && !isOwner(item)) {
      alert('Only the creator can change the status.');
      return;
    }
    const updated = assignments.map(a =>
      a.id === id ? { ...a, status: a.status === 'Pending' ? 'Completed' : 'Pending', grade: a.status === 'Pending' ? 'A' : '-' } : a
    );
    saveAssignments(updated);
  };

  const deleteAssignment = (id) => {
    const item = assignments.find(a => a.id === id);
    if (item && !isOwner(item)) {
      alert('Only the creator can delete this assignment.');
      return;
    }
    saveAssignments(assignments.filter(a => a.id !== id));
  };

  const filtered = filter === 'All' ? assignments : assignments.filter(a => a.status === filter);

  return (
    <div className="assignments-page">
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
          <button className="btn-add" onClick={() => setShowForm(!showForm)}>
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
          <div className="form-actions">
            <button type="submit" className="btn-save">Save</button>
            <button type="button" className="btn-cancel" onClick={() => setShowForm(false)}>Cancel</button>
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
              <th>Grade</th>
              <th>Created By</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((assignment) => (
                <tr key={assignment.id} className="animate-fade-in">
                  <td>
                    <span className="subject-tech">{assignment.subject}</span>
                  </td>
                  <td className="title-cell">{assignment.title}</td>
                  <td className="date-cell">{assignment.deadline}</td>
                  <td>
                    <span
                      className={`status-badge ${assignment.status.toLowerCase()}`}
                      onClick={() => toggleStatus(assignment.id)}
                      style={{ cursor: isOwner(assignment) ? 'pointer' : 'default' }}
                      title={isOwner(assignment) ? 'Click to toggle status' : 'Only creator can change status'}
                    >
                      {assignment.status === 'Completed' ? <CheckCircle size={14} /> : <Clock size={14} />}
                      {assignment.status}
                    </span>
                  </td>
                  <td className="grade-cell">{assignment.grade}</td>
                  <td>
                    <span className={`creator-badge ${isOwner(assignment) ? 'is-you' : ''}`}>
                      <User size={12} />
                      {isOwner(assignment) ? 'You' : (assignment.userName?.split(' ')[0] || 'Other')}
                    </span>
                  </td>
                  <td>
                    {isOwner(assignment) ? (
                      <button className="delete-btn" onClick={() => deleteAssignment(assignment.id)}>Delete</button>
                    ) : (
                      <span className="view-only-label">View Only</span>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7">
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

      <style jsx="true">{`
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

        .add-form input {
          flex: 1;
          min-width: 180px;
          padding: 0.65rem 1rem;
          border: 1px solid var(--color-border);
          border-radius: var(--radius-md);
          font-size: 0.9rem;
          transition: border-color var(--transition-fast);
        }

        .add-form input:focus {
          border-color: var(--color-primary);
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.1);
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
    </div>
  );
}
