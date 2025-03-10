import React, { useState, useRef, useEffect, FC } from 'react';
import { CalendarDays } from 'lucide-react';

interface Day {
  id: number;
  date: string;
  title: string;
}

import { TripDayDTO } from '/Users/gadzooks/src/trips/types/trip';

interface DatePickerInputProps {
  value: string;
  index: number;
  updateDay: (index: number, field: keyof TripDayDTO, value: string) => void;
  isReadOnly?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

interface SimpleDatePickerProps {
  onSelect: (date: Date) => void;
  selectedDate: Date | null;
}

const DatePickerInput: FC<DatePickerInputProps> = ({ value, index, updateDay, isReadOnly = false, onChange }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(value || '');
  const [currentDate, setCurrentDate] = useState<Date | null>(parseDate(value) || new Date());
  const calendarRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  function parseDate(dateString: string): Date | null {
    if (!dateString) return null;
    
    const parts = dateString.split('/');
    if (parts.length !== 3) return null;
    
    const month = parseInt(parts[0], 10) - 1;
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    const date = new Date(year, month, day);
    return isNaN(date.getTime()) ? null : date;
  }
  
  function formatDate(date: Date | null): string {
    if (!date) return '';
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
  }
  
  // Close calendar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (calendarRef.current && !calendarRef.current.contains(event.target as Node) && 
          inputRef.current && !inputRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (isReadOnly) return;
    const newValue = e.target.value;
    setInputValue(newValue);
    updateDay(index, 'date', newValue);
    if (onChange) onChange(e);
  };
  
  const handleDateSelect = (date: Date): void => {
    if (isReadOnly) return;
    const formattedDate = formatDate(date);
    setInputValue(formattedDate);
    setCurrentDate(date);
    updateDay(index, 'date', formattedDate);
    setIsOpen(false);
  };
  
  const toggleCalendar = (): void => {
    if (isReadOnly) return;
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="relative">
      <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
        DATE
      </label>
      <div className="relative">
        <div 
          onClick={toggleCalendar}
          className={`absolute left-3 top-1/2 transform -translate-y-1/2 ${isReadOnly ? 'opacity-70' : 'cursor-pointer'}`}
        >
          <CalendarDays className="w-4 h-4 text-purple-500 dark:text-purple-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          placeholder="MM/DD/YYYY"
          disabled={isReadOnly}
          className={`pl-9 pr-3 py-2 w-full text-sm rounded-lg border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 bg-white dark:bg-gray-800 transition-colors focus:outline-none ${isReadOnly ? 'opacity-70 cursor-not-allowed' : ''}`}
        />
      </div>
      
      {isOpen && (
        <div 
          ref={calendarRef}
          className="absolute z-10 mt-1 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-2 border border-gray-200 dark:border-gray-700"
        >
          <SimpleDatePicker onSelect={handleDateSelect} selectedDate={currentDate} />
        </div>
      )}
    </div>
  );
};

// A simple date picker component
const SimpleDatePicker: FC<SimpleDatePickerProps> = ({ onSelect, selectedDate }) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(selectedDate || new Date());
  
  const getDaysInMonth = (date: Date): (Date | null)[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    
    const days: (Date | null)[] = [];
    // Add blank spaces for days before the first of the month
    for (let i = 0; i < firstDayOfMonth; i++) {
      days.push(null);
    }
    
    // Add days of the month
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