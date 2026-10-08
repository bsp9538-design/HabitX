// Habitix Categories
export const CATEGORIES = {
  college: {
    id: 'college',
    label: 'College',
    icon: '🎓',
    accent: '#62B6B7',
    badgeBg: '#E6F6F6',
    badgeText: '#243B53',
  },
  coding: {
    id: 'coding',
    label: 'Coding',
    icon: '💻',
    accent: '#243B53',
    badgeBg: '#E2E8F0',
    badgeText: '#243B53',
  },
  fitness: {
    id: 'fitness',
    label: 'Fitness',
    icon: '🏋️',
    accent: '#E9786A',
    badgeBg: '#FDEEEB',
    badgeText: '#243B53',
  },
  food: {
    id: 'food',
    label: 'Food',
    icon: '🍽️',
    accent: '#F6D97A',
    badgeBg: '#FEF9E7',
    badgeText: '#243B53',
  },
  personal: {
    id: 'personal',
    label: 'Personal',
    icon: '🧠',
    accent: '#805AD5',
    badgeBg: '#F3E8FF',
    badgeText: '#243B53',
  },
  sleep: {
    id: 'sleep',
    label: 'Sleep',
    icon: '😴',
    accent: '#3182CE',
    badgeBg: '#EBF8FF',
    badgeText: '#243B53',
  },
};

export const DAY_KEYS = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

export const DAY_CONFIGS = [
  { key: 'monday', label: 'Monday', dayIndex: 1, short: 'MON' },
  { key: 'tuesday', label: 'Tuesday', dayIndex: 2, short: 'TUE' },
  { key: 'wednesday', label: 'Wednesday', dayIndex: 3, short: 'WED' },
  { key: 'thursday', label: 'Thursday', dayIndex: 4, short: 'THU' },
  { key: 'friday', label: 'Friday', dayIndex: 5, short: 'FRI' },
  { key: 'saturday', label: 'Saturday', dayIndex: 6, short: 'SAT' },
  { key: 'sunday', label: 'Sunday', dayIndex: 0, short: 'SUN' },
];

// Helper to format task time display
export function formatTaskTimeDisplay(task) {
  if (!task) return 'Anytime';
  if (task.startTime && task.endTime) {
    return `${task.startTime}–${task.endTime}`;
  }
  if (task.startTime) {
    return task.startTime;
  }
  return task.time || 'Anytime';
}

// Monday Routine
const MON_ROUTINE = [
  { id: 'mon_1', startTime: '7:00 AM', endTime: '', time: '7:00 AM', title: 'Wake up', category: 'sleep' },
  { id: 'mon_2', startTime: '7:00 AM', endTime: '8:30 AM', time: '7:00–8:30 AM', title: 'Get ready + breakfast', category: 'food' },
  { id: 'mon_3', startTime: '8:40 AM', endTime: '9:00 AM', time: '8:40–9:00 AM', title: 'Travel to college', category: 'college' },
  { id: 'mon_4', startTime: '9:00 AM', endTime: '4:00 PM', time: '9:00 AM–4:00 PM', title: 'College', category: 'college' },
  { id: 'mon_5', startTime: '4:00 PM', endTime: '5:20 PM', time: '4:00–5:20 PM', title: 'Nap / reels / snack / relax', category: 'personal' },
  { id: 'mon_6', startTime: '5:30 PM', endTime: '7:40 PM', time: '5:30–7:40 PM', title: 'Gym + shower', category: 'fitness' },
  { id: 'mon_7', startTime: '7:40 PM', endTime: '8:10 PM', time: '7:40–8:10 PM', title: 'Dinner', category: 'food' },
  { id: 'mon_8', startTime: '8:10 PM', endTime: '10:00 PM', time: '8:10–10:00 PM', title: 'Coding Practice', category: 'coding' },
  { id: 'mon_9', startTime: '10:00 PM', endTime: '10:45 PM', time: '10:00–10:45 PM', title: 'College study / assignments', category: 'college' },
  { id: 'mon_10', startTime: '10:45 PM', endTime: '11:00 PM', time: '10:45–11:00 PM', title: 'Free time', category: 'personal' },
  { id: 'mon_11', startTime: '11:00 PM', endTime: '', time: '11:00 PM', title: 'Sleep', category: 'sleep' },
];

