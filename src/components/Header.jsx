import React from 'react';
import { Sun, Moon, Download, Calendar } from 'lucide-react';
import { useHabitix } from '../context/useHabitix';
import { formatDisplayDate, getTodayISO } from '../utils/dateUtils';

export default function Header() {
  const { theme, toggleTheme, isInstallable, installPwa } = useHabitix();
  const todayFormatted = formatDisplayDate(getTodayISO());

  return (
    <header className="habitix-header" role="banner">
      <div className="header-inner">
        <div className="brand-section">
          <div className="brand-icon" aria-hidden="true">
            H
          </div>
          <div className="brand-text">
            <h1 className="brand-title">Habitix</h1>
            <p className="brand-tagline">Build habits. Build yourself.</p>
          </div>
        </div>

        <div className="header-controls">
          <div className="header-date-badge font-mono" title="Today's Date">
            <Calendar size={16} />
            <span>{todayFormatted}</span>
          </div>

          {isInstallable && (
            <button
              type="button"
              className="btn-yellow"
              onClick={installPwa}
              title="Install Habitix as PWA on your device"
              aria-label="Install App"
            >
              <Download size={16} />
              <span style={{ fontSize: '0.8rem', textTransform: 'uppercase' }}>Install App</span>
            </button>
          )}

          <button
            type="button"
            className="btn-icon btn-secondary"
            onClick={toggleTheme}
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
            aria-label={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} theme`}
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </div>
    </header>
  );
}
