import React, { useState } from 'react';
import {
  ArrowLeft,
  Plus,
  Edit2,
  Trash2,
  ChevronUp,
  ChevronDown,
  RotateCcw,
  Clock,
  GripVertical,
  Calendar,
} from 'lucide-react';
import { useHabitix } from '../context/useHabitix';
import { CATEGORIES, DAY_CONFIGS, formatTaskTimeDisplay } from '../data/timetable';
import EditTimetableModal from './EditTimetableModal';
import ResetConfirmModal from './ResetConfirmModal';

export default function EditTasksView({ onBack }) {
  const {
    customTimetable,
    updateTimetableTask,
    addTimetableTask,
    deleteTimetableTask,
    reorderTimetableTasks,
    restoreDefaults,
  } = useHabitix();

  const [activeDayFilter, setActiveDayFilter] = useState('all');
  const [modalState, setModalState] = useState({
    isOpen: false,
    initialData: null,
    defaultDayKey: 'monday',
  });
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
  const [draggedItem, setDraggedItem] = useState(null);

  const handleOpenAddModal = (dayKey) => {
    setModalState({
      isOpen: true,
      initialData: null,
      defaultDayKey: dayKey || 'monday',
    });
  };

  const handleOpenEditModal = (dayKey, task) => {
    setModalState({
      isOpen: true,
      initialData: { ...task, dayKey },
      defaultDayKey: dayKey,
    });
  };

  const handleSaveModal = ({ dayKey, taskId, taskData }) => {
    if (taskId) {
      updateTimetableTask(dayKey, taskId, taskData);
    } else {
      addTimetableTask(dayKey, taskData);
    }
  };

  // Drag and drop handlers
  const handleDragStart = (e, dayKey, index) => {
    setDraggedItem({ dayKey, index });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, targetDayKey, targetIndex) => {
    e.preventDefault();
    if (!draggedItem || draggedItem.dayKey !== targetDayKey) {
      setDraggedItem(null);
      return;
    }
    if (draggedItem.index !== targetIndex) {
      reorderTimetableTasks(targetDayKey, draggedItem.index, targetIndex);
    }
    setDraggedItem(null);
  };

  const visibleDays = activeDayFilter === 'all'
    ? DAY_CONFIGS
    : DAY_CONFIGS.filter((d) => d.key === activeDayFilter);

  return (
    <div className="edit-tasks-view">
      {/* Top Header Row with Navigation & Actions */}
      <div className="card" style={{ marginBottom: '20px', padding: '16px 20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              type="button"
              className="btn-secondary"
              onClick={onBack}
              title="Return to Settings"
              style={{ fontSize: '0.85rem', padding: '6px 14px' }}
            >
              <ArrowLeft size={16} />
              <span>Back to Settings</span>
            </button>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '-0.02em' }}>
                Edit Timetable
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                Customize your recurring daily routine for Monday through Sunday
              </p>
            </div>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={() => setIsRestoreModalOpen(true)}
            style={{ fontSize: '0.82rem', padding: '6px 12px' }}
            title="Reset schedule back to the original Habitix timetable"
          >
            <RotateCcw size={14} />
            <span>Restore Defaults</span>
          </button>
        </div>

        {/* Day Filter Strip (Mobile-friendly day tabs) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', overflowX: 'auto', marginTop: '16px', paddingTop: '14px', borderTop: '1px solid var(--border-neutral)' }}>
          <button
            type="button"
            className={`badge-pill ${activeDayFilter === 'all' ? 'btn-primary' : 'btn-secondary'}`}
            style={{ padding: '6px 14px', fontSize: '0.78rem', cursor: 'pointer' }}
            onClick={() => setActiveDayFilter('all')}
          >
            All Days
          </button>
          {DAY_CONFIGS.map((day) => (
            <button
              key={day.key}
              type="button"
              className={`badge-pill ${activeDayFilter === day.key ? 'btn-primary' : 'btn-secondary'}`}
              style={{ padding: '6px 12px', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
              onClick={() => setActiveDayFilter(day.key)}
            >
              {day.short}
            </button>
          ))}
        </div>
      </div>

      {/* Day Sections: MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY */}
      <div className="editable-days-container" style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {visibleDays.map((day) => {
          const tasks = customTimetable[day.key] || [];

          return (
            <section
              key={day.key}
              className="card day-editor-section"
              aria-label={`Edit ${day.label} Schedule`}
              style={{ padding: '20px' }}
            >
              {/* Day Section Header */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px', marginBottom: '16px', borderBottom: '2px solid var(--border-dark)', paddingBottom: '12px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Calendar size={18} color="var(--primary-dark)" />
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.02em' }}>
                    {day.label}
                  </h3>
                  <span
                    className="badge-pill font-mono"
                    style={{ backgroundColor: 'var(--bg-page)', color: 'var(--text-secondary)' }}
                  >
                    {tasks.length} {tasks.length === 1 ? 'task' : 'tasks'}
                  </span>
                </div>

                <button
                  type="button"
                  className="btn-primary"
                  onClick={() => handleOpenAddModal(day.key)}
                  style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                  aria-label={`Add task to ${day.label}`}
                >
                  <Plus size={15} strokeWidth={2.5} />
                  <span>Add Task</span>
                </button>
              </div>

              {/* Tasks List for this day */}
              {tasks.length === 0 ? (
                <div className="empty-state-box" style={{ padding: '24px' }}>
                  <p className="empty-state-title" style={{ fontSize: '0.95rem' }}>No tasks scheduled for {day.label}</p>
                  <p className="empty-state-desc" style={{ fontSize: '0.82rem' }}>
                    Click "+ Add Task" to schedule routines for this day.
                  </p>
                </div>
              ) : (
                <div
                  className="day-tasks-editor-list"
                  role="list"
                  style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
                >
                  {tasks.map((task, index) => {
                    const catConfig = CATEGORIES[task.category] || CATEGORIES.personal;
                    const isFirst = index === 0;
                    const isLast = index === tasks.length - 1;

                    return (
                      <div
                        key={task.id}
                        className="card task-editor-card"
                        draggable
                        onDragStart={(e) => handleDragStart(e, day.key, index)}
                        onDragOver={handleDragOver}
                        onDrop={(e) => handleDrop(e, day.key, index)}
                        style={{
                          padding: '10px 14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                          backgroundColor: 'var(--bg-card)',
                          boxShadow: 'var(--shadow-sm)',
                        }}
                      >
                        {/* Drag Handle & Reorder controls */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '2px', flexShrink: 0 }}>
                          <span
                            title="Drag to reorder"
                            style={{ cursor: 'grab', color: 'var(--text-muted)', display: 'inline-flex', padding: '4px' }}
                            aria-hidden="true"
                          >
                            <GripVertical size={16} />
                          </span>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                            <button
                              type="button"
                              className="btn-icon btn-secondary"
                              onClick={() => reorderTimetableTasks(day.key, index, index - 1)}
                              disabled={isFirst}
                              title="Move task up"
                              aria-label={`Move ${task.title} up`}
                              style={{ width: '22px', height: '22px', minHeight: '22px', padding: 0 }}
                            >
                              <ChevronUp size={12} />
                            </button>
                            <button
                              type="button"
                              className="btn-icon btn-secondary"
                              onClick={() => reorderTimetableTasks(day.key, index, index + 1)}
                              disabled={isLast}
                              title="Move task down"
                              aria-label={`Move ${task.title} down`}
                              style={{ width: '22px', height: '22px', minHeight: '22px', padding: 0 }}
                            >
                              <ChevronDown size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Task Details */}
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: '0.96rem',
                              fontWeight: 800,
                              color: 'var(--text-primary)',
                              marginBottom: '4px',
                              wordBreak: 'break-word',
                            }}
                          >
                            {task.title}
                          </div>

                          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
                            {/* Time badge showing start time and end time */}
                            <div
                              className="task-time-badge font-mono"
                              style={{
                                display: 'inline-flex',
                                alignItems: 'center',
                                gap: '4px',
                                fontSize: '0.78rem',
                                color: 'var(--text-secondary)',
                                fontWeight: 700,
                              }}
                            >
                              <Clock size={12} />
                              <span>{formatTaskTimeDisplay(task)}</span>
                            </div>

                            {/* Category Badge */}
                            <span
                              className="badge-pill"
                              style={{
                                backgroundColor: catConfig.badgeBg,
                                color: catConfig.badgeText,
                              }}
                            >
                              <span aria-hidden="true">{catConfig.icon}</span>
                              <span>{catConfig.label}</span>
                            </span>
                          </div>
                        </div>

                        {/* Action Buttons: Edit and Delete */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                          <button
                            type="button"
                            className="btn-icon btn-secondary"
                            onClick={() => handleOpenEditModal(day.key, task)}
                            title="Edit task"
                            aria-label={`Edit ${task.title}`}
                            style={{ width: '34px', height: '34px', minHeight: '34px', padding: 0 }}
                          >
                            <Edit2 size={15} />
                          </button>
                          <button
                            type="button"
                            className="btn-icon btn-secondary btn-task-delete"
                            onClick={() => deleteTimetableTask(day.key, task.id)}
                            title="Delete task from timetable"
                            aria-label={`Delete ${task.title}`}
                            style={{ width: '34px', height: '34px', minHeight: '34px', padding: 0 }}
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </section>
          );
        })}
      </div>

      {/* Add / Edit Timetable Task Modal */}
      <EditTimetableModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState({ isOpen: false, initialData: null, defaultDayKey: 'monday' })}
        onSave={handleSaveModal}
        initialData={modalState.initialData}
        defaultDayKey={modalState.defaultDayKey}
      />

      {/* Restore Default Timetable Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isRestoreModalOpen}
        onClose={() => setIsRestoreModalOpen(false)}
        onConfirm={restoreDefaults}
        title="Restore Default Timetable?"
        message="This will reset your routine for Monday through Sunday back to the original Habitix timetable. Your task completion checkmarks and streak records will NOT be deleted."
        confirmButtonText="Restore Defaults"
        isDestructive={false}
      />
    </div>
  );
}
