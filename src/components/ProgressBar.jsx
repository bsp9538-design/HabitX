import React from 'react';
import { Target, Flame } from 'lucide-react';
import { useHabitix } from '../context/useHabitix';

export default function ProgressBar() {
  const { currentDayProgress } = useHabitix();
  const { completed, total, percentage, qualified } = currentDayProgress;

  return (
    <div className="card progress-card card-teal-edge" aria-label="Daily Progress">
      <div className="progress-header-row">
        <div className="progress-title-badge">
          <Target size={16} />
          <span>Daily Progress</span>
        </div>
        <div className="progress-pct-display font-mono">
          {percentage}%
        </div>
      </div>

      {/* Visual Progress Bar with solid teal fill */}
      <div
        className="progress-bar-container"
        role="progressbar"
        aria-valuenow={percentage}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label="Habit completion progress"
      >
        <div
          className="progress-bar-fill"
          style={{ width: `${Math.min(100, Math.max(0, percentage))}%` }}
        />
      </div>

      <div className="progress-footer-row">
        <div className="progress-ratio-text font-mono">
          {completed} / {total} completed
        </div>

        {qualified ? (
          <div className="streak-goal-banner">
            <Flame size={14} color="#E9786A" />
            <span>Streak Goal Achieved (≥ 80%)</span>
          </div>
        ) : total > 0 ? (
          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Reach 80% to keep your streak!
          </div>
        ) : null}
      </div>
    </div>
  );
}
