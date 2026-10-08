/**
 * Utility functions for calendar dates and week calculations
 */

export const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const DAY_SHORT = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

/**
 * Format a Date to 'YYYY-MM-DD' using local timezone
 */
export function formatDateToISO(date = new Date()) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Get today's date string in 'YYYY-MM-DD'
 */
export function getTodayISO() {
  return formatDateToISO(new Date());
}

/**
 * Parse 'YYYY-MM-DD' safely into local Date object
 */
export function parseISODate(isoStr) {
  if (!isoStr) return new Date();
  const [year, month, day] = isoStr.split('-').map(Number);
  return new Date(year, month - 1, day);
}

/**
 * Add or subtract days from an ISO date string
 */
export function addDays(isoStr, days) {
  const d = parseISODate(isoStr);
  d.setDate(d.getDate() + days);
  return formatDateToISO(d);
}

/**
 * Get day of week index: 0 (Sunday) ... 6 (Saturday)
 */
export function getDayIndex(isoStr) {
  return parseISODate(isoStr).getDay();
}

/**
 * Get full day name e.g. 'Monday'
 */
export function getDayName(isoStr) {
  return DAY_NAMES[getDayIndex(isoStr)];
}

/**
 * Get short day uppercase label e.g. 'MON'
 */
export function getDayShortName(isoStr) {
  return DAY_SHORT[getDayIndex(isoStr)];
}

/**
 * Format date for friendly UI display e.g. 'Thursday, Oct 8, 2026'
 */
export function formatDisplayDate(isoStr) {
  const d = parseISODate(isoStr);
  return d.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Format short display date e.g. 'Oct 8'
 */
export function formatShortDate(isoStr) {
  const d = parseISODate(isoStr);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric'
  });
}

/**
 * Returns the Monday-to-Sunday 7-day array for the week containing isoStr
 */
export function getWeekDaysForDate(isoStr, selectedIso) {
  const date = parseISODate(isoStr);
  const currentDayOfWeek = date.getDay(); // 0 is Sunday, 1 is Monday
  
  // Calculate offset to Monday (1). If Sunday (0), Monday is 6 days ago.
  const distanceToMonday = currentDayOfWeek === 0 ? -6 : 1 - currentDayOfWeek;
  
  const monday = new Date(date);
  monday.setDate(monday.getDate() + distanceToMonday);

  const todayStr = getTodayISO();
  const weekDays = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday);
    dayDate.setDate(dayDate.getDate() + i);
    const dayIso = formatDateToISO(dayDate);
    const dayIdx = dayDate.getDay();

    weekDays.push({
      dateStr: dayIso,
      dayIndex: dayIdx,
      dayName: DAY_NAMES[dayIdx],
      shortName: DAY_SHORT[dayIdx],
      dayNumber: dayDate.getDate(),
      isToday: dayIso === todayStr,
      isSelected: dayIso === selectedIso,
    });
  }

  return weekDays;
}
