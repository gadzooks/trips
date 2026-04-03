// app/components/ui/input/DatePickerInput.tsx

import React, { useState, useRef, useEffect, FC } from 'react';
import { CalendarDays } from 'lucide-react';

interface DatePickerInputProps {
  value: string;
  index: number;
  updateDay: (index: number, field: 'date', value: string) => void;
  isReadOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SimpleDatePickerProps {
  onSelect: (date: Date) => void;
  selectedDate: Date | null;
}

// Parse MM/DD/YYYY or YYYY-MM-DD storage formats
function parseDate(dateString: string): Date | null {
  if (!dateString) return null;

  // MM/DD/YYYY
  const slashParts = dateString.split('/');
  if (slashParts.length === 3) {
    const month = parseInt(slashParts[0], 10) - 1;
    const day = parseInt(slashParts[1], 10);
    const year = parseInt(slashParts[2], 10);
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }

  // YYYY-MM-DD (ISO)
  const dashParts = dateString.split('-');
  if (dashParts.length === 3) {
    const year = parseInt(dashParts[0], 10);
    const month = parseInt(dashParts[1], 10) - 1;
    const day = parseInt(dashParts[2], 10);
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }

  return null;
}

// Store as MM/DD/YYYY
function formatStorageDate(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

// Display as two lines: { line1: "Sat", line2: "Apr 4" }
function formatDisplayDate(date: Date): { line1: string; line2: string } {
  const full = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const spaceIdx = full.indexOf(' ');
  return spaceIdx === -1
    ? { line1: full, line2: '' }
    : { line1: full.slice(0, spaceIdx), line2: full.slice(spaceIdx + 1) };
}

const DatePickerInput: FC<DatePickerInputProps> = ({
  value,
  index,
  updateDay,
  isReadOnly = false,
  onChange
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  // rawInput is only used when the user is typing (no parsed date yet)
  const [rawInput, setRawInput] = useState<string>(() => {
    const parsed = parseDate(value);
    return parsed ? '' : (value || '');
  });
  const [selectedDate, setSelectedDate] = useState<Date | null>(parseDate(value));
  const [calendarMonth, setCalendarMonth] = useState<Date>(parseDate(value) || new Date());
  const [popupPosition, setPopupPosition] = useState<{ top: number; left: number }>({ top: 0, left: 0 });
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync display when value prop changes externally (e.g. auto-fill)
  useEffect(() => {
    const parsed = parseDate(value);
    setSelectedDate(parsed);
    if (parsed) {
      setCalendarMonth(parsed);
      setRawInput('');
    } else {
      setRawInput(value || '');
    }
  }, [value]);

  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node) &&
          containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (isReadOnly) return;
    const newValue = e.target.value;
    setRawInput(newValue);
    // If it parses as MM/DD/YYYY, store and update calendar
    const parsed = parseDate(newValue);
    if (parsed) {
      setSelectedDate(parsed);
      setCalendarMonth(parsed);
      updateDay(index, 'date', formatStorageDate(parsed));
    } else {
      setSelectedDate(null);
      updateDay(index, 'date', newValue);
    }
    if (onChange) onChange(e);
  };

  const handleDateSelect = (date: Date): void => {
    if (isReadOnly) return;
    setSelectedDate(date);
    setCalendarMonth(date);
    setRawInput('');
    updateDay(index, 'date', formatStorageDate(date));
    setIsOpen(false);
  };

  const calculatePopupPosition = (event: React.MouseEvent<HTMLElement>): void => {
    if (isReadOnly) return;

    const mouseX = event.clientX;
    const mouseY = event.clientY;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const calendarWidth = 280;
    const calendarHeight = 320;

    let top, left;

    if (mouseX + calendarWidth + 10 > viewportWidth) {
      left = mouseX - calendarWidth - 10;
    } else {
      left = mouseX + 10;
    }

    if (mouseY + calendarHeight + 10 > viewportHeight) {
      top = mouseY - calendarHeight - 10;
    } else {
      top = mouseY + 10;
    }

    left = Math.max(10, left);
    top = Math.max(10, top);

    setPopupPosition({ top, left });
    setIsOpen(!isOpen);
  };

  const dateDisplay = selectedDate ? formatDisplayDate(selectedDate) : null;

  return (
    <div className="relative" ref={containerRef}>
      {dateDisplay ? (
        // Date is set: show compact 2-line display, no icon
        <div
          onClick={isReadOnly ? undefined : calculatePopupPosition}
          className={`px-2 py-1 w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-center leading-tight ${
            isReadOnly ? 'opacity-70' : 'cursor-pointer hover:border-purple-400 dark:hover:border-purple-500'
          }`}
        >
          <div className="text-base font-medium text-gray-900 dark:text-gray-100">{dateDisplay.line1}</div>
          {dateDisplay.line2 && (
            <div className="text-base text-gray-700 dark:text-gray-300">{dateDisplay.line2}</div>
          )}
        </div>
      ) : (
        // No date: show icon + text input
        <>
          <div
            onClick={calculatePopupPosition}
            className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${
              isReadOnly ? 'opacity-70' : 'cursor-pointer'
            }`}
          >
            <CalendarDays className="w-4 h-4 text-purple-500 dark:text-purple-400" />
          </div>
          <input
            ref={inputRef}
            type="text"
            value={rawInput}
            onChange={handleInputChange}
            placeholder="Mon Jan 1"
            disabled={isReadOnly}
            className={`pl-9 pr-3 py-2 w-full text-base rounded-lg border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 bg-white dark:bg-gray-800 transition-colors focus:outline-none ${
              isReadOnly ? 'opacity-70 cursor-not-allowed' : ''
            }`}
          />
        </>
      )}

      {isOpen && (
        <div
          ref={calendarRef}
          className="absolute z-50 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-700"
          style={{
            position: 'fixed',
            top: `${popupPosition.top}px`,
            left: `${popupPosition.left}px`,
          }}
        >
          <SimpleDatePicker
            onSelect={handleDateSelect}
            selectedDate={selectedDate}
            initialMonth={calendarMonth}
          />
        </div>
      )}
    </div>
  );
};

// A simple date picker component
const SimpleDatePicker: FC<SimpleDatePickerProps & { initialMonth: Date }> = ({ onSelect, selectedDate, initialMonth }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(initialMonth);

  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();

    const days: (Date | null)[] = [];
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(new Date(year, month, i));
    }

    return days;
  };

  const navigateMonth = (amount: number): void => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(newMonth.getMonth() + amount);
    setCurrentMonth(newMonth);
  };

  const isSelectedDate = (day: Date | null): boolean => {
    if (!day || !selectedDate) return false;
    return day.getDate() === selectedDate.getDate() &&
           day.getMonth() === selectedDate.getMonth() &&
           day.getFullYear() === selectedDate.getFullYear();
  };

  const days = getDaysInMonth(currentMonth);

  return (
    <div className="w-64">
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={() => navigateMonth(-1)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          &lt;
        </button>
        <div className="font-medium">
          {currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </div>
        <button
          onClick={() => navigateMonth(1)}
          className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          &gt;
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center">
        {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
          <div key={day} className="text-xs font-medium text-gray-500 dark:text-gray-400">
            {day}
          </div>
        ))}

        {days.map((day, i) => (
          <div
            key={i}
            className={`
              h-8 w-8 flex items-center justify-center rounded-full text-sm
              ${!day ? 'invisible' : 'cursor-pointer'}
              ${isSelectedDate(day)
                ? 'bg-purple-500 text-white'
                : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
            `}
            onClick={() => day && onSelect(day)}
          >
            {day ? day.getDate() : ''}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DatePickerInput;
