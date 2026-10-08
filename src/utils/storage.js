import {
  getInitialDefaultTimetable,
  DAY_KEYS,
} from '../data/timetable.js';
import { getDayIndex, getTodayISO, addDays } from './dateUtils.js';

const STORAGE_KEY = 'habitix_records_v1';
const TIMETABLE_STORAGE_KEY = 'habitix_custom_timetable_v1';
const THEME_KEY = 'habitix_theme';
const NOTIFICATIONS_KEY = 'habitix_notifications';

/**
 * Load all stored records from localStorage
 */
export function getStoredRecords() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Failed to read habitix records from localStorage:', err);
    return {};
  }
}

/**
 * Save all records to localStorage
 */
export function saveRecords(records) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (err) {
    console.error('Failed to save habitix records to localStorage:', err);
  }
}

/**
 * Load customized timetable from localStorage or initialize with defaults
 */
export function getStoredTimetable() {
  try {
    const raw = localStorage.getItem(TIMETABLE_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        // Ensure all 7 days exist
        const initial = getInitialDefaultTimetable();
        let complete = true;
        DAY_KEYS.forEach((k) => {
          if (!Array.isArray(parsed[k])) {
            parsed[k] = initial[k];
            complete = false;
          }
        });
        if (!complete) {
          saveStoredTimetable(parsed);
        }
        return parsed;
      }
    }
  } catch (err) {
    console.error('Failed to read custom timetable from localStorage:', err);
  }

  // Fallback to initial defaults
  const defaults = getInitialDefaultTimetable();
  saveStoredTimetable(defaults);
  return defaults;
}

/**
 * Save customized timetable to localStorage
 */
export function saveStoredTimetable(timetable) {
  try {
    localStorage.setItem(TIMETABLE_STORAGE_KEY, JSON.stringify(timetable));
  } catch (err) {
    console.error('Failed to save custom timetable to localStorage:', err);
  }
}

/**
 * Restore default timetable without deleting user's checklist history or settings
 */
export function restoreDefaultTimetable() {
  const defaults = getInitialDefaultTimetable();
  saveStoredTimetable(defaults);
  return defaults;
}

/**
 * Get timetable tasks for a specific day of the week index (0 = Sun, 1 = Mon ... 6 = Sat)
 */
export function getTasksForDayFromTimetable(dayIndex, timetable = null) {
  const currentTimetable = timetable || getStoredTimetable();
  const dayKey = DAY_KEYS[dayIndex] || 'monday';
  return currentTimetable[dayKey] || [];
}

/**
 * Get data record for a specific date
 */
export function getRecordForDate(records, dateStr) {
  return records[dateStr] || { completedIds: [], customTasks: [] };
}

/**
 * Combine customized timetable tasks and date-specific custom tasks for a specific date
 */
export function getAllTasksForDate(dateStr, customTasks = [], timetable = null) {
  const dayIdx = getDayIndex(dateStr);
  const baseTasks = getTasksForDayFromTimetable(dayIdx, timetable);
  return [...baseTasks, ...customTasks];
}

/**
 * Calculate completion status for a given date
 */
export function calculateDayProgress(records, dateStr, timetable = null) {
  const record = getRecordForDate(records, dateStr);
  const tasks = getAllTasksForDate(dateStr, record.customTasks || [], timetable);
  const total = tasks.length;
  
  if (total === 0) {
    return { total: 0, completed: 0, percentage: 0, qualified: false };
  }

  const completedSet = new Set(record.completedIds || []);
  const completed = tasks.filter((t) => completedSet.has(t.id)).length;
  const percentage = Math.round((completed / total) * 100);
  const qualified = percentage >= 80;

  return {
    total,
    completed,
    percentage,
    qualified,
  };
}

/**
 * Calculate current streak and best streak
 * A day qualifies when completion percentage >= 80%
 */
export function calculateStreakStats(records, timetable = null) {
  const todayStr = getTodayISO();
  const todayProgress = calculateDayProgress(records, todayStr, timetable);

  let currentStreak = 0;
  let cursorDate = todayStr;

  if (todayProgress.qualified) {
    currentStreak = 1;
    cursorDate = addDays(todayStr, -1);
    while (true) {
      const prog = calculateDayProgress(records, cursorDate, timetable);
      if (prog.qualified) {
        currentStreak++;
        cursorDate = addDays(cursorDate, -1);
      } else {
        break;
      }
    }
  } else {
    // Check if streak is still alive from yesterday
    cursorDate = addDays(todayStr, -1);
    const yesterdayProgress = calculateDayProgress(records, cursorDate, timetable);
    if (yesterdayProgress.qualified) {
      currentStreak = 1;
      cursorDate = addDays(cursorDate, -1);
      while (true) {
        const prog = calculateDayProgress(records, cursorDate, timetable);
        if (prog.qualified) {
          currentStreak++;
          cursorDate = addDays(cursorDate, -1);
        } else {
          break;
        }
      }
    } else {
      currentStreak = 0;
    }
  }

  // Calculate best streak across all recorded dates
  const recordedDates = Object.keys(records).sort();
  let bestStreak = currentStreak;
  let tempStreak = 0;

  // If there are recorded dates, evaluate consecutive days
  if (recordedDates.length > 0) {
    const earliestDate = recordedDates[0];
    let d = earliestDate;
    while (d <= todayStr) {
      const prog = calculateDayProgress(records, d, timetable);
      if (prog.qualified) {
        tempStreak++;
        if (tempStreak > bestStreak) {
          bestStreak = tempStreak;
        }
      } else {
        tempStreak = 0;
      }
      d = addDays(d, 1);
    }
  }

  return {
    currentStreak,
    bestStreak,
    todayQualified: todayProgress.qualified,
  };
}

