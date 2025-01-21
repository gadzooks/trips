import React, { useState, useEffect } from 'react';
import { Clock, Trash2, Plus } from 'lucide-react';
import type { TripDayProps } from './trip-types';
import { TripDayDTO } from '@/types/trip';

const TripDayComponent: React.FC<TripDayProps> = ({ 
  onChange, 
  initialRows = [], 
  isReadOnly = false 
}) => {
  const [days, setDays] = useState<TripDayDTO[]>(() => {
    return initialRows.map(row => ({
      date: row.date || '',
      itinerary: row.itinerary || '',
      reservations: row.reservations || '',
      lodging: row.lodging || '',
      travelTime: row.travelTime || '',
      notes: row.notes || ''
    }));
  });

  useEffect(() => {
    if (initialRows.length > 0) {
      setDays(initialRows);
    }
  }, [initialRows]);

  const updateDay = (index: number, field: keyof TripDayDTO, value: string) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
    onChange(newDays);
  };

  const addDay = () => {
    const newDay: TripDayDTO = {
      date: '',
      itinerary: '',
      reservations: '',
      lodging: '',
      travelTime: '',
      notes: ''
    };
    setDays([...days, newDay]);
    onChange([...days, newDay]);
  };

  const removeDay = (index: number) => {
    const newDays = days.filter((_, i) => i !== index);
    setDays(newDays);
    onChange(newDays);
  };

  return (
    <div className="overflow-x-auto rounded-lg">
      <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow-sm">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Date</th>
            <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Itinerary</th>
            <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Reservations</th>
            <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Lodging</th>
            <th className="p-3 text-left text-sm font-medium text-gray-900 dark:text-gray-100">Travel times</th>
            {!isReadOnly && <th className="w-16"></th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
          {days.map((day, index) => (
            <tr 
              key={index}
              className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <td className="p-3">
                <input
                  type="text"
                  value={day.date}
                  onChange={(e) => updateDay(index, 'date', e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:placeholder:text-transparent"
                  placeholder="Date"
                  readOnly={isReadOnly}
                />
              </td>
              <td className="p-3">
                <textarea
                  value={day.itinerary}
                  onChange={(e) => updateDay(index, 'itinerary', e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none resize-none text-left focus:text-left placeholder:text-left focus:placeholder:text-transparent"
                  rows={3}
                  placeholder="Add itinerary details..."
                  readOnly={isReadOnly}
                />
              </td>
              <td className="p-3">
                <textarea
                  value={day.reservations}
                  onChange={(e) => updateDay(index, 'reservations', e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none resize-none text-left focus:text-left placeholder:text-left focus:placeholder:text-transparent"
                  rows={3}
                  placeholder="Add reservation details..."
                  readOnly={isReadOnly}
                />
              </td>
              <td className="p-3">
                <textarea
                  value={day.lodging}
                  onChange={(e) => updateDay(index, 'lodging', e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none resize-none text-left focus:text-left placeholder:text-left focus:placeholder:text-transparent"
                  rows={3}
                  placeholder="Add lodging details..."
                  readOnly={isReadOnly}
                />
              </td>
              <td className="p-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                  <input
                    type="text"
                    value={day.travelTime}
                    onChange={(e) => updateDay(index, 'travelTime', e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:placeholder:text-transparent"
                    placeholder="Travel time"
                    readOnly={isReadOnly}
                  />
                </div>
              </td>
              {!isReadOnly && (
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => removeDay(index)}
                    className="opacity-0 group-hover:opacity-100 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-opacity"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
      
      {!isReadOnly && (
        <div className="mt-4 flex justify-center">
          <button
            type="button"
            onClick={addDay}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 focus:outline-none"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Day
          </button>
        </div>
      )}
    </div>
  );
};

export default TripDayComponent;