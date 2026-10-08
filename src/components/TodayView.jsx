import React, { useState } from 'react';
import { Plus, RotateCcw, Flame, Trophy, ListTodo } from 'lucide-react';
import { useHabitix } from '../context/useHabitix';
import DaySelector from './DaySelector';
import ProgressBar from './ProgressBar';
import TaskCard from './TaskCard';
import AddTaskModal from './AddTaskModal';
import ResetConfirmModal from './ResetConfirmModal';
import { CATEGORIES } from '../data/timetable';
import { formatShortDate } from '../utils/dateUtils';

export default function TodayView() {
  const {
    selectedDate,
    currentDayTasks,
    currentDayCompletedIds,
    streakStats,
    resetCurrentDay,
    addCustomTask,
    updateCustomTask,
  } = useHabitix();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);

  const handleOpenAddModal = () => {
    setEditingTask(null);
    setIsAddModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsAddModalOpen(true);
  };

  const handleSaveTask = (taskData) => {
    if (editingTask) {
      updateCustomTask(editingTask.id, taskData);
    } else {
      addCustomTask(taskData);
    }
  };

  // Group today's category stats
  const categoryStats = React.useMemo(() => {
    const stats = {};
    const completedSet = new Set(currentDayCompletedIds);

    currentDayTasks.forEach((task) => {
      const catKey = task.category || 'personal';
      if (!stats[catKey]) {
        stats[catKey] = { total: 0, completed: 0 };
      }
      stats[catKey].total += 1;
      if (completedSet.has(task.id)) {
        stats[catKey].completed += 1;
      }
    });

    return stats;
  }, [currentDayTasks, currentDayCompletedIds]);

  return (
    <div className="today-view-wrapper">
      <DaySelector />

      <div className="today-dashboard-grid">
        {/* Main Routine & Checklist Column */}
        <div className="tasks-main-column">
          <ProgressBar />

          {/* Routine Toolbar */}
          <div className="tasks-toolbar">
            <h3 className="tasks-section-title">
              <ListTodo size={20} />
              <span>Timetable & Habits</span>
            </h3>

            <div className="tasks-actions-group">
              <button
                type="button"
                className="btn-secondary"
                onClick={() => setIsResetConfirmOpen(true)}
                title="Reset checkmarks for this day only"
                style={{ fontSize: '0.82rem', padding: '6px 12px' }}
              >
                <RotateCcw size={14} />
                <span>Reset Day</span>
              </button>

              <button
                type="button"
                className="btn-primary"
                onClick={handleOpenAddModal}
                style={{ fontSize: '0.85rem', padding: '6px 14px' }}
              >
                <Plus size={16} strokeWidth={2.5} />
                <span>Add Task</span>
              </button>
            </div>
          </div>

          {/* Checklist Items */}
          <div className="tasks-list" role="list" aria-label="Daily Routine Checklist">
            {currentDayTasks.length === 0 ? (
              <div className="empty-state-box">
                <p className="empty-state-title">No tasks for this date</p>
                <p className="empty-state-desc">Click "+ Add Task" to schedule custom habits or tasks.</p>
              </div>
            ) : (
              currentDayTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEditTask}
                />
              ))
            )}
          </div>
        </div>

        {/* Desktop Sidebar / Motivating Insights */}
        <aside className="today-sidebar-column" aria-label="Streak and Category Insights">
          {/* Streak Overview Card */}
          <div className="card streak-card">
            <div className="streak-card-inner">
              <div>
                <span className="badge-pill" style={{ backgroundColor: 'var(--yellow)', color: '#243B53', marginBottom: '8px' }}>
                  <Flame size={12} color="#E9786A" />
                  Streak System
                </span>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  Current Streak
                </div>
                <div className="streak-number-giant font-mono">
                  {streakStats.currentStreak} <span style={{ fontSize: '1rem', fontWeight: 700 }}>DAYS</span>
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 800, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>
                  Best Record
                </div>
                <div className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                  <Trophy size={16} style={{ display: 'inline', verticalAlign: '-2px', marginRight: '4px', color: '#D69E2E' }} />
                  {streakStats.bestStreak}
                </div>
              </div>
            </div>

            <div style={{ marginTop: '12px', fontSize: '0.78rem', color: 'var(--text-secondary)', borderTop: '1px solid var(--border-neutral)', paddingTop: '8px' }}>
              ⚡ Maintain <strong style={{ color: 'var(--text-primary)' }}>≥ 80%</strong> daily completion to keep your streak going!
            </div>
          </div>

          {/* Category Breakdown Card */}
          <div className="card category-breakdown-card">
            <h4 style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Daily Focus Breakdown
            </h4>

            <div className="category-list">
              {Object.keys(categoryStats).map((catKey) => {
                const conf = CATEGORIES[catKey] || CATEGORIES.personal;
                const { completed, total } = categoryStats[catKey];
                const isAllDone = total > 0 && completed === total;

                return (
                  <div key={catKey} className="category-stat-row">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}>
                      <span aria-hidden="true">{conf.icon}</span>
                      <span>{conf.label}</span>
                    </span>

                    <span className="font-mono" style={{ fontWeight: 800, color: isAllDone ? 'var(--teal)' : 'var(--text-primary)' }}>
                      {completed} / {total}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </aside>
      </div>

      {/* Add / Edit Task Modal */}
      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleSaveTask}
        initialData={editingTask}
      />

      {/* Reset Day Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetCurrentDay}
        title="Reset Selected Day?"
        message={`Are you sure you want to uncheck all tasks for ${formatShortDate(selectedDate)}? Only this date will be reset; other days will not be affected.`}
        confirmButtonText="Reset This Day"
        isDestructive={false}
      />
    </div>
  );
}
