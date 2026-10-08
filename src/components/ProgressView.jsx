import React from 'react';
import { Flame, Trophy, CheckCircle, BarChart3, Code2, Dumbbell, Moon, Info } from 'lucide-react';
import { useHabitix } from '../context/useHabitix';
import { getTodayISO, addDays, getDayShortName, formatShortDate } from '../utils/dateUtils';
import { calculateDayProgress, calculateConsistencyMetrics } from '../utils/storage';

export default function ProgressView() {
  const { streakStats, records } = useHabitix();
  const todayStr = getTodayISO();

  // Compute consistency metrics from real data (last 14 days lookback)
  const consistency = calculateConsistencyMetrics(records, 14);

  // Compute 7-day completion trend (last 7 days ending today)
  const recentDays = [];
  for (let i = 6; i >= 0; i--) {
    const dStr = addDays(todayStr, -i);
    const progress = calculateDayProgress(records, dStr);
    recentDays.push({
      dateStr: dStr,
      dayShort: getDayShortName(dStr),
      displayDate: formatShortDate(dStr),
      isToday: dStr === todayStr,
      ...progress,
    });
  }

  // Calculate this week's completion average
  const totalRecentTasks = recentDays.reduce((acc, d) => acc + d.total, 0);
  const completedRecentTasks = recentDays.reduce((acc, d) => acc + d.completed, 0);
  const weeklyPct = totalRecentTasks > 0
    ? Math.round((completedRecentTasks / totalRecentTasks) * 100)
    : 0;

  return (
    <div className="progress-view-wrapper">
      {/* 4 Overview Metric Cards */}
      <div className="stats-overview-grid">
        {/* Current Streak */}
        <div className="card stat-metric-card card-yellow-edge">
          <div className="stat-label-small" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Flame size={14} color="#E9786A" />
            <span>Current Streak</span>
          </div>
          <div className="stat-value-big font-mono">
            {streakStats.currentStreak} <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>DAYS</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {streakStats.todayQualified ? '🔥 Qualified today' : 'Maintain ≥ 80% today'}
          </div>
        </div>

        {/* Best Streak */}
        <div className="card stat-metric-card card-yellow-edge">
          <div className="stat-label-small" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Trophy size={14} color="#D69E2E" />
            <span>Best Streak</span>
          </div>
          <div className="stat-value-big font-mono">
            {streakStats.bestStreak} <span style={{ fontSize: '0.9rem', fontWeight: 700 }}>DAYS</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            All-time longest streak
          </div>
        </div>

        {/* 7-Day Completion */}
        <div className="card stat-metric-card card-teal-edge">
          <div className="stat-label-small" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BarChart3 size={14} color="var(--teal)" />
            <span>Weekly Average</span>
          </div>
          <div className="stat-value-big font-mono">
            {weeklyPct}%
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Across last 7 calendar days
          </div>
        </div>

        {/* All-time Completed Tasks */}
        <div className="card stat-metric-card" style={{ borderTop: '5px solid var(--primary-dark)' }}>
          <div className="stat-label-small" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <CheckCircle size={14} color="var(--primary-dark)" />
            <span>Completed Tasks</span>
          </div>
          <div className="stat-value-big font-mono">
            {consistency.totalCompletedAllTime}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Total checked habits
          </div>
        </div>
      </div>

      {/* Routine Consistency Cards */}
      <div className="card" style={{ marginBottom: '24px' }}>
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '14px' }}>
          Core Routine Consistency
        </h3>

        <div className="consistency-section">
          {/* Coding Consistency */}
          <div className="card consistency-card coding">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Code2 size={18} color="var(--primary-dark)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Coding Practice
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <span className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 900 }}>
                {consistency.codingRate}%
              </span>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {consistency.codingCompletedDays} / {consistency.codingScheduledDays} days
              </span>
            </div>

            <div className="progress-bar-container" style={{ height: '12px' }}>
              <div
                className="progress-bar-fill"
                style={{ width: `${consistency.codingRate}%`, backgroundColor: 'var(--primary-dark)' }}
              />
            </div>
          </div>

          {/* Gym Consistency */}
          <div className="card consistency-card gym">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Dumbbell size={18} color="var(--coral)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Gym & Fitness
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <span className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 900 }}>
                {consistency.gymRate}%
              </span>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {consistency.gymCompletedDays} / {consistency.gymScheduledDays} days
              </span>
            </div>

            <div className="progress-bar-container" style={{ height: '12px' }}>
              <div
                className="progress-bar-fill"
                style={{ width: `${consistency.gymRate}%`, backgroundColor: 'var(--coral)' }}
              />
            </div>
          </div>

          {/* Sleep Consistency */}
          <div className="card consistency-card sleep">
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <Moon size={18} color="var(--teal)" />
              <span style={{ fontSize: '0.88rem', fontWeight: 800, textTransform: 'uppercase' }}>
                Sleep Adherence
              </span>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '6px' }}>
              <span className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 900 }}>
                {consistency.sleepRate}%
              </span>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                {consistency.sleepCompletedDays} / {consistency.sleepScheduledDays} days
              </span>
            </div>

            <div className="progress-bar-container" style={{ height: '12px' }}>
              <div
                className="progress-bar-fill"
                style={{ width: `${consistency.sleepRate}%`, backgroundColor: 'var(--teal)' }}
              />
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '8px' }}>
          <Info size={14} />
          <span>Consistency is computed dynamically from recorded habit completions in the last 14 days.</span>
        </div>
      </div>

      {/* 7-Day Real Completion Bar Chart */}
      <div className="card chart-container-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase' }}>
            Last 7 Days Activity
          </h3>
          <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            Goal: ≥ 80% (Streak target)
          </span>
        </div>

        <div className="chart-bars-wrapper" aria-label="7 Day Activity Chart">
          {recentDays.map((d) => {
            const barHeightPct = Math.max(4, d.percentage);
            const isQualified = d.qualified;

            return (
              <div key={d.dateStr} className="chart-bar-col">
                <span className="chart-bar-pct font-mono">
                  {d.percentage}%
                </span>

                <div
                  className="chart-bar-fill"
                  style={{
                    height: `${barHeightPct}%`,
                    backgroundColor: isQualified ? 'var(--yellow)' : 'var(--teal)',
                  }}
                  title={`${d.displayDate}: ${d.completed}/${d.total} (${d.percentage}%)`}
                />

                <span className="chart-bar-label">
                  {d.dayShort}
                </span>
                <span className="font-mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                  {d.displayDate}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
