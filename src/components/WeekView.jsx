import React from 'react';
import { ChevronLeft, ChevronRight, Flame, ArrowRight } from 'lucide-react';
import { useHabitix } from '../context/useHabitix';
import { getWeekDaysForDate, addDays, formatShortDate } from '../utils/dateUtils';
import { calculateDayProgress } from '../utils/storage';

export default function WeekView() {
  const { selectedDate, setSelectedDate, setActiveTab, records } = useHabitix();

  // Get 7 days for the week containing selectedDate
  const weekDays = getWeekDaysForDate(selectedDate, selectedDate);
  const startDay = weekDays[0];
  const endDay = weekDays[6];

  // Calculate stats for all 7 days
  const daysWithStats = weekDays.map((d) => {
    const stats = calculateDayProgress(records, d.dateStr);
    return {
      ...d,
      ...stats,
    };
  });

  // Calculate overall weekly completion
  const totalWeeklyTasks = daysWithStats.reduce((sum, d) => sum + d.total, 0);
  const totalWeeklyCompleted = daysWithStats.reduce((sum, d) => sum + d.completed, 0);
  const weeklyAveragePct = totalWeeklyTasks > 0
    ? Math.round((totalWeeklyCompleted / totalWeeklyTasks) * 100)
    : 0;

  const handleDayClick = (dateStr) => {
    setSelectedDate(dateStr);
    setActiveTab('today');
  };

  const handlePrevWeek = () => {
    setSelectedDate((curr) => addDays(curr, -7));
  };

  const handleNextWeek = () => {
    setSelectedDate((curr) => addDays(curr, 7));
  };

  return (
    <div className="week-view-wrapper">
      {/* Week Navigation Header */}
      <div className="card" style={{ marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, textTransform: 'uppercase' }}>
              Weekly Timetable Overview
            </h2>
            <p className="font-mono" style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
              {formatShortDate(startDay.dateStr)} – {formatShortDate(endDay.dateStr)}, {startDay.dateStr.split('-')[0]}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button
              type="button"
              className="btn-icon btn-secondary"
              onClick={handlePrevWeek}
              aria-label="Previous Week"
              title="Previous Week"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="btn-icon btn-secondary"
              onClick={handleNextWeek}
              aria-label="Next Week"
              title="Next Week"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>

        {/* Weekly Completion Summary Bar */}
        <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid var(--border-neutral)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.85rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Weekly Completion
            </span>
            <span className="font-mono" style={{ fontSize: '1.25rem', fontWeight: 900 }}>
              {weeklyAveragePct}%
            </span>
          </div>

          <div
            className="progress-bar-container"
            role="progressbar"
            aria-valuenow={weeklyAveragePct}
            aria-valuemin={0}
            aria-valuemax={100}
          >
            <div className="progress-bar-fill" style={{ width: `${weeklyAveragePct}%` }} />
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontSize: '0.85rem' }}>
            <span className="font-mono" style={{ color: 'var(--text-secondary)', fontWeight: 700 }}>
              {totalWeeklyCompleted} / {totalWeeklyTasks} tasks completed
            </span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Click any day to open its routine
            </span>
          </div>
        </div>
      </div>

      {/* 7 Day Cards Grid: MON - SUN */}
      <div className="week-grid" role="list" aria-label="Weekly Routine Days">
        {daysWithStats.map((day) => {
          return (
            <div
              key={day.dateStr}
              className={`card week-day-card ${day.isSelected ? 'selected-day' : ''}`}
              onClick={() => handleDayClick(day.dateStr)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  handleDayClick(day.dateStr);
                }
              }}
              aria-label={`${day.dayName}, ${day.dateStr}, ${day.percentage}% completed`}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase' }}>
                    {day.shortName}
                  </h3>
                  <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 700 }}>
                    {formatShortDate(day.dateStr)}
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '8px 0 6px 0' }}>
                  <span className="font-mono" style={{ fontSize: '1.5rem', fontWeight: 900, color: 'var(--text-primary)' }}>
                    {day.percentage}%
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                    {day.completed} / {day.total} tasks
                  </span>
                </div>

                {/* Progress bar */}
                <div
                  className="progress-bar-container"
                  style={{ height: '14px', marginBottom: '8px' }}
                >
                  <div className="progress-bar-fill" style={{ width: `${day.percentage}%` }} />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-neutral)', paddingTop: '10px' }}>
                {day.qualified ? (
                  <span className="badge-pill" style={{ backgroundColor: 'var(--yellow)', color: '#243B53' }}>
                    <Flame size={12} color="#E9786A" />
                    Streak Met
                  </span>
                ) : (
                  <span style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
                    {day.total - day.completed > 0 ? `${day.total - day.completed} left` : 'All set'}
                  </span>
                )}

                <span style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                  <span>Open</span>
                  <ArrowRight size={14} />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
