import React, { useState, useRef, useEffect } from 'react';
import { Clock, CalendarDays, Map, Hotel, BookOpen, MessageSquare, Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Save, RotateCcw } from 'lucide-react';
import { TripDayDTO } from '@/types/trip';
import MobileInputComponentWithIcon from './MobileInputComponentWithIcon';
import DatePickerInput from '../../ui/input/DatePickerInput';

interface MobileTripDaysProps {
  days: TripDayDTO[];
  isReadOnly?: boolean;
  onChange?: (days: TripDayDTO[]) => void;
  isNewRecord?: boolean;
}

const MobileTripDays: React.FC<MobileTripDaysProps> = ({ 
  days: initialDays, 
  isReadOnly = false, 
  onChange,
  isNewRecord = false
}) => {
  const [days, setDays] = useState<TripDayDTO[]>(initialDays);
  const [originalDays, setOriginalDays] = useState<TripDayDTO[]>(initialDays);
  const [hasChanges, setHasChanges] = useState(false);
  const [expandedDay, setExpandedDay] = useState<number | null>(isNewRecord && initialDays.length > 0 ? 0 : null);
  const [animating, setAnimating] = useState<number | null>(null);
  
  // Update internal state when props change
  useEffect(() => {
    if (initialDays.length > 0) {
      setDays(initialDays);
      setOriginalDays(initialDays);
    }
  }, [initialDays]);

  // Update a single field in a day
  const updateDay = (index: number, field: keyof TripDayDTO, value: string) => {
    if (isReadOnly) return;
    
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
    setHasChanges(true);
  };

  // Add a new day
  const addDay = () => {
    if (isReadOnly) return;
    
    const newDay: TripDayDTO = {
      date: '',
      itinerary: '',
      reservations: '',
      lodging: '',
      travelTime: '',
      notes: ''
    };
    
    const newDays = [...days, newDay];
    setDays(newDays);
    setExpandedDay(newDays.length - 1); // Auto-expand the new day
    setAnimating(newDays.length - 1);
    setTimeout(() => setAnimating(null), 500);
    setHasChanges(true);
  };

  // Remove a day
  const removeDay = (index: number) => {
    if (isReadOnly) return;
    
    setAnimating(index);
    setTimeout(() => {
      setDays(days.filter((_, i) => i !== index));
      setHasChanges(true);
      
      // Reset expanded day if we're removing the expanded one
      if (expandedDay === index) {
        setExpandedDay(null);
      } else if (expandedDay !== null && expandedDay > index) {
        // Adjust expanded day index if we're removing a day before it
        setExpandedDay(expandedDay - 1);
      }
      setAnimating(null);
    }, 300);
  };

  // Move a day up in the list
  const moveUp = (index: number) => {
    if (index === 0 || isReadOnly) return;
    
    const newDays = [...days];
    const temp = newDays[index];
    newDays[index] = newDays[index - 1];
    newDays[index - 1] = temp;
    
    setDays(newDays);
    
    // Update expanded day if needed
    if (expandedDay === index) {
      setExpandedDay(index - 1);
    } else if (expandedDay === index - 1) {
      setExpandedDay(index);
    }
    
    setHasChanges(true);
  };

  // Move a day down in the list
  const moveDown = (index: number) => {
    if (index === days.length - 1 || isReadOnly) return;
    
    const newDays = [...days];
    const temp = newDays[index];
    newDays[index] = newDays[index + 1];
    newDays[index + 1] = temp;
    
    setDays(newDays);
    
    // Update expanded day if needed
    if (expandedDay === index) {
      setExpandedDay(index + 1);
    } else if (expandedDay === index + 1) {
      setExpandedDay(index);
    }
    
    setHasChanges(true);
  };

  // Toggle expanded state of a day
  const toggleExpand = (index: number) => {
    setExpandedDay(expandedDay === index ? null : index);
  };

  // Save changes
  const handleSave = () => {
    if (onChange) {
      onChange(days);
      setOriginalDays(days);
      setHasChanges(false);
    }
  };

  // Reset changes
  const handleReset = () => {
    setDays(originalDays);
    setHasChanges(false);
  };

  // Format date string if it appears to be a date
  const formatDate = (dateString: string) => {
    if (!dateString) return '';
    
    // If it already contains formatting like "Day 1" or custom text, return as is
    if (!/^\d{4}-\d{2}-\d{2}/.test(dateString)) {
      return dateString;
    }
    
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toLocaleDateString('en-US', {
          weekday: 'short', 
          month: 'short', 
          day: 'numeric'
        });
      }
    } catch (e) {}
    
    return dateString;
  };

  // Get day number (for visual display)
  const getDayNumber = (index: number) => {
    return `Day ${index + 1}`;
  };

  // Get summary text based on day info
  const getSummary = (day: TripDayDTO) => {
    if (day.itinerary) return day.itinerary;
    if (day.lodging) return `Staying at: ${day.lodging}`;
    if (day.reservations) return `Reservations: ${day.reservations}`;
    return "No details added yet";
  };

  // Add the animation styles component
  const AnimationStyles = () => (
    <style jsx global>{`
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }

      @keyframes slideUp {
        from { transform: translateY(100%); }
        to { transform: translateY(0); }
      }
    `}</style>
  );

  return (
    <div className="space-y-4 px-1 py-2">
      <AnimationStyles />
      {/* Trip Days */}
      {days.map((day, index) => (
        <div
          key={index}
          className={`bg-white dark:bg-gray-800 rounded-xl shadow-md p-4 space-y-3 border border-gray-200 dark:border-gray-700 transition-all duration-300 ${
            animating === index ? "opacity-0 scale-95" : "opacity-100 scale-100"
          } ${
            expandedDay === index
              ? "border-purple-300 dark:border-purple-500"
              : ""
          }`}
        >
          {/* Day Header */}
          <div
            className={`flex items-center justify-between cursor-pointer transition-colors ${
              expandedDay === index
                ? "bg-purple-50 dark:bg-purple-900/20 -mx-4 px-4 py-2 rounded-t-xl"
                : ""
            }`}
            onClick={() => toggleExpand(index)}
          >
            <div className="flex items-center space-x-3">
              {/* Day indicator pill */}
              <div className="bg-purple-100 dark:bg-purple-800 text-purple-800 dark:text-purple-200 px-3 py-1 rounded-full text-xs font-medium">
                {getDayNumber(index)}
              </div>

              {/* Date display */}
              <div className="flex items-center">
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100 mr-1">
                  {formatDate(day.date) || "Set date"}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {/* Travel time pill - only show if it has a value */}
              {day.travelTime && (
                <div className="bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full text-xs flex items-center space-x-1">
                  <Clock className="w-3 h-3" />
                  <span>{day.travelTime}</span>
                </div>
              )}

              {/* Expand/collapse button */}
              <button
                type="button"
                className={`p-1 rounded-full ${
                  expandedDay === index
                    ? "bg-purple-100 dark:bg-purple-800/60 text-purple-600 dark:text-purple-300"
                    : "text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                }`}
                onClick={(e) => {
                  e.stopPropagation();
                  toggleExpand(index);
                }}
              >
                {expandedDay === index ? (
                  <ChevronUp className="w-5 h-5" />
                ) : (
                  <ChevronDown className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          {/* Preview of day info when collapsed */}
          {expandedDay !== index && (
            <div className="text-sm text-gray-600 dark:text-gray-300 pl-1 mt-2 line-clamp-2">
              {getSummary(day)}
            </div>
          )}

          {/* Expanded content */}
          {expandedDay === index && (
            <div style={{ animation: "fadeIn 0.3s ease-out" }}>
              {/* Date and Travel Time Row - Edit Mode */}
              {!isReadOnly && (
                <div className="grid grid-cols-2 gap-3 mb-4 mt-2">
                  <div className="relative">
                    <DatePickerInput
                      value={day.date}
                      onChange={(e) => updateDay(index, "date", e.target.value)}
                      index={index}
                      updateDay={updateDay}
                    />
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                      TRAVEL TIME
                    </label>
                    <div className="relative">
                      <Clock className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={day.travelTime}
                        onChange={(e) =>
                          updateDay(index, "travelTime", e.target.value)
                        }
                        placeholder="Add time"
                        className="pl-9 pr-3 py-2 w-full text-sm rounded-lg border border-gray-200 dark:border-gray-700 focus:border-purple-400 dark:focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-800 bg-white dark:bg-gray-800 transition-colors focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Main input fields */}
              <div className="space-y-4">
                <div className="bg-purple-50/50 dark:bg-purple-900/10 -mx-4 px-4 py-3 border-y border-purple-100 dark:border-purple-800/30">
                  <MobileInputComponentWithIcon
                    icon={Map}
                    label="ITINERARY"
                    value={day.itinerary}
                    onChange={(e) =>
                      updateDay(index, "itinerary", e.target.value)
                    }
                    placeholder="What's planned for this day..."
                    multiline
                    rows={3}
                  />
                </div>

                <MobileInputComponentWithIcon
                  icon={Hotel}
                  label="LODGING"
                  value={day.lodging}
                  onChange={(e) => updateDay(index, "lodging", e.target.value)}
                  placeholder="Where you'll be staying..."
                  multiline
                />

                <MobileInputComponentWithIcon
                  icon={BookOpen}
                  label="RESERVATIONS"
                  value={day.reservations}
                  onChange={(e) =>
                    updateDay(index, "reservations", e.target.value)
                  }
                  placeholder="Any bookings or tickets..."
                  multiline
                />

                <MobileInputComponentWithIcon
                  icon={MessageSquare}
                  label="NOTES"
                  value={day.notes}
                  onChange={(e) => updateDay(index, "notes", e.target.value)}
                  placeholder="Additional notes..."
                  multiline
                />
              </div>

              {/* Day controls - only in edit mode */}
              {!isReadOnly && (
                <div className="flex justify-between items-center pt-3 mt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex space-x-1">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className={`p-2 rounded-lg ${
                        index === 0
                          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                      }`}
                      aria-label="Move day up"
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === days.length - 1}
                      className={`p-2 rounded-lg ${
                        index === days.length - 1
                          ? "text-gray-300 dark:text-gray-600 cursor-not-allowed"
                          : "text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:bg-gray-700"
                      }`}
                      aria-label="Move day down"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeDay(index)}
                    className="p-2 text-red-500 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    aria-label="Delete day"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      ))}

      {/* Empty state */}
      {days.length === 0 && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-6 text-center border border-dashed border-gray-300 dark:border-gray-700">
          <div className="text-gray-500 dark:text-gray-400 mb-4">
            No days have been added to this trip yet
          </div>
          {!isReadOnly && (
            <button
              type="button"
              onClick={addDay}
              className="inline-flex justify-center items-center px-4 py-2 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add First Day
            </button>
          )}
        </div>
      )}

      {/* Add day button */}
      {!isReadOnly && days.length > 0 && (
        <div className="sticky bottom-4 mt-6 px-2">
          <button
            type="button"
            onClick={addDay}
            className="w-full flex justify-center items-center px-4 py-3 text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 dark:bg-purple-700 dark:hover:bg-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Day
          </button>
        </div>
      )}

      {/* Save/Reset buttons */}
      {!isReadOnly && hasChanges && !isNewRecord && (
        <div
          className="fixed bottom-0 left-0 right-0 p-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 flex justify-between z-10"
          style={{ animation: "slideUp 0.3s ease-out" }}
        >
          <button
            type="button"
            onClick={handleReset}
            className="flex-1 mr-2 flex justify-center items-center px-4 py-3 text-sm font-medium text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="flex-1 ml-2 flex justify-center items-center px-4 py-3 text-sm font-medium text-white bg-green-600 hover:bg-green-700 dark:bg-green-700 dark:hover:bg-green-600 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </button>
        </div>
      )}

      {/* Extra spacing when save bar is present */}
      {!isReadOnly && hasChanges && !isNewRecord && (
        <div className="h-20"></div>
      )}
    </div>
  );
};

export default MobileTripDays;

// Animation styles are now included in the component via the AnimationStyles component
const AnimationStyles = () => (
  <style jsx global>{`
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
    }

    @keyframes slideUp {
      from { transform: translateY(100%); }
      to { transform: translateY(0); }
    }
  `}</style>
);