import React, { useState } from 'react';
import { Clock, Trash2 } from 'lucide-react';

const TripDay = ({ onChange, initialRows = [], isReadOnly }) => {
  const [days, setDays] = useState(initialRows);

  const updateDay = (index, field, value) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
    onChange(newDays);
  };

  const addDay = () => {
    setDays([...days, { 
      date: '', 
      itinerary: '', 
      reservations: '',
      lodging: '',
      driveTimes: ''
    }]);
  };

  const removeDay = (index) => {
    const newDays = days.filter((_, i) => i !== index);
    setDays(newDays);
    onChange(newDays);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse bg-white dark:bg-gray-800">
        <thead>
          <tr className="border-b border-gray-200 dark:border-gray-700">
            <th className="p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Date</th>
            <th className="p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Itinerary</th>
            <th className="p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Reservations</th>
            <th className="p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Lodging</th>
            <th className="p-3 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Drive times</th>
            {!isReadOnly && <th className="w-16"></th>}
          </tr>
        </thead>
        <tbody>
          {days.map((day, index) => (
            <tr key={index} className="border-b border-gray-200 dark:border-gray-700">
              <td className="p-3">
                <input
                  type="text"
                  value={day.date || ''}
                  onChange={(e) => updateDay(index, 'date', e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100"
                  placeholder="Date"
                  readOnly={isReadOnly}
                />
              </td>
              <td className="p-3">
                <textarea
                  value={day.itinerary || ''}
                  onChange={(e) => updateDay(index, 'itinerary', e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 resize-none"
                  rows={3}
                  placeholder="Add itinerary details..."
                  readOnly={isReadOnly}
                />
              </td>
              <td className="p-3">
                <textarea
                  value={day.reservations || ''}
                  onChange={(e) => updateDay(index, 'reservations', e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 resize-none"
                  rows={3}
                  placeholder="Add reservation details..."
                  readOnly={isReadOnly}
                />
              </td>
              <td className="p-3">
                <textarea
                  value={day.lodging || ''}
                  onChange={(e) => updateDay(index, 'lodging', e.target.value)}
                  className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 resize-none"
                  rows={3}
                  placeholder="Add lodging details..."
                  readOnly={isReadOnly}
                />
              </td>
              <td className="p-3">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-gray-500" />
                  <input
                    type="text"
                    value={day.driveTimes || ''}
                    onChange={(e) => updateDay(index, 'driveTimes', e.target.value)}
                    className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100"
                    placeholder="Drive time"
                    readOnly={isReadOnly}
                  />
                </div>
              </td>
              {!isReadOnly && (
                <td className="p-3">
                  <button
                    type="button"
                    onClick={() => removeDay(index)}
                    className="text-gray-500 hover:text-red-500"
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
            className="px-4 py-2 text-sm font-medium text-purple-600 hover:text-purple-700 focus:outline-none"
          >
            + Add Day
          </button>
        </div>
      )}
    </div>
  );
};

export default TripDay;