import React, { useState } from 'react';
import { X, Check, PlusCircle } from 'lucide-react';
import { CATEGORIES, DAY_CONFIGS } from '../data/timetable';

function EditTimetableForm({ onClose, onSave, initialData, defaultDayKey }) {
  const [dayKey, setDayKey] = useState(defaultDayKey || 'monday');
  const [title, setTitle] = useState(initialData?.title || '');
  const [startTime, setStartTime] = useState(initialData?.startTime || initialData?.time || '');
  const [endTime, setEndTime] = useState(initialData?.endTime || '');
  const [category, setCategory] = useState(initialData?.category || 'coding');
  const [error, setError] = useState('');

  const isEditing = Boolean(initialData);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Task name is required');
      return;
    }

    onSave({
      dayKey,
      taskId: initialData?.id,
      taskData: {
        title: title.trim(),
        startTime: startTime.trim(),
        endTime: endTime.trim(),
        category,
      },
    });
    onClose();
  };

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3 className="modal-title">
            {isEditing ? 'Edit Timetable Task' : 'Add Timetable Task'}
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

          {/* Day selection */}
          <div className="form-group">
            <label className="form-label" htmlFor="timetable-day-select">
              Day of the Week *
            </label>
            <select
              id="timetable-day-select"
              className="form-select"
              value={dayKey}
              onChange={(e) => setDayKey(e.target.value)}
              disabled={isEditing} // keep day fixed when editing existing task
            >
              {DAY_CONFIGS.map((day) => (
                <option key={day.key} value={day.key}>
                  {day.label}
                </option>
              ))}
            </select>
          </div>

          {/* Task Name */}
          <div className="form-group">
            <label className="form-label" htmlFor="timetable-task-name">
              Task Name *
            </label>
            <input
              id="timetable-task-name"
              type="text"
              className="form-input"
              placeholder="e.g. Coding Practice or College Lecture"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              autoFocus
              maxLength={100}
            />
          </div>

          {/* Start Time & End Time in 2 columns */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
            <div className="form-group">
              <label className="form-label" htmlFor="timetable-start-time">
                Start Time
              </label>
              <input
                id="timetable-start-time"
                type="text"
                className="form-input font-mono"
                placeholder="e.g. 8:10 PM"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                maxLength={30}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="timetable-end-time">
                End Time (Optional)
              </label>
              <input
                id="timetable-end-time"
                type="text"
                className="form-input font-mono"
                placeholder="e.g. 10:00 PM"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                maxLength={30}
              />
            </div>
          </div>

          {/* Category Dropdown */}
          <div className="form-group">
            <label className="form-label" htmlFor="timetable-category-select">
              Category
            </label>
            <select
              id="timetable-category-select"
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
              {isEditing ? <Check size={16} /> : <PlusCircle size={16} />}
              <span>{isEditing ? 'Save Changes' : 'Add to Schedule'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EditTimetableModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  defaultDayKey = 'monday',
}) {
  if (!isOpen) return null;
  return (
    <EditTimetableForm
      key={initialData?.id || defaultDayKey || 'new_timetable_task'}
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
      defaultDayKey={defaultDayKey}
    />
  );
}
