import React, { useState, useRef, useEffect } from 'react';
import { Clock, CalendarDays, Map, Hotel, BookOpen, MessageSquare, Plus, Trash2, GripVertical, ChevronUp, ChevronDown, Save, RotateCcw } from 'lucide-react';
import { TripDayDTO } from '@/types/trip';
import MobileInputComponentWithIcon from './MobileInputComponentWithIcon';

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
  const [expandedDay, setExpandedDay] = useState<number | null>(null);
  
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
    
    setDays([...days, newDay]);
    setExpandedDay(days.length); // Auto-expand the new day
    setHasChanges(true);
  };

  // Remove a day
  const removeDay = (index: number) => {
    if (isReadOnly) return;
    
    setDays(days.filter((_, i) => i !== index));
    setHasChanges(true);
    
    // Reset expanded day if we're removing the expanded one
    if (expandedDay === index) {
      setExpandedDay(null);
    } else if (expandedDay !== null && expandedDay > index) {
      // Adjust expanded day index if we're removing a day before it
      setExpandedDay(expandedDay - 1);
    }
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

  return (
    <div className="space-y-4">
      {days.map((day, index) => (
        <div
          key={index}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-3 space-y-3 border border-gray-200 dark:border-gray-700"
        >
          {/* Header Row with toggle */}
          <div className="flex items-center justify-between">
            <div 
              className="flex items-center gap-2 flex-1"
              onClick={() => toggleExpand(index)}
            >
              <div className="flex items-center gap-1">
                <CalendarDays className="w-4 h-4 text-purple-500 dark:text-purple-400" />
                <input
                  type="text"
                  value={day.date}
                  onChange={(e) => updateDay(index, 'date', e.target.value)}
                  readOnly={isReadOnly}
                  placeholder="Date"
                  className="text-sm font-medium text-purple-900 dark:text-purple-100 bg-transparent focus:outline-none w-24"
                  onClick={(e) => e.stopPropagation()}
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
                  className="text-sm text-gray-600 dark:text-gray-300 bg-transparent focus:outline-none w-20"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
            
            {!isReadOnly && (
              <div className="flex space-x-2">
                <button 
                  type="button" 
                  className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  onClick={() => toggleExpand(index)}
                >
                  {expandedDay === index ? 
                    <ChevronUp className="w-4 h-4" /> : 
                    <ChevronDown className="w-4 h-4" />
                  }
                </button>
              </div>
            )}
          </div>

          {/* Preview of itinerary when collapsed */}
          {expandedDay !== index && (
            <div className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2 pl-5">
              {day.itinerary || "No itinerary details"}
            </div>
          )}
          
          {/* Main Content when expanded */}
          {expandedDay === index && (
            <>
              <div className="space-y-3">
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

              {/* Reordering and delete controls */}
              {!isReadOnly && (
                <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700 mt-2">
                  <div className="flex space-x-2">
                    <button
                      type="button"
                      onClick={() => moveUp(index)}
                      disabled={index === 0}
                      className={`p-1 rounded ${index === 0 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    >
                      <ChevronUp className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => moveDown(index)}
                      disabled={index === days.length - 1}
                      className={`p-1 rounded ${index === days.length - 1 ? 'text-gray-300 dark:text-gray-600' : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'}`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeDay(index)}
                    className="p-1 text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      ))}

      {/* Add day button */}
      {!isReadOnly && (
        <div className="mt-4">
          <button
            type="button"
            onClick={addDay}
            className="w-full flex justify-center items-center px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 bg-purple-50 dark:bg-purple-900/20 hover:bg-purple-100 dark:hover:bg-purple-900/30 rounded-lg transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Day
          </button>
        </div>
      )}

      {/* Save/Reset buttons */}
      {!isReadOnly && hasChanges && !isNewRecord && (
        <div className="flex justify-end space-x-2 mt-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg transition-colors"
          >
            <Save className="w-4 h-4 mr-2" />
            Save
          </button>
        </div>
      )}
    </div>
  );
};

export default MobileTripDays;