// app/components/trips/MobileTripDays.tsx
import React from 'react';
import { Clock, CalendarDays, Map, Hotel, BookOpen, MessageSquare } from 'lucide-react';
import { TripDayDTO } from '@/types/trip';

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

  const InputWithIcon = ({ 
    icon: Icon, 
    label, 
    value, 
    onChange, 
    placeholder, 
    multiline 
  }: { 
    icon: React.ElementType; 
    label: string;
    value: string; 
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
    placeholder: string;
    multiline?: boolean;
  }) => {
    const InputComponent = multiline ? 'textarea' : 'input';
    return (
      <div className="relative">
        <div className="absolute left-2 top-2 flex items-center gap-1 text-gray-400 dark:text-gray-500">
          <Icon className="w-4 h-4" />
          <span className="text-xs font-medium">{label}</span>
        </div>
        <InputComponent
          value={value}
          onChange={onChange}
          readOnly={isReadOnly}
          placeholder={placeholder}
          rows={multiline ? 2 : undefined}
          className={`w-full bg-gray-50 dark:bg-gray-700/50 rounded text-sm text-gray-900 dark:text-gray-100 focus:outline-none ${
            multiline ? 'resize-none p-2 pt-8' : 'px-2 py-1 pl-20'
          }`}
        />
      </div>
    );
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
            <InputWithIcon
              icon={Map}
              label="ACTIVITIES"
              value={day.itinerary}
              onChange={(e) => updateDay(index, 'itinerary', e.target.value)}
              placeholder="What's planned..."
              multiline
            />

            <div className="flex gap-2">
              <div className="flex-1">
                <InputWithIcon
                  icon={Hotel}
                  label="STAY"
                  value={day.lodging}
                  onChange={(e) => updateDay(index, 'lodging', e.target.value)}
                  placeholder="Accommodation"
                />
              </div>
              <div className="flex-1">
                <InputWithIcon
                  icon={BookOpen}
                  label="BOOKINGS"
                  value={day.reservations}
                  onChange={(e) => updateDay(index, 'reservations', e.target.value)}
                  placeholder="Reservation details"
                  multiline
            />
              </div>
            </div>

            <InputWithIcon
                  icon={MessageSquare}
                  label="NOTES"
                  value={day.notes}
                  onChange={(e) => updateDay(index, 'notes', e.target.value)}
                  placeholder="Add notes"
                />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MobileTripDays;