/**
 * Calculate real category consistency metrics based on recorded activity
 */
export function calculateConsistencyMetrics(records, daysLookback = 14, timetable = null) {
  const todayStr = getTodayISO();
  let totalCompletedAllTime = 0;

  // Count total completed tasks across all recorded history
  Object.values(records).forEach((r) => {
    if (r && Array.isArray(r.completedIds)) {
      totalCompletedAllTime += r.completedIds.length;
    }
  });

  // Category specific tracking over the lookback window
  let codingScheduledDays = 0;
  let codingCompletedDays = 0;

  let gymScheduledDays = 0;
  let gymCompletedDays = 0;

  let sleepScheduledDays = 0;
  let sleepCompletedDays = 0;

  for (let i = 0; i < daysLookback; i++) {
    const dStr = addDays(todayStr, -i);
    const record = getRecordForDate(records, dStr);
    const tasks = getAllTasksForDate(dStr, record.customTasks || [], timetable);
    const completedSet = new Set(record.completedIds || []);

    // Coding tasks for this date
    const codingTasks = tasks.filter((t) => t.category === 'coding');
    if (codingTasks.length > 0) {
      codingScheduledDays++;
      if (codingTasks.some((t) => completedSet.has(t.id))) {
        codingCompletedDays++;
      }
    }

    // Gym tasks for this date
    const gymTasks = tasks.filter((t) => t.category === 'fitness' || t.title.toLowerCase().includes('gym'));
    if (gymTasks.length > 0) {
      gymScheduledDays++;
      if (gymTasks.some((t) => completedSet.has(t.id))) {
        gymCompletedDays++;
      }
    }

    // Sleep / Wake up tasks
    const sleepTasks = tasks.filter((t) => t.category === 'sleep');
    if (sleepTasks.length > 0) {
      sleepScheduledDays++;
      if (sleepTasks.some((t) => completedSet.has(t.id))) {
        sleepCompletedDays++;
      }
    }
  }

  const codingRate = codingScheduledDays > 0 ? Math.round((codingCompletedDays / codingScheduledDays) * 100) : 0;
  const gymRate = gymScheduledDays > 0 ? Math.round((gymCompletedDays / gymScheduledDays) * 100) : 0;
  const sleepRate = sleepScheduledDays > 0 ? Math.round((sleepCompletedDays / sleepScheduledDays) * 100) : 0;

  return {
    totalCompletedAllTime,
    codingRate,
    codingCompletedDays,
    codingScheduledDays,
    gymRate,
    gymCompletedDays,
    gymScheduledDays,
    sleepRate,
    sleepCompletedDays,
    sleepScheduledDays,
  };
}

/**
 * Theme persistence
 */
export function getSavedTheme() {
  return localStorage.getItem(THEME_KEY) || 'light';
}

export function saveTheme(theme) {
  localStorage.setItem(THEME_KEY, theme);
}

/**
 * Notification preference persistence
 */
export function getSavedNotificationPref() {
  return localStorage.getItem(NOTIFICATIONS_KEY) === 'true';
}

export function saveNotificationPref(enabled) {
  localStorage.setItem(NOTIFICATIONS_KEY, String(enabled));
}

/**
 * Clear all records
 */
export function clearAllRecords() {
  localStorage.removeItem(STORAGE_KEY);
  localStorage.removeItem(TIMETABLE_STORAGE_KEY);
}

/**
 * Export data to JSON string (includes both records and custom timetable)
 */
export function exportDataAsJSON() {
  const records = getStoredRecords();
  const timetable = getStoredTimetable();
  return JSON.stringify({
    version: 1,
    exportedAt: new Date().toISOString(),
    records,
    customTimetable: timetable,
  }, null, 2);
}

/**
 * Import data from JSON string
 */
export function importDataFromJSON(jsonString) {
  const parsed = JSON.parse(jsonString);
  if (typeof parsed !== 'object' || parsed === null) {
    throw new Error('Invalid backup format');
  }

  let importedRecords = {};
  let importedTimetable = null;

  if (parsed.records && typeof parsed.records === 'object') {
    importedRecords = parsed.records;
    if (parsed.customTimetable && typeof parsed.customTimetable === 'object') {
      importedTimetable = parsed.customTimetable;
    }
  } else {
    importedRecords = parsed;
  }

  saveRecords(importedRecords);
  if (importedTimetable) {
    saveStoredTimetable(importedTimetable);
  }

  return {
    records: importedRecords,
    customTimetable: importedTimetable || getStoredTimetable(),
  };
}
