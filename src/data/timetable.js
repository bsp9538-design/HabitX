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

// Monday & Tuesday Routine
const MON_TUE_ROUTINE = [
  { id: 'mon_tue_1', time: '7:00 AM', title: 'Wake up', category: 'sleep' },
  { id: 'mon_tue_2', time: '7:00–8:30 AM', title: 'Get ready + breakfast', category: 'food' },
  { id: 'mon_tue_3', time: '8:40–9:00 AM', title: 'Travel to college', category: 'college' },
  { id: 'mon_tue_4', time: '9:00 AM–4:00 PM', title: 'College', category: 'college' },
  { id: 'mon_tue_5', time: '4:00–5:20 PM', title: 'Nap / reels / snack / relax', category: 'personal' },
  { id: 'mon_tue_6', time: '5:30–7:40 PM', title: 'Gym + shower', category: 'fitness' },
  { id: 'mon_tue_7', time: '7:40–8:10 PM', title: 'Dinner', category: 'food' },
  { id: 'mon_tue_8', time: '8:10–10:00 PM', title: 'Coding Practice', category: 'coding' },
  { id: 'mon_tue_9', time: '10:00–10:45 PM', title: 'College study / assignments', category: 'college' },
  { id: 'mon_tue_10', time: '10:45–11:00 PM', title: 'Free time', category: 'personal' },
  { id: 'mon_tue_11', time: '11:00 PM', title: 'Sleep', category: 'sleep' },
];

// Wednesday, Thursday & Friday Routine (College until 4:50 PM)
const WED_THU_FRI_ROUTINE = [
  { id: 'wed_fri_1', time: '7:00 AM', title: 'Wake up', category: 'sleep' },
  { id: 'wed_fri_2', time: '7:00–8:30 AM', title: 'Get ready + breakfast', category: 'food' },
  { id: 'wed_fri_3', time: '8:40–9:00 AM', title: 'Travel to college', category: 'college' },
  { id: 'wed_fri_4', time: '9:00 AM–4:50 PM', title: 'College', category: 'college' },
  { id: 'wed_fri_5', time: '4:50–5:20 PM', title: 'Nap / reels / snack / relax', category: 'personal' },
  { id: 'wed_fri_6', time: '5:30–7:40 PM', title: 'Gym + shower', category: 'fitness' },
  { id: 'wed_fri_7', time: '7:40–8:10 PM', title: 'Dinner', category: 'food' },
  { id: 'wed_fri_8', time: '8:10–10:00 PM', title: 'Coding Practice', category: 'coding' },
  { id: 'wed_fri_9', time: '10:00–10:45 PM', title: 'College study / assignments', category: 'college' },
  { id: 'wed_fri_10', time: '10:45–11:00 PM', title: 'Free time', category: 'personal' },
  { id: 'wed_fri_11', time: '11:00 PM', title: 'Sleep', category: 'sleep' },
];

// Saturday Routine
const SAT_ROUTINE = [
  { id: 'sat_1', time: '7:00 AM', title: 'Wake up', category: 'sleep' },
  { id: 'sat_2', time: '7:00–8:30 AM', title: 'Breakfast + get ready', category: 'food' },
  { id: 'sat_3', time: '9:00–11:00 AM', title: 'Coding Practice', category: 'coding' },
  { id: 'sat_4', time: '11:00 AM–1:00 PM', title: 'Break / lunch / personal time', category: 'food' },
  { id: 'sat_5', time: '1:00–3:00 PM', title: 'Projects / coding', category: 'coding' },
  { id: 'sat_6', time: '3:00–5:20 PM', title: 'Free time', category: 'personal' },
  { id: 'sat_7', time: '5:30–7:40 PM', title: 'Gym + shower', category: 'fitness' },
  { id: 'sat_8', time: '7:40–8:10 PM', title: 'Dinner', category: 'food' },
  { id: 'sat_9', time: '8:10–10:00 PM', title: 'Coding Practice', category: 'coding' },
  { id: 'sat_10', time: '10:00–11:00 PM', title: 'Relax', category: 'personal' },
  { id: 'sat_11', time: '11:00 PM', title: 'Sleep', category: 'sleep' },
];

// Sunday Routine
const SUN_ROUTINE = [
  { id: 'sun_1', time: '7:00 AM', title: 'Wake up', category: 'sleep' },
  { id: 'sun_2', time: '7:00–8:30 AM', title: 'Breakfast', category: 'food' },
  { id: 'sun_3', time: '9:00–10:30 AM', title: 'Coding Practice / revision', category: 'coding' },
  { id: 'sun_4', time: '10:30–11:00 AM', title: 'Weekly planning', category: 'personal' },
  { id: 'sun_5', time: '11:00 AM–1:00 PM', title: 'Projects / assignments', category: 'college' },
  { id: 'sun_6', time: '1:00–3:00 PM', title: 'Lunch + free time', category: 'food' },
  { id: 'sun_7', time: '3:00–5:20 PM', title: 'Personal time / hobbies', category: 'personal' },
  { id: 'sun_8', time: '5:30–7:40 PM', title: 'Gym + shower', category: 'fitness' },
  { id: 'sun_9', time: '7:40–8:10 PM', title: 'Dinner', category: 'food' },
  { id: 'sun_10', time: '8:10–9:30 PM', title: 'Coding Practice / revision', category: 'coding' },
  { id: 'sun_11', time: '9:30–10:00 PM', title: 'Prepare for Monday', category: 'personal' },
  { id: 'sun_12', time: '10:00–11:00 PM', title: 'Free time', category: 'personal' },
  { id: 'sun_13', time: '11:00 PM', title: 'Sleep', category: 'sleep' },
];

/**
 * Returns default timetable tasks for a given day of week index (0 = Sun, 1 = Mon ... 6 = Sat)
 */
export function getDefaultTimetableForDay(dayIndex) {
  switch (dayIndex) {
    case 1: // Monday
    case 2: // Tuesday
      return MON_TUE_ROUTINE;
    case 3: // Wednesday
    case 4: // Thursday
    case 5: // Friday
      return WED_THU_FRI_ROUTINE;
    case 6: // Saturday
      return SAT_ROUTINE;
    case 0: // Sunday
      return SUN_ROUTINE;
    default:
      return MON_TUE_ROUTINE;
  }
}
