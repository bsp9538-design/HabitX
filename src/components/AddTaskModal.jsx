import React, { useState } from 'react';
import { X, PlusCircle, Check } from 'lucide-react';
import { CATEGORIES } from '../data/timetable';

function AddTaskForm({ onClose, onSave, initialData }) {
  const [title, setTitle] = useState(initialData?.title || '');
  const [time, setTime] = useState(initialData?.time || '');
  const [category, setCategory] = useState(initialData?.category || 'coding');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task name is required');
      return;
    }

    onSave({
      title: title.trim(),
      time: time.trim() || 'Anytime',
      category,
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3 className="modal-title">
            {initialData ? 'Edit Task' : 'Add New Task'}
          </h3>
          <button
            type="button"
            className="btn-icon btn-secondary"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div
              style={{
                backgroundColor: 'var(--coral-light)',
                color: 'var(--coral)',
                padding: '8px 12px',
                borderRadius: 'var(--radius-md)',
                marginBottom: '14px',
                border: '1.5px solid var(--coral)',
                fontWeight: 700,
                fontSize: '0.85rem',
              }}
            >
              {error}
            </div>
          )}

          <div className="form-group">
            <label className="form-label" htmlFor="task-name-input">
              Task Name *
            </label>
            <input
              id="task-name-input"
              type="text"
              className="form-input"
              placeholder="e.g. Build Habitix frontend"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              maxLength={100}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-time-input">
              Time (Optional)
            </label>
            <input
              id="task-time-input"
              type="text"
              className="form-input font-mono"
              placeholder="e.g. 6:00–7:00 PM or 8:30 PM"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              maxLength={40}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="task-category-select">
              Category
            </label>
            <select
              id="task-category-select"
              className="form-select"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {Object.values(CATEGORIES).map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.icon} {cat.label}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              {initialData ? <Check size={16} /> : <PlusCircle size={16} />}
              <span>{initialData ? 'Update Task' : 'Add Task'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AddTaskModal({ isOpen, onClose, onSave, initialData }) {
  if (!isOpen) return null;
  return (
    <AddTaskForm
      key={initialData?.id || 'new'}
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
    />
  );
}