// Tuesday Routine
const TUE_ROUTINE = [
  { id: 'tue_1', startTime: '7:00 AM', endTime: '', time: '7:00 AM', title: 'Wake up', category: 'sleep' },
  { id: 'tue_2', startTime: '7:00 AM', endTime: '8:30 AM', time: '7:00–8:30 AM', title: 'Get ready + breakfast', category: 'food' },
  { id: 'tue_3', startTime: '8:40 AM', endTime: '9:00 AM', time: '8:40–9:00 AM', title: 'Travel to college', category: 'college' },
  { id: 'tue_4', startTime: '9:00 AM', endTime: '4:00 PM', time: '9:00 AM–4:00 PM', title: 'College', category: 'college' },
  { id: 'tue_5', startTime: '4:00 PM', endTime: '5:20 PM', time: '4:00–5:20 PM', title: 'Nap / reels / snack / relax', category: 'personal' },
  { id: 'tue_6', startTime: '5:30 PM', endTime: '7:40 PM', time: '5:30–7:40 PM', title: 'Gym + shower', category: 'fitness' },
  { id: 'tue_7', startTime: '7:40 PM', endTime: '8:10 PM', time: '7:40–8:10 PM', title: 'Dinner', category: 'food' },
  { id: 'tue_8', startTime: '8:10 PM', endTime: '10:00 PM', time: '8:10–10:00 PM', title: 'Coding Practice', category: 'coding' },
  { id: 'tue_9', startTime: '10:00 PM', endTime: '10:45 PM', time: '10:00–10:45 PM', title: 'College study / assignments', category: 'college' },
  { id: 'tue_10', startTime: '10:45 PM', endTime: '11:00 PM', time: '10:45–11:00 PM', title: 'Free time', category: 'personal' },
  { id: 'tue_11', startTime: '11:00 PM', endTime: '', time: '11:00 PM', title: 'Sleep', category: 'sleep' },
];

// Wednesday Routine
const WED_ROUTINE = [
  { id: 'wed_1', startTime: '7:00 AM', endTime: '', time: '7:00 AM', title: 'Wake up', category: 'sleep' },
  { id: 'wed_2', startTime: '7:00 AM', endTime: '8:30 AM', time: '7:00–8:30 AM', title: 'Get ready + breakfast', category: 'food' },
  { id: 'wed_3', startTime: '8:40 AM', endTime: '9:00 AM', time: '8:40–9:00 AM', title: 'Travel to college', category: 'college' },
  { id: 'wed_4', startTime: '9:00 AM', endTime: '4:50 PM', time: '9:00 AM–4:50 PM', title: 'College', category: 'college' },
  { id: 'wed_5', startTime: '4:50 PM', endTime: '5:20 PM', time: '4:50–5:20 PM', title: 'Nap / reels / snack / relax', category: 'personal' },
  { id: 'wed_6', startTime: '5:30 PM', endTime: '7:40 PM', time: '5:30–7:40 PM', title: 'Gym + shower', category: 'fitness' },
  { id: 'wed_7', startTime: '7:40 PM', endTime: '8:10 PM', time: '7:40–8:10 PM', title: 'Dinner', category: 'food' },
  { id: 'wed_8', startTime: '8:10 PM', endTime: '10:00 PM', time: '8:10–10:00 PM', title: 'Coding Practice', category: 'coding' },
  { id: 'wed_9', startTime: '10:00 PM', endTime: '10:45 PM', time: '10:00–10:45 PM', title: 'College study / assignments', category: 'college' },
  { id: 'wed_10', startTime: '10:45 PM', endTime: '11:00 PM', time: '10:45–11:00 PM', title: 'Free time', category: 'personal' },
  { id: 'wed_11', startTime: '11:00 PM', endTime: '', time: '11:00 PM', title: 'Sleep', category: 'sleep' },
];

