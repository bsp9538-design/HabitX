import React from 'react';
import { CheckSquare, CalendarDays, Flame, Settings } from 'lucide-react';
import { useHabitix } from '../context/useHabitix';

const NAV_ITEMS = [
  { id: 'today', label: 'Today', icon: CheckSquare },
  { id: 'week', label: 'Week', icon: CalendarDays },
  { id: 'progress', label: 'Progress', icon: Flame },
  { id: 'settings', label: 'Settings', icon: Settings },
];

export default function Navigation() {
  const { activeTab, setActiveTab } = useHabitix();

  return (
    <>
      {/* Desktop Top Navigation Bar */}
      <nav className="desktop-nav" aria-label="Desktop Navigation">
        <div className="desktop-nav-inner">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`nav-tab-btn ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
                aria-current={isActive ? 'page' : undefined}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="mobile-nav" aria-label="Mobile Navigation">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-nav-btn ${isActive ? 'active' : ''}`}
              onClick={() => setActiveTab(item.id)}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
    </>
  );
}
