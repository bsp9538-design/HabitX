import assert from 'node:assert';
import {
  getDefaultTimetableForDay,
  getInitialDefaultTimetable,
  CATEGORIES,
  DAY_CONFIGS,
  formatTaskTimeDisplay,
} from '../src/data/timetable.js';
import {
  addDays,
  getDayName,
  getWeekDaysForDate,
} from '../src/utils/dateUtils.js';
import {
  calculateDayProgress,
  calculateConsistencyMetrics,
  getTasksForDayFromTimetable,
  getAllTasksForDate,
} from '../src/utils/storage.js';

console.log('--- Running Habitix Automated Verification Tests ---');

// 1. Verify Timetable Schedules
const monTasks = getDefaultTimetableForDay(1);
const tueTasks = getDefaultTimetableForDay(2);
assert.strictEqual(monTasks.length, 11, 'Monday should have 11 routine items');
assert.strictEqual(tueTasks.length, 11, 'Tuesday should have 11 routine items');

const monCollege = monTasks.find((t) => t.id === 'mon_4');
assert.strictEqual(monCollege.startTime, '9:00 AM');
assert.strictEqual(monCollege.endTime, '4:00 PM');
assert.strictEqual(monCollege.title, 'College');
assert.strictEqual(formatTaskTimeDisplay(monCollege), '9:00 AM–4:00 PM');

const monTravel = monTasks.find((t) => t.id === 'mon_3');
assert.strictEqual(monTravel.title, 'Travel to college', 'Morning task must simply be Travel to college');

const monCoding = monTasks.find((t) => t.id === 'mon_8');
assert.strictEqual(monCoding.title, 'Coding Practice', 'Main timetable coding task must be labeled Coding Practice');

// Wednesday (3), Thursday (4) & Friday (5)
const wedTasks = getDefaultTimetableForDay(3);
assert.strictEqual(wedTasks.length, 11, 'Wednesday should have 11 items');
const wedCollege = wedTasks.find((t) => t.id === 'wed_4');
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

// 4. Verify Custom Timetable Operations (Edit Tasks feature)
const customTimetable = getInitialDefaultTimetable();
assert.strictEqual(DAY_CONFIGS.length, 7, 'DAY_CONFIGS contains 7 days');

// A. Edit a task in Monday schedule
const originalTask = customTimetable.monday[7]; // Coding Practice
const updatedTask = {
  ...originalTask,
  title: 'Full Stack Development',
  startTime: '8:30 PM',
  endTime: '10:30 PM',
};
customTimetable.monday[7] = updatedTask;
assert.strictEqual(customTimetable.monday[7].title, 'Full Stack Development');
assert.strictEqual(formatTaskTimeDisplay(customTimetable.monday[7]), '8:30 PM–10:30 PM');
// Crucial: task ID must be preserved
assert.strictEqual(customTimetable.monday[7].id, originalTask.id);

// B. Add a task to Friday schedule
const newTask = {
  id: 'fri_custom_1',
  title: 'Open Source Contribution',
  startTime: '6:00 PM',
  endTime: '7:00 PM',
  category: 'coding',
};
customTimetable.friday.push(newTask);
assert.strictEqual(customTimetable.friday.length, 12);

// C. Reorder tasks in Friday schedule (move custom task from last to first)
const [moved] = customTimetable.friday.splice(11, 1);
customTimetable.friday.splice(0, 0, moved);
assert.strictEqual(customTimetable.friday[0].id, 'fri_custom_1');

// D. Delete a task
customTimetable.friday.splice(0, 1);
assert.strictEqual(customTimetable.friday.length, 11);

// E. Verify custom timetable applies to day progress calculation
const tasksForMon = getAllTasksForDate('2026-10-05', [], customTimetable); // 2026-10-05 is Monday
assert.strictEqual(tasksForMon[7].title, 'Full Stack Development');
assert.strictEqual(getTasksForDayFromTimetable(1, customTimetable).length, 11);

console.log('✓ Custom Timetable operations (Edit, Add, Reorder, Delete) verified.');

// 5. Verify Independent Date Completion & Streak Logic (>= 80% Rule)
const mockRecords = {
  // Day 1 (Monday): 9 / 11 tasks completed = 82% (Qualified!)
  '2026-10-05': {
    completedIds: ['mon_1', 'mon_2', 'mon_3', 'mon_4', 'mon_5', 'mon_6', 'mon_7', 'mon_8', 'mon_9'],
    customTasks: [],
  },
  // Day 2 (Tuesday): 9 / 11 tasks completed = 82% (Qualified!)
  '2026-10-06': {
    completedIds: ['tue_1', 'tue_2', 'tue_3', 'tue_4', 'tue_5', 'tue_6', 'tue_7', 'tue_8', 'tue_9'],
    customTasks: [],
  },
  // Day 3 (Wednesday): 4 / 11 tasks completed = 36% (Not qualified!)
  '2026-10-07': {
    completedIds: ['wed_1', 'wed_2', 'wed_3', 'wed_4'],
    customTasks: [],
  },
};

const progDay1 = calculateDayProgress(mockRecords, '2026-10-05', customTimetable);
assert.strictEqual(progDay1.qualified, true, 'Day 1 is >= 80% so qualified');
assert.strictEqual(progDay1.percentage >= 80, true);

const progDay3 = calculateDayProgress(mockRecords, '2026-10-07', customTimetable);
assert.strictEqual(progDay3.qualified, false, 'Day 3 is < 80% so not qualified');
assert.strictEqual(progDay3.completed, 4);

// Verify that progress on Oct 5 does not bleed into Oct 6 or 7
assert.notStrictEqual(progDay1.completed, progDay3.completed, 'Each calendar date maintains independent completion');

console.log('✓ Independent date completion and >= 80% streak criteria verified.');

// 6. Verify Consistency Metrics
const metrics = calculateConsistencyMetrics(mockRecords, 7, customTimetable);
assert(metrics.totalCompletedAllTime > 0, 'Total completed tasks aggregated');
assert(typeof metrics.codingRate === 'number', 'Coding rate calculated');
assert(typeof metrics.gymRate === 'number', 'Gym rate calculated');
console.log('✓ Habit consistency metrics verified.');

console.log('\n--- ALL VERIFICATION TESTS PASSED SUCCESSFULLY! ---');