// Thursday Routine
const THU_ROUTINE = [
  { id: 'thu_1', startTime: '7:00 AM', endTime: '', time: '7:00 AM', title: 'Wake up', category: 'sleep' },
  { id: 'thu_2', startTime: '7:00 AM', endTime: '8:30 AM', time: '7:00–8:30 AM', title: 'Get ready + breakfast', category: 'food' },
  { id: 'thu_3', startTime: '8:40 AM', endTime: '9:00 AM', time: '8:40–9:00 AM', title: 'Travel to college', category: 'college' },
  { id: 'thu_4', startTime: '9:00 AM', endTime: '4:50 PM', time: '9:00 AM–4:50 PM', title: 'College', category: 'college' },
  { id: 'thu_5', startTime: '4:50 PM', endTime: '5:20 PM', time: '4:50–5:20 PM', title: 'Nap / reels / snack / relax', category: 'personal' },
  { id: 'thu_6', startTime: '5:30 PM', endTime: '7:40 PM', time: '5:30–7:40 PM', title: 'Gym + shower', category: 'fitness' },
  { id: 'thu_7', startTime: '7:40 PM', endTime: '8:10 PM', time: '7:40–8:10 PM', title: 'Dinner', category: 'food' },
  { id: 'thu_8', startTime: '8:10 PM', endTime: '10:00 PM', time: '8:10–10:00 PM', title: 'Coding Practice', category: 'coding' },
  { id: 'thu_9', startTime: '10:00 PM', endTime: '10:45 PM', time: '10:00–10:45 PM', title: 'College study / assignments', category: 'college' },
  { id: 'thu_10', startTime: '10:45 PM', endTime: '11:00 PM', time: '10:45–11:00 PM', title: 'Free time', category: 'personal' },
  { id: 'thu_11', startTime: '11:00 PM', endTime: '', time: '11:00 PM', title: 'Sleep', category: 'sleep' },
];

// Friday Routine
const FRI_ROUTINE = [
  { id: 'fri_1', startTime: '7:00 AM', endTime: '', time: '7:00 AM', title: 'Wake up', category: 'sleep' },
  { id: 'fri_2', startTime: '7:00 AM', endTime: '8:30 AM', time: '7:00–8:30 AM', title: 'Get ready + breakfast', category: 'food' },
  { id: 'fri_3', startTime: '8:40 AM', endTime: '9:00 AM', time: '8:40–9:00 AM', title: 'Travel to college', category: 'college' },
  { id: 'fri_4', startTime: '9:00 AM', endTime: '4:50 PM', time: '9:00 AM–4:50 PM', title: 'College', category: 'college' },
  { id: 'fri_5', startTime: '4:50 PM', endTime: '5:20 PM', time: '4:50–5:20 PM', title: 'Nap / reels / snack / relax', category: 'personal' },
  { id: 'fri_6', startTime: '5:30 PM', endTime: '7:40 PM', time: '5:30–7:40 PM', title: 'Gym + shower', category: 'fitness' },
  { id: 'fri_7', startTime: '7:40 PM', endTime: '8:10 PM', time: '7:40–8:10 PM', title: 'Dinner', category: 'food' },
  { id: 'fri_8', startTime: '8:10 PM', endTime: '10:00 PM', time: '8:10–10:00 PM', title: 'Coding Practice', category: 'coding' },
  { id: 'fri_9', startTime: '10:00 PM', endTime: '10:45 PM', time: '10:00–10:45 PM', title: 'College study / assignments', category: 'college' },
  { id: 'fri_10', startTime: '10:45 PM', endTime: '11:00 PM', time: '10:45–11:00 PM', title: 'Free time', category: 'personal' },
  { id: 'fri_11', startTime: '11:00 PM', endTime: '', time: '11:00 PM', title: 'Sleep', category: 'sleep' },
];

// Saturday Routine
const SAT_ROUTINE = [
  { id: 'sat_1', startTime: '7:00 AM', endTime: '', time: '7:00 AM', title: 'Wake up', category: 'sleep' },
  { id: 'sat_2', startTime: '7:00 AM', endTime: '8:30 AM', time: '7:00–8:30 AM', title: 'Breakfast + get ready', category: 'food' },
  { id: 'sat_3', startTime: '9:00 AM', endTime: '11:00 AM', time: '9:00–11:00 AM', title: 'Coding Practice', category: 'coding' },
  { id: 'sat_4', startTime: '11:00 AM', endTime: '1:00 PM', time: '11:00 AM–1:00 PM', title: 'Break / lunch / personal time', category: 'food' },
  { id: 'sat_5', startTime: '1:00 PM', endTime: '3:00 PM', time: '1:00–3:00 PM', title: 'Projects / coding', category: 'coding' },
  { id: 'sat_6', startTime: '3:00 PM', endTime: '5:20 PM', time: '3:00–5:20 PM', title: 'Free time', category: 'personal' },
  { id: 'sat_7', startTime: '5:30 PM', endTime: '7:40 PM', time: '5:30–7:40 PM', title: 'Gym + shower', category: 'fitness' },
  { id: 'sat_8', startTime: '7:40 PM', endTime: '8:10 PM', time: '7:40–8:10 PM', title: 'Dinner', category: 'food' },
  { id: 'sat_9', startTime: '8:10 PM', endTime: '10:00 PM', time: '8:10–10:00 PM', title: 'Coding Practice', category: 'coding' },
  { id: 'sat_10', startTime: '10:00 PM', endTime: '11:00 PM', time: '10:00–11:00 PM', title: 'Relax', category: 'personal' },
  { id: 'sat_11', startTime: '11:00 PM', endTime: '', time: '11:00 PM', title: 'Sleep', category: 'sleep' },
];

