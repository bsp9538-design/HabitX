import assert from 'node:assert';
import { getDefaultTimetableForDay, CATEGORIES } from '../src/data/timetable.js';
import {
  addDays,
  getDayName,
  getWeekDaysForDate,
} from '../src/utils/dateUtils.js';
import {
  calculateDayProgress,
  calculateConsistencyMetrics,
} from '../src/utils/storage.js';

console.log('--- Running Habitix Automated Verification Tests ---');

// 1. Verify Timetable Schedules
// Monday (1) & Tuesday (2)
const monTasks = getDefaultTimetableForDay(1);
const tueTasks = getDefaultTimetableForDay(2);
assert.strictEqual(monTasks.length, 11, 'Monday should have 11 routine items');
assert.strictEqual(tueTasks.length, 11, 'Tuesday should have 11 routine items');

const monCollege = monTasks.find((t) => t.id === 'mon_tue_4');
assert.strictEqual(monCollege.time, '9:00 AM–4:00 PM', 'Mon college is 9:00 AM - 4:00 PM');
assert.strictEqual(monCollege.title, 'College');

const monTravel = monTasks.find((t) => t.id === 'mon_tue_3');
assert.strictEqual(monTravel.title, 'Travel to college', 'Morning task must simply be Travel to college');

const monCoding = monTasks.find((t) => t.id === 'mon_tue_8');
assert.strictEqual(monCoding.title, 'Coding Practice', 'Main timetable coding task must be labeled Coding Practice');

// Wednesday (3), Thursday (4) & Friday (5)
const wedTasks = getDefaultTimetableForDay(3);
assert.strictEqual(wedTasks.length, 11, 'Wednesday should have 11 items');
const wedCollege = wedTasks.find((t) => t.id === 'wed_fri_4');
assert.strictEqual(wedCollege.time, '9:00 AM–4:50 PM', 'Wed college is 9:00 AM - 4:50 PM');

// Saturday (6)
const satTasks = getDefaultTimetableForDay(6);
assert.strictEqual(satTasks.length, 11, 'Saturday should have 11 items');
assert(satTasks.some((t) => t.title === 'Projects / coding'), 'Saturday includes Projects / coding');

// Sunday (0)
const sunTasks = getDefaultTimetableForDay(0);
assert.strictEqual(sunTasks.length, 13, 'Sunday should have 13 items');
assert(sunTasks.some((t) => t.title === 'Weekly planning'), 'Sunday includes Weekly planning');
assert(sunTasks.some((t) => t.title === 'Prepare for Monday'), 'Sunday includes Prepare for Monday');

console.log('✓ Timetable routines verified for all 7 days of the week.');

// 2. Verify Categories
assert(CATEGORIES.college, 'College category exists');
assert(CATEGORIES.coding, 'Coding category exists');
assert(CATEGORIES.fitness, 'Fitness category exists');
assert(CATEGORIES.food, 'Food category exists');
assert(CATEGORIES.personal, 'Personal category exists');
assert(CATEGORIES.sleep, 'Sleep category exists');
console.log('✓ All 6 categories verified.');

// 3. Verify Date Arithmetic & Week Strip
const testDate = '2026-10-08'; // Thursday
assert.strictEqual(getDayName(testDate), 'Thursday');
assert.strictEqual(addDays(testDate, 1), '2026-10-09');
assert.strictEqual(addDays(testDate, -1), '2026-10-07');

const weekDays = getWeekDaysForDate(testDate, testDate);
assert.strictEqual(weekDays.length, 7, 'Week days must contain 7 days');
assert.strictEqual(weekDays[0].shortName, 'MON', 'Week starts with Monday');
assert.strictEqual(weekDays[6].shortName, 'SUN', 'Week ends with Sunday');
assert.strictEqual(weekDays[3].shortName, 'THU', 'Thursday is index 3');
assert.strictEqual(weekDays[3].isSelected, true, 'Thursday is selected');
console.log('✓ Date calculation and MON-SUN week strip verified.');

// 4. Verify Independent Date Completion & Streak Logic (>= 80% Rule)
const mockRecords = {
  // Day 1: 9 / 11 tasks completed = 82% (Qualified!)
  '2026-10-06': {
    completedIds: ['mon_tue_1', 'mon_tue_2', 'mon_tue_3', 'mon_tue_4', 'mon_tue_5', 'mon_tue_6', 'mon_tue_7', 'mon_tue_8', 'mon_tue_9'],
    customTasks: [],
  },
  // Day 2: 9 / 11 tasks completed = 82% (Qualified!)
  '2026-10-07': {
    completedIds: ['wed_fri_1', 'wed_fri_2', 'wed_fri_3', 'wed_fri_4', 'wed_fri_5', 'wed_fri_6', 'wed_fri_7', 'wed_fri_8', 'wed_fri_9'],
    customTasks: [],
  },
  // Day 3: 4 / 11 tasks completed = 36% (Not qualified!)
  '2026-10-08': {
    completedIds: ['wed_fri_1', 'wed_fri_2', 'wed_fri_3', 'wed_fri_4'],
    customTasks: [],
  },
};

const progDay1 = calculateDayProgress(mockRecords, '2026-10-06');
assert.strictEqual(progDay1.qualified, true, 'Day 1 is >= 80% so qualified');
assert.strictEqual(progDay1.percentage >= 80, true);

const progDay3 = calculateDayProgress(mockRecords, '2026-10-08');
assert.strictEqual(progDay3.qualified, false, 'Day 3 is < 80% so not qualified');
assert.strictEqual(progDay3.completed, 4);

// Verify that progress on Oct 6 does not bleed into Oct 7 or 8
assert.notStrictEqual(progDay1.completed, progDay3.completed, 'Each calendar date maintains independent completion');

console.log('✓ Independent date completion and >= 80% streak criteria verified.');

// 5. Verify Consistency Metrics
const metrics = calculateConsistencyMetrics(mockRecords, 7);
assert(metrics.totalCompletedAllTime > 0, 'Total completed tasks aggregated');
assert(typeof metrics.codingRate === 'number', 'Coding rate calculated');
assert(typeof metrics.gymRate === 'number', 'Gym rate calculated');
console.log('✓ Habit consistency metrics verified.');

console.log('\n--- ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
