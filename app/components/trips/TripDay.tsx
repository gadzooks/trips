import React, { useState } from 'react';
import { TrashIcon, PlusIcon, Calendar as CalendarIcon, Clock, Hotel, Ticket, MapPin, StickyNote } from 'lucide-react';
import "react-day-picker/style.css";
import { Button } from '@/components/ui/button';
import { Day } from '@/types/trip';

export function TripDay({
  initialRows = [],
  isReadOnly = true,
  onChange
}) {
  let rows: Day[] = initialRows;
  if (!rows?.length) {
    rows = [{
      id: crypto.randomUUID(),
      date: '',
      activity: '',
      bookings: '',
      stay: '',
      travelTime: '',
      notes: ''
    }];
  }

  const [days, setDays] = useState<Day[]>(rows);

  const addDay = () => {
    const newDay = {
      id: crypto.randomUUID(),
      date: '',
      activity: '',
      bookings: '',
      stay: '',
      travelTime: '',
      notes: ''
    };
    const newDays = [...days, newDay];
    setDays(newDays);
    onChange?.(newDays);
  };

  const updateDay = (id: string, field: string, value: string) => {
    const newDays = days.map(day =>
      day.id === id ? { ...day, [field]: value } : day
    );
    setDays(newDays);
    onChange?.(newDays);
  };

  const deleteDay = (id: string) => {
    const newDays = days.filter(day => day.id !== id);
    setDays(newDays);
    onChange?.(newDays);
  };

  return (
    <div className="space-y-6 p-4">
      {days.map((day, index) => (
        <div key={day.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 space-y-4">
          <div className="flex items-center justify-between mb-6">
            <span className="text-2xl font-bold text-gray-400 dark:text-gray-500">Day {index + 1}</span>

            <div className="flex-1">
              <div className="flex items-center pl-4">
                <Clock className="h-4 w-4 mr-2 text-gray-600 dark:text-gray-400" />
                <input
                  type="text"
                  value={day.travelTime}
                  onChange={e => updateDay(day.id, 'travelTime', e.target.value)}
                  className="w-full p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                  placeholder="Travel duration"
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
                {!isReadOnly && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-red-50 dark:hover:bg-red-900/20"
                    onClick={() => deleteDay(day.id)}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </Button>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center text-gray-600 dark:text-gray-300">
              <Hotel className="h-4 w-4 mr-2" />
              <span className="font-medium">Accommodation</span>
            </div>

            <input
              value={day.stay}
              onChange={e => updateDay(day.id, 'stay', e.target.value)}
              className="w-full p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
              placeholder="Where are you staying?"
              readOnly={isReadOnly}
              disabled={isReadOnly}
            />
          </div>

          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <MapPin className="h-4 w-4 mr-2" />
                <span className="font-medium">Activities</span>
              </div>
              <textarea
                value={day.activity}
                onChange={e => updateDay(day.id, 'activity', e.target.value)}
                className="w-full min-h-32 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                placeholder="Plan your activities..."
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <Ticket className="h-4 w-4 mr-2" />
                <span className="font-medium">Bookings</span>
              </div>
              <textarea
                value={day.bookings}
                onChange={e => updateDay(day.id, 'bookings', e.target.value)}
                className="w-full min-h-32 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                placeholder="Add booking details..."
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center text-gray-600 dark:text-gray-300">
                <StickyNote className="h-4 w-4 mr-2" />
                <span className="font-medium">Notes</span>
              </div>
              <textarea
                value={day.notes}
                onChange={e => updateDay(day.id, 'notes', e.target.value)}
                className="w-full min-h-32 p-3 rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent"
                placeholder="Additional notes..."
                readOnly={isReadOnly}
                disabled={isReadOnly}
              />
            </div>
          </div>
        </div>
      ))}

      {!isReadOnly && (
        <Button
          onClick={addDay}
          className="w-full bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white py-4 rounded-lg shadow-md transition-colors"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Another Day
        </Button>
      )}
    </div>
  );
}

export default TripDay;