// Sunday Routine
const SUN_ROUTINE = [
  { id: 'sun_1', startTime: '7:00 AM', endTime: '', time: '7:00 AM', title: 'Wake up', category: 'sleep' },
  { id: 'sun_2', startTime: '7:00 AM', endTime: '8:30 AM', time: '7:00–8:30 AM', title: 'Breakfast', category: 'food' },
  { id: 'sun_3', startTime: '9:00 AM', endTime: '10:30 AM', time: '9:00–10:30 AM', title: 'Coding Practice / revision', category: 'coding' },
  { id: 'sun_4', startTime: '10:30 AM', endTime: '11:00 AM', time: '10:30–11:00 AM', title: 'Weekly planning', category: 'personal' },
  { id: 'sun_5', startTime: '11:00 AM', endTime: '1:00 PM', time: '11:00 AM–1:00 PM', title: 'Projects / assignments', category: 'college' },
  { id: 'sun_6', startTime: '1:00 PM', endTime: '3:00 PM', time: '1:00–3:00 PM', title: 'Lunch + free time', category: 'food' },
  { id: 'sun_7', startTime: '3:00 PM', endTime: '5:20 PM', time: '3:00–5:20 PM', title: 'Personal time / hobbies', category: 'personal' },
  { id: 'sun_8', startTime: '5:30 PM', endTime: '7:40 PM', time: '5:30–7:40 PM', title: 'Gym + shower', category: 'fitness' },
  { id: 'sun_9', startTime: '7:40 PM', endTime: '8:10 PM', time: '7:40–8:10 PM', title: 'Dinner', category: 'food' },
  { id: 'sun_10', startTime: '8:10 PM', endTime: '9:30 PM', time: '8:10–9:30 PM', title: 'Coding Practice / revision', category: 'coding' },
  { id: 'sun_11', startTime: '9:30 PM', endTime: '10:00 PM', time: '9:30–10:00 PM', title: 'Prepare for Monday', category: 'personal' },
  { id: 'sun_12', startTime: '10:00 PM', endTime: '11:00 PM', time: '10:00–11:00 PM', title: 'Free time', category: 'personal' },
  { id: 'sun_13', startTime: '11:00 PM', endTime: '', time: '11:00 PM', title: 'Sleep', category: 'sleep' },
];

/**
 * Returns a cloned object of the default timetable for all 7 days
 */
export function getInitialDefaultTimetable() {
  return {
    monday: JSON.parse(JSON.stringify(MON_ROUTINE)),
    tuesday: JSON.parse(JSON.stringify(TUE_ROUTINE)),
    wednesday: JSON.parse(JSON.stringify(WED_ROUTINE)),
    thursday: JSON.parse(JSON.stringify(THU_ROUTINE)),
    friday: JSON.parse(JSON.stringify(FRI_ROUTINE)),
    saturday: JSON.parse(JSON.stringify(SAT_ROUTINE)),
    sunday: JSON.parse(JSON.stringify(SUN_ROUTINE)),
  };
}

/**
 * Returns default timetable tasks for a given day of week index (0 = Sun, 1 = Mon ... 6 = Sat)
 */
export function getDefaultTimetableForDay(dayIndex) {
  switch (dayIndex) {
    case 1:
      return MON_ROUTINE;
    case 2:
      return TUE_ROUTINE;
    case 3:
      return WED_ROUTINE;
    case 4:
      return THU_ROUTINE;
    case 5:
      return FRI_ROUTINE;
    case 6:
      return SAT_ROUTINE;
    case 0:
      return SUN_ROUTINE;
    default:
      return MON_ROUTINE;
  }
}
