import React, { useState, useRef } from 'react';
import {
  Sun,
  Moon,
  Bell,
  BellOff,
  Download,
  Upload,
  Trash2,
  Smartphone,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { useHabitix } from '../context/useHabitix';
import ResetConfirmModal from './ResetConfirmModal';
import EditTasksView from './EditTasksView';
import { exportDataAsJSON } from '../utils/storage';

export default function SettingsView() {
  const {
    theme,
    toggleTheme,
    notificationsEnabled,
    toggleNotifications,
    resetAllData,
    importBackup,
    installPwa,
  } = useHabitix();

  const [isEditingTasks, setIsEditingTasks] = useState(false);
  const [isResetAllModalOpen, setIsResetAllModalOpen] = useState(false);
  const [importStatus, setImportStatus] = useState('');
  const fileInputRef = useRef(null);

  const handleExportData = () => {
    const jsonStr = exportDataAsJSON();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `habitix-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        importBackup(text);
        setImportStatus('Backup restored successfully!');
        setTimeout(() => setImportStatus(''), 4000);
      } catch (error) {
        console.warn('Import failed:', error);
        setImportStatus('Error importing data. Please check JSON format.');
        setTimeout(() => setImportStatus(''), 4000);
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  // If user clicked "Edit Tasks", show the dedicated in-settings editor
  if (isEditingTasks) {
    return <EditTasksView onBack={() => setIsEditingTasks(false)} />;
  }

  return (
    <div className="settings-view-wrapper">
      {/* 1. Custom Timetable & Schedule Section */}
      <div className="card settings-section-card card-teal-edge">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div className="settings-info-col" style={{ maxWidth: '580px' }}>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Calendar size={18} color="var(--teal)" />
              <span>Edit Tasks & Timetable</span>
            </h3>
            <span className="settings-item-desc">
              Customize your recurring daily routine for Monday through Sunday. Change task names, start & end times, categories, or reorder tasks.
            </span>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={() => setIsEditingTasks(true)}
            style={{ padding: '10px 20px', fontSize: '0.92rem' }}
          >
            <span>Edit Tasks</span>
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {/* 2. Visual & Interface Preferences */}
      <div className="card settings-section-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '14px' }}>
          Appearance & Notifications
        </h3>

        {/* Theme Toggle */}
        <div className="settings-row">
          <div className="settings-info-col">
            <span className="settings-item-title">App Theme</span>
            <span className="settings-item-desc">
              Currently using <strong>{theme === 'light' ? 'Light Habitix (Teal + Coral)' : 'Dark Slate'}</strong> theme
            </span>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={toggleTheme}
            style={{ minWidth: '130px' }}
          >
            {theme === 'light' ? (
              <>
                <Moon size={16} />
                <span>Dark Mode</span>
              </>
            ) : (
              <>
                <Sun size={16} />
                <span>Light Mode</span>
              </>
            )}
          </button>
        </div>

        {/* Notifications Toggle */}
        <div className="settings-row">
          <div className="settings-info-col">
            <span className="settings-item-title">Browser Notifications</span>
            <span className="settings-item-desc">
              Get timely routine alerts and streak motivational reminders
            </span>
          </div>

          <button
            type="button"
            className={notificationsEnabled ? 'btn-primary' : 'btn-secondary'}
            onClick={toggleNotifications}
            style={{ minWidth: '130px' }}
          >
            {notificationsEnabled ? (
              <>
                <Bell size={16} />
                <span>Enabled</span>
              </>
            ) : (
              <>
                <BellOff size={16} />
                <span>Disabled</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* 3. PWA & Mobile Installation */}
      <div className="card settings-section-card card-teal-edge">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '14px' }}>
          Progressive Web App (PWA)
        </h3>

        <div className="settings-row">
          <div className="settings-info-col">
            <span className="settings-item-title">Add to Home Screen</span>
            <span className="settings-item-desc">
              Works 100% offline on mobile, tablet, or desktop without keeping your computer on
            </span>
          </div>

          <button
            type="button"
            className="btn-primary"
            onClick={installPwa}
          >
            <Smartphone size={16} />
            <span>Install Habitix</span>
          </button>
        </div>

        <div style={{ marginTop: '12px', fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.5, borderTop: '1px solid var(--border-neutral)', paddingTop: '10px' }}>
          <strong>📱 How to install on mobile:</strong>
          <ul style={{ paddingLeft: '20px', marginTop: '6px' }}>
            <li><strong>iPhone (Safari):</strong> Tap the <em>Share</em> button at the bottom, then scroll down and tap <em>"Add to Home Screen"</em>.</li>
            <li><strong>Android (Chrome / Edge):</strong> Tap the <em>three dots (⋮)</em> at the top right, then tap <em>"Install App"</em> or <em>"Add to Home screen"</em>.</li>
          </ul>
        </div>
      </div>

      {/* 4. Data Management & Backups */}
      <div className="card settings-section-card">
        <h3 style={{ fontSize: '1.1rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '14px' }}>
          Data & Privacy
        </h3>

        {importStatus && (
          <div
            style={{
              backgroundColor: importStatus.includes('Error') ? 'var(--coral-light)' : 'var(--teal-light)',
              color: 'var(--primary-dark)',
              padding: '10px 14px',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--border-dark)',
              marginBottom: '14px',
              fontWeight: 700,
              fontSize: '0.85rem',
            }}
          >
            {importStatus}
          </div>
        )}

        {/* Export Backup */}
        <div className="settings-row">
          <div className="settings-info-col">
            <span className="settings-item-title">Export Routine Data</span>
            <span className="settings-item-desc">
              Download your full habit checklist history and custom timetable as a JSON backup
            </span>
          </div>

          <button
            type="button"
            className="btn-secondary"
            onClick={handleExportData}
          >
            <Download size={16} />
            <span>Export JSON</span>
          </button>
        </div>

        {/* Import Backup */}
        <div className="settings-row">
          <div className="settings-info-col">
            <span className="settings-item-title">Import Routine Data</span>
            <span className="settings-item-desc">
              Restore previously exported habits, custom timetable, and history
            </span>
          </div>

          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept=".json"
              style={{ display: 'none' }}
              onChange={handleFileChange}
            />
            <button
              type="button"
              className="btn-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload size={16} />
              <span>Import JSON</span>
            </button>
          </div>
        </div>

        {/* Reset All Data */}
        <div className="settings-row" style={{ borderBottom: 'none' }}>
          <div className="settings-info-col">
            <span className="settings-item-title" style={{ color: 'var(--coral)' }}>
              Reset All Application Data
            </span>
            <span className="settings-item-desc">
              Permanently delete all custom tasks, history, and streaks. Requires typing confirmation.
            </span>
          </div>

          <button
            type="button"
            className="btn-destructive"
            onClick={() => setIsResetAllModalOpen(true)}
          >
            <Trash2 size={16} />
            <span>Reset All</span>
          </button>
        </div>
      </div>

      {/* App Metadata Card */}
      <div className="card" style={{ textAlign: 'center', padding: '24px' }}>
        <h4 style={{ fontSize: '1rem', fontWeight: 900, textTransform: 'uppercase', marginBottom: '4px' }}>
          Habitix
        </h4>
        <p style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-secondary)', marginBottom: '8px' }}>
          "Build habits. Build yourself."
        </p>
        <div className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Version 1.0.0 • Local-first College Productivity Dashboard
        </div>
      </div>

      {/* Reset All Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetAllModalOpen}
        onClose={() => setIsResetAllModalOpen(false)}
        onConfirm={resetAllData}
        title="Reset All Data?"
        message="This will permanently wipe all your habit records, custom tasks, streaks, and checkmarks across all dates. This action cannot be undone."
        confirmWord="RESET"
        confirmButtonText="Erase Everything"
        isDestructive={true}
      />
    </div>
  );
}
