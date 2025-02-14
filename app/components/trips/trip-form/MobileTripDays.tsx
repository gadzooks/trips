// app/components/trips/trip-form/MobileTripDays.tsx
import React, { useEffect, useRef } from 'react';
import { Clock, CalendarDays, Map, Hotel, BookOpen, MessageSquare } from 'lucide-react';
import { TripDayDTO } from '@/types/trip';
import Linkify from 'react-linkify';
import MobileInputComponentWithIcon from './MobileInputComponentWithIcon';

interface MobileTripDaysProps {
  days: TripDayDTO[];
  isReadOnly?: boolean;
  onChange?: (days: TripDayDTO[]) => void;
}

const MobileTripDays: React.FC<MobileTripDaysProps> = ({ days, isReadOnly, onChange }) => {
  const updateDay = (index: number, field: keyof TripDayDTO, value: string) => {
    if (isReadOnly || !onChange) return;
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    onChange(newDays);
  };

  return (
    <div className="space-y-4">
      {days.map((day, index) => (
        <div 
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 space-y-3"
        >
          {/* Header Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-1">
              <CalendarDays className="w-4 h-4 text-purple-500 dark:text-purple-400" />
              <input
                type="text"
                value={day.date}
                onChange={(e) => updateDay(index, 'date', e.target.value)}
                readOnly={isReadOnly}
                placeholder="Date"
                className="text-sm font-medium text-purple-900 dark:text-purple-100 bg-transparent focus:outline-none w-24"
              />
            </div>
            <div className="flex items-center gap-1">
              <Clock className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={day.travelTime}
                onChange={(e) => updateDay(index, 'travelTime', e.target.value)}
                readOnly={isReadOnly}
                placeholder="Travel time"
                className="text-sm text-gray-600 dark:text-gray-300 bg-transparent focus:outline-none w-20 mr-2"
              />
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-2">
            <MobileInputComponentWithIcon
              icon={Map}
              label="ITINERARY"
              value={day.itinerary}
              onChange={(e) => updateDay(index, 'itinerary', e.target.value)}
              placeholder="What's planned..."
              multiline
            />

            <MobileInputComponentWithIcon
              icon={Hotel}
              label="LODGING"
              value={day.lodging}
              onChange={(e) => updateDay(index, 'lodging', e.target.value)}
              placeholder="Lodging details"
              multiline
            />
            <MobileInputComponentWithIcon
              icon={BookOpen}
              label="RESERVATIONS"
              value={day.reservations}
              onChange={(e) => updateDay(index, 'reservations', e.target.value)}
              placeholder="Reservation details"
              multiline
            />

            <MobileInputComponentWithIcon
              icon={MessageSquare}
              label="NOTES"
              value={day.notes}
              onChange={(e) => updateDay(index, 'notes', e.target.value)}
              placeholder="Add notes"
              multiline
            />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileTripDays;