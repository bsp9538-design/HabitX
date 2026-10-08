import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';
import { useHabitix } from '../context/useHabitix';
import {
  getDayName,
  formatDisplayDate,
  getWeekDaysForDate,
  getTodayISO,
} from '../utils/dateUtils';

export default function DaySelector() {
  const { selectedDate, setSelectedDate, goToToday, changeDateByDays } = useHabitix();
  const dateInputRef = useRef(null);

  const selectedDayName = getDayName(selectedDate);
  const selectedFormatted = formatDisplayDate(selectedDate);
  const weekDays = getWeekDaysForDate(selectedDate, selectedDate);
  const isTodaySelected = selectedDate === getTodayISO();

  const handleNativeDateChange = (e) => {
    if (e.target.value) {
      setSelectedDate(e.target.value);
    }
  };

  const triggerDatePicker = () => {
    if (dateInputRef.current) {
      if (typeof dateInputRef.current.showPicker === 'function') {
        dateInputRef.current.showPicker();
      } else {
        dateInputRef.current.focus();
      }
    }
  };

  return (
    <div className="card day-selector-card" aria-label="Date and Day Selection">
      {/* Calendar Controls Bar */}
      <div className="calendar-controls-row">
        <div className="calendar-date-info">
          <div>
            <h2 className="current-day-label">{selectedDayName}</h2>
            <div className="current-date-full font-mono">{selectedFormatted}</div>
          </div>
        </div>

        <div className="calendar-action-group">
          {!isTodaySelected && (
            <button
              type="button"
              className="btn-secondary btn-today-shortcut"
              onClick={goToToday}
              title="Jump to today's date"
            >
              <RotateCcw size={14} />
              <span>Today</span>
            </button>
          )}

          <button
            type="button"
            className="btn-icon btn-secondary btn-date-nav"
            onClick={() => changeDateByDays(-1)}
            aria-label="Previous Day"
            title="Previous Day"
          >
            <ChevronLeft size={18} />
          </button>

          <div className="date-input-hidden-wrapper">
            <button
              type="button"
              className="btn-icon btn-secondary btn-date-nav"
              onClick={triggerDatePicker}
              aria-label="Pick date from calendar"
              title="Pick a specific date"
            >
              <CalendarIcon size={16} />
            </button>
            <input
              ref={dateInputRef}
              type="date"
              className="date-native-input"
              value={selectedDate}
              onChange={handleNativeDateChange}
              aria-label="Select Date"
            />
          </div>

          <button
            type="button"
            className="btn-icon btn-secondary btn-date-nav"
            onClick={() => changeDateByDays(1)}
            aria-label="Next Day"
            title="Next Day"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Weekday Selector Strip: MON | TUE | WED | THU | FRI | SAT | SUN */}
      <div className="week-days-strip" role="tablist" aria-label="Days of the week">
        {weekDays.map((day) => (
          <button
            key={day.dateStr}
            type="button"
            role="tab"
            aria-selected={day.isSelected}
            className={`day-pill-btn ${day.isSelected ? 'active' : ''}`}
            onClick={() => setSelectedDate(day.dateStr)}
            title={`${day.dayName}, ${day.dateStr}`}
          >
            <span className="day-pill-name">{day.shortName}</span>
            <span className="day-pill-num font-mono">{day.dayNumber}</span>
            {day.isToday && <span className="day-pill-dot" title="Today's Date" />}
          </button>
        ))}
      </div>
    </div>
  );
}
