import React, { useState, useEffect, useCallback } from 'react';
import confetti from 'canvas-confetti';
import { HabitixContext } from './HabitixContextDefinition';
import {
  getStoredRecords,
  saveRecords,
  getStoredTimetable,
  saveStoredTimetable,
  restoreDefaultTimetable,
  getRecordForDate,
  getAllTasksForDate,
  calculateDayProgress,
  calculateStreakStats,
  getSavedTheme,
  saveTheme,
  getSavedNotificationPref,
  saveNotificationPref,
  clearAllRecords,
  importDataFromJSON,
} from '../utils/storage';
import { getTodayISO, addDays } from '../utils/dateUtils';
import { formatTaskTimeDisplay } from '../data/timetable';

export function HabitixProvider({ children }) {
  // Navigation & Date State
  const [activeTab, setActiveTab] = useState('today');
  const [selectedDate, setSelectedDate] = useState(getTodayISO);

  // Theme State (default: light)
  const [theme, setTheme] = useState(getSavedTheme);

  // Notification State
  const [notificationsEnabled, setNotificationsEnabled] = useState(getSavedNotificationPref);

  // Main Records State (Completed task IDs by date)
  const [records, setRecords] = useState(getStoredRecords);

  // Customized Timetable State (Monday–Sunday routines)
  const [customTimetable, setCustomTimetable] = useState(getStoredTimetable);

  // PWA Install Prompt State
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isInstallable, setIsInstallable] = useState(false);

  // Apply theme to HTML root
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    saveTheme(theme);
  }, [theme]);

  // Listen for PWA beforeinstallprompt
  useEffect(() => {
    const handleBeforeInstall = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    window.addEventListener('appinstalled', () => {
      setDeferredPrompt(null);
      setIsInstallable(false);
      console.log('Habitix PWA was installed successfully');
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
    };
  }, []);

  // Update records in localStorage when state changes
  const updateRecords = useCallback((updater) => {
    setRecords((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveRecords(next);
      return next;
    });
  }, []);

  // Update timetable in localStorage
  const updateCustomTimetable = useCallback((updater) => {
    setCustomTimetable((prev) => {
      const next = typeof updater === 'function' ? updater(prev) : updater;
      saveStoredTimetable(next);
      return next;
    });
  }, []);

  // Current day data computations (reactive to customTimetable changes)
  const currentRecord = getRecordForDate(records, selectedDate);
  const currentDayTasks = getAllTasksForDate(selectedDate, currentRecord.customTasks || [], customTimetable);
  const currentDayCompletedIds = currentRecord.completedIds || [];
  const currentDayProgress = calculateDayProgress(records, selectedDate, customTimetable);
  const streakStats = calculateStreakStats(records, customTimetable);

  // Toggle Theme
  const toggleTheme = useCallback(() => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  // Toggle Task Completion for selected date
  const toggleTask = useCallback(
    (taskId) => {
      updateRecords((prevRecords) => {
        const record = prevRecords[selectedDate] || { completedIds: [], customTasks: [] };
        const exists = record.completedIds.includes(taskId);
        const newCompletedIds = exists
          ? record.completedIds.filter((id) => id !== taskId)
          : [...record.completedIds, taskId];

        const updated = {
          ...prevRecords,
          [selectedDate]: {
            ...record,
            completedIds: newCompletedIds,
          },
        };

        // If today and newly crossed 80%, celebrate with subtle confetti!
        if (!exists && selectedDate === getTodayISO()) {
          const tasks = getAllTasksForDate(selectedDate, record.customTasks || [], customTimetable);
          const pct = Math.round((newCompletedIds.length / (tasks.length || 1)) * 100);
          if (pct >= 80) {
            try {
              confetti({
                particleCount: 50,
                spread: 60,
                origin: { y: 0.7 },
                colors: ['#62B6B7', '#E9786A', '#F6D97A', '#243B53'],
              });
            } catch {
              // Ignore if canvas confetti is not supported
            }
          }
        }

        return updated;
      });
    },
    [selectedDate, updateRecords, customTimetable]
  );

  // Reset Current Selected Date only
  const resetCurrentDay = useCallback(() => {
    updateRecords((prevRecords) => {
      const record = prevRecords[selectedDate] || { completedIds: [], customTasks: [] };
      return {
        ...prevRecords,
        [selectedDate]: {
          ...record,
          completedIds: [],
        },
      };
    });
  }, [selectedDate, updateRecords]);

  // Timetable Customization: Update task in a specific day
  const updateTimetableTask = useCallback(
    (dayKey, taskId, updatedFields) => {
      updateCustomTimetable((prev) => {
        const dayTasks = prev[dayKey] || [];
        const updatedDayTasks = dayTasks.map((t) => {
          if (t.id === taskId) {
            const merged = { ...t, ...updatedFields };
            return {
              ...merged,
              time: formatTaskTimeDisplay(merged),
            };
          }
          return t;
        });
        return {
          ...prev,
          [dayKey]: updatedDayTasks,
        };
      });
    },
    [updateCustomTimetable]
  );

  // Timetable Customization: Add task to a specific day
  const addTimetableTask = useCallback(
    (dayKey, taskData) => {
      const newTask = {
        id: `${dayKey}_task_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
        title: taskData.title.trim(),
        startTime: taskData.startTime?.trim() || '',
        endTime: taskData.endTime?.trim() || '',
        time: formatTaskTimeDisplay(taskData),
        category: taskData.category || 'personal',
      };

      updateCustomTimetable((prev) => ({
        ...prev,
        [dayKey]: [...(prev[dayKey] || []), newTask],
      }));
    },
    [updateCustomTimetable]
  );

  // Timetable Customization: Delete task from a specific day
  const deleteTimetableTask = useCallback(
    (dayKey, taskId) => {
      updateCustomTimetable((prev) => ({
        ...prev,
        [dayKey]: (prev[dayKey] || []).filter((t) => t.id !== taskId),
      }));
    },
    [updateCustomTimetable]
  );

  // Timetable Customization: Reorder tasks within a day
  const reorderTimetableTasks = useCallback(
    (dayKey, fromIndex, toIndex) => {
      updateCustomTimetable((prev) => {
        const dayTasks = [...(prev[dayKey] || [])];
        if (fromIndex < 0 || fromIndex >= dayTasks.length || toIndex < 0 || toIndex >= dayTasks.length) {
          return prev;
        }
        const [moved] = dayTasks.splice(fromIndex, 1);
        dayTasks.splice(toIndex, 0, moved);
        return {
          ...prev,
          [dayKey]: dayTasks,
        };
      });
    },
    [updateCustomTimetable]
  );

  // Restore Default Timetable
  const restoreDefaults = useCallback(() => {
    const restored = restoreDefaultTimetable();
    setCustomTimetable(restored);
  }, []);

  // Add Custom Task to current date (one-off date task)
  const addCustomTask = useCallback(
    (taskData) => {
      const newTask = {
        id: 'custom_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
        title: taskData.title.trim(),
        time: taskData.time.trim() || 'Anytime',
        category: taskData.category || 'personal',
        isCustom: true,
      };

      updateRecords((prevRecords) => {
        const record = prevRecords[selectedDate] || { completedIds: [], customTasks: [] };
        return {
          ...prevRecords,
          [selectedDate]: {
            ...record,
            customTasks: [...(record.customTasks || []), newTask],
          },
        };
      });
    },
    [selectedDate, updateRecords]
  );

  // Update Custom Task (one-off date task)
  const updateCustomTask = useCallback(
    (taskId, updatedFields) => {
      updateRecords((prevRecords) => {
        const record = prevRecords[selectedDate] || { completedIds: [], customTasks: [] };
        const updatedCustomTasks = (record.customTasks || []).map((t) =>
          t.id === taskId ? { ...t, ...updatedFields } : t
        );
        return {
          ...prevRecords,
          [selectedDate]: {
            ...record,
            customTasks: updatedCustomTasks,
          },
        };
      });
    },
    [selectedDate, updateRecords]
  );

  // Delete Custom Task (one-off date task)
  const deleteCustomTask = useCallback(
    (taskId) => {
      updateRecords((prevRecords) => {
        const record = prevRecords[selectedDate] || { completedIds: [], customTasks: [] };
        return {
          ...prevRecords,
          [selectedDate]: {
            ...record,
            completedIds: (record.completedIds || []).filter((id) => id !== taskId),
            customTasks: (record.customTasks || []).filter((t) => t.id !== taskId),
          },
        };
      });
    },
    [selectedDate, updateRecords]
  );

  // Toggle Notifications
  const toggleNotifications = useCallback(async () => {
    if (!('Notification' in window)) {
      alert('This browser does not support desktop notifications.');
      return;
    }

    if (Notification.permission === 'granted') {
      const nextState = !notificationsEnabled;
      setNotificationsEnabled(nextState);
      saveNotificationPref(nextState);
    } else if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      if (permission === 'granted') {
        setNotificationsEnabled(true);
        saveNotificationPref(true);
        new Notification('Habitix Notifications Enabled', {
          body: 'Habitix will keep you motivated with your college & coding routine!',
          icon: './favicon-32x32.png',
        });
      } else {
        setNotificationsEnabled(false);
        saveNotificationPref(false);
      }
    } else {
      alert('Notifications are blocked in your browser settings. Please enable them in browser settings.');
    }
  }, [notificationsEnabled]);

  // Install PWA
  const installPwa = useCallback(async () => {
    if (!deferredPrompt) {
      alert('To install Habitix on your phone or tablet:\n\n1. Open your browser menu (tap the 3 dots or Share button on iOS).\n2. Tap "Add to Home Screen".');
      return;
    }
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      console.log('User accepted PWA installation');
    }
    setDeferredPrompt(null);
    setIsInstallable(false);
  }, [deferredPrompt]);

  // Reset all application data
  const resetAllData = useCallback(() => {
    clearAllRecords();
    setRecords({});
    setCustomTimetable(getStoredTimetable());
  }, []);

  // Import JSON backup
  const importBackup = useCallback((jsonStr) => {
    const { records: importedRecords, customTimetable: importedTimetable } = importDataFromJSON(jsonStr);
    setRecords(importedRecords);
    if (importedTimetable) {
      setCustomTimetable(importedTimetable);
    }
  }, []);

  // Go to Today
  const goToToday = useCallback(() => {
    setSelectedDate(getTodayISO());
  }, []);

  // Jump by relative days
  const changeDateByDays = useCallback((offset) => {
    setSelectedDate((curr) => addDays(curr, offset));
  }, []);

  const value = {
    activeTab,
    setActiveTab,
    selectedDate,
    setSelectedDate,
    theme,
    toggleTheme,
    notificationsEnabled,
    toggleNotifications,
    records,
    customTimetable,
    currentDayTasks,
    currentDayCompletedIds,
    currentDayProgress,
    streakStats,
    toggleTask,
    resetCurrentDay,
    updateCustomTimetable,
    updateTimetableTask,
    addTimetableTask,
    deleteTimetableTask,
    reorderTimetableTasks,
    restoreDefaults,
    addCustomTask,
    updateCustomTask,
    deleteCustomTask,
    resetAllData,
    importBackup,
    goToToday,
    changeDateByDays,
    isInstallable,
    installPwa,
  };

  return <HabitixContext.Provider value={value}>{children}</HabitixContext.Provider>;
}
