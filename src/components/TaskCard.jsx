import React from 'react';
import { Check, Clock, Edit2, Trash2 } from 'lucide-react';
import { CATEGORIES } from '../data/timetable';
import { useHabitix } from '../context/useHabitix';

export default function TaskCard({ task, onEdit }) {
  const { currentDayCompletedIds, toggleTask, deleteCustomTask } = useHabitix();
  const isCompleted = currentDayCompletedIds.includes(task.id);

  const categoryConfig = CATEGORIES[task.category] || CATEGORIES.personal;

  const handleKeyDown = (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleTask(task.id);
    }
  };

  return (
    <div
      className={`task-item-card ${isCompleted ? 'is-completed' : ''}`}
      onClick={() => toggleTask(task.id)}
      role="button"
      tabIndex={0}
      onKeyDown={handleKeyDown}
      aria-label={`${task.title}, time: ${task.time}, category: ${categoryConfig.label}, ${isCompleted ? 'completed' : 'pending'}`}
    >
      {/* Accessible Checkbox */}
      <label
        className="checkbox-touch-area"
        onClick={(e) => e.stopPropagation()}
      >
        <input
          type="checkbox"
          className="native-checkbox-hidden"
          checked={isCompleted}
          onChange={() => toggleTask(task.id)}
          aria-label={`Mark "${task.title}" as ${isCompleted ? 'incomplete' : 'complete'}`}
        />
        <div className={`custom-checkbox-box ${isCompleted ? 'checked' : ''}`}>
          {isCompleted && <Check size={16} strokeWidth={3} />}
        </div>
      </label>

      {/* Task Content */}
      <div className="task-details-col">
        <div className="task-title-text">
          {task.title}
        </div>

        <div className="task-meta-row">
          <div className="task-time-badge font-mono">
            <Clock size={12} />
            <span>{task.time}</span>
          </div>

          <span
            className="badge-pill"
            style={{
              backgroundColor: categoryConfig.badgeBg,
              color: categoryConfig.badgeText,
            }}
          >
            <span aria-hidden="true">{categoryConfig.icon}</span>
            <span>{categoryConfig.label}</span>
          </span>

          {task.isCustom && (
            <span
              className="badge-pill"
              style={{ backgroundColor: 'var(--yellow-light)', color: '#243B53' }}
            >
              Custom
            </span>
          )}
        </div>
      </div>

      {/* Actions (for custom tasks) */}
      {task.isCustom && (
        <div className="task-actions-col" onClick={(e) => e.stopPropagation()}>
          <button
            type="button"
            className="btn-icon btn-secondary btn-task-action"
            onClick={() => onEdit(task)}
            title="Edit custom task"
            aria-label={`Edit ${task.title}`}
          >
            <Edit2 size={14} />
          </button>
          <button
            type="button"
            className="btn-icon btn-secondary btn-task-action btn-task-delete"
            onClick={() => deleteCustomTask(task.id)}
            title="Delete custom task"
            aria-label={`Delete ${task.title}`}
          >
            <Trash2 size={14} />
          </button>
        </div>
      )}
    </div>
  );
}
