// app/components/trips/trip-form/TripDayComponent.tsx
import React, { useState, useEffect } from 'react';
import { Clock, Trash2, Plus, Save, RotateCcw, GripVertical, MoveVertical } from 'lucide-react';
import type { TripDayProps } from '../trip-types';
import { TripDayDTO } from '@/types/trip';
import MobileTripDays from './MobileTripDays';
import { EditableText } from '../../ui/input/EditableText';

const TripDayComponent: React.FC<TripDayProps> = ({
  onChange,
  initialRows = [],
  isReadOnly,
  isNewRecord
}) => {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);



  const [days, setDays] = useState<TripDayDTO[]>(() =>
    initialRows.map(row => ({
      date: row.date || '',
      itinerary: row.itinerary || '',
      reservations: row.reservations || '',
      lodging: row.lodging || '',
      travelTime: row.travelTime || '',
      notes: row.notes || ''
    }))
  );
  const [originalDays, setOriginalDays] = useState<TripDayDTO[]>(days);
  const [hasChanges, setHasChanges] = useState(false);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    if (initialRows.length > 0) {
      setDays(initialRows);
      setOriginalDays(initialRows);
    }
  }, [initialRows]);

  if (isMobile) {
    return (
      <MobileTripDays
        days={days}
        isReadOnly={isReadOnly}
        onChange={onChange}
        isNewRecord={isNewRecord}
      />
    );
  }

  const updateDay = (index: number, field: keyof TripDayDTO, value: string) => {
    const newDays = [...days];
    newDays[index] = { ...newDays[index], [field]: value };
    setDays(newDays);
    setHasChanges(true);
  };

  const addDay = (e: React.MouseEvent) => {
    e.preventDefault();
    const newDay: TripDayDTO = {
      date: '',
      itinerary: '',
      reservations: '',
      lodging: '',
      travelTime: '',
      notes: ''
    };
    setDays([...days, newDay]);
    setHasChanges(true);
  };

  const removeDay = (index: number) => {
    setDays(days.filter((_, i) => i !== index));
    setHasChanges(true);
  };

  const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    setDragIndex(index);
    e.currentTarget.style.opacity = '0.4';
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
    e.preventDefault();
    if (dragIndex === null) return;

    const newDays = [...days];
    const dragDay = newDays[dragIndex];
    newDays.splice(dragIndex, 1);
    newDays.splice(index, 0, dragDay);

    setDays(newDays);
    setDragIndex(index);
  };

  const handleDragEnd = (e: React.DragEvent<HTMLTableRowElement>) => {
    e.currentTarget.style.opacity = '';
    setDragIndex(null);
    setHasChanges(true);
  };

  const handleSave = () => {
    onChange(days);
    setHasChanges(false);
    setOriginalDays(days);
  };

  const handleReset = () => {
    setDays(originalDays);
    setHasChanges(false);
  };

  // if (isMobile) {
  //   return <MobileTripDays days={days} isReadOnly={isReadOnly} />;
  // }

  return (
    <div className="space-y-4">

      <div className="overflow-x-auto rounded-lg">
        <table className="w-full border-collapse bg-white dark:bg-gray-800 shadow-sm divide-x divide-gray-200 dark:divide-gray-600">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr className="divide-x divide-gray-200 dark:divide-gray-600">
              {!isReadOnly && <th className="w-8 p-2"><MoveVertical className='w-4 h-4' /> </th>}
              <th className="p-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100 w-20">DATE</th>
              <th className="p-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">ITINERARY</th>
              <th className="p-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">RESERVATIONS</th>
              <th className="p-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">LODGING</th>
              <th className="p-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100 w-20">TRAVEL<br />TIME</th>
              <th className="p-2 text-center text-sm font-medium text-gray-900 dark:text-gray-100">NOTES</th>
              {!isReadOnly && <th className="w-8 p-4"><Trash2 className='w-4 h-4 text-red-300' /></th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
            {days.map((day, index) => (
              <tr
                key={index}
                draggable={!isReadOnly}
                onDragStart={(e) => handleDragStart(e, index)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragEnd={handleDragEnd}
                className="group hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors divide-x divide-gray-200 dark:divide-gray-600"
              >
                {!isReadOnly && (
                  <td className="w-8 cursor-move">
                    <GripVertical className="w-4 h-4 mx-auto opacity-0 group-hover:opacity-100" />
                  </td>
                )}
                <td className="p-1 align-middle">
                  <EditableText
                    id="date"
                    attributeKey='date'
                    attributeValue={day.date}
                    onSave={(e) => updateDay(index, 'date', e)}
                    onChange={(e) => setHasChanges(true)}
                    className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded px-2 py-1"
                    placeholder="Date"
                    isReadyOnly={isReadOnly}
                    isTextArea={false}
                  />
                </td>
                <td className="p-1">
                  <EditableText
                    id='itinerary'
                    attributeKey='itinerary'
                    attributeValue={day.itinerary}
                    onSave={(e) => updateDay(index, 'itinerary', e)}
                    onChange={(e) => setHasChanges(true)}
                    className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded px-2 py-1 resize-none"
                    // rows={2}
                    placeholder="Add itinerary..."
                    isReadyOnly={isReadOnly}
                    isTextArea={true}
                  />
                </td>
                <td className="p-1">
                  <EditableText
                    id='reservations'
                    attributeKey='reservations'
                    attributeValue={day.reservations}
                    onSave={(e) => updateDay(index, 'reservations', e)}
                    onChange={(e) => setHasChanges(true)}
                    className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded px-2 py-1 resize-none"
                    // rows={2}
                    placeholder="Add booking details..."
                    isReadyOnly={isReadOnly}
                    isTextArea={true}
                  />
                </td>
                <td className="p-1">
                  <EditableText
                    id='lodging'
                    attributeKey='lodging'
                    attributeValue={day.lodging}
                    onSave={(e) => updateDay(index, 'lodging', e)}
                    onChange={(e) => setHasChanges(true)}
                    className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded px-2 py-1"
                    placeholder="Lodging location"
                    isReadyOnly={isReadOnly}
                    isTextArea={true}
                  />
                </td>
                <td className="p-1">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                    <EditableText
                      id='travelTime'
                      attributeKey='travelTime'
                      attributeValue={day.travelTime}
                      onSave={(e) => updateDay(index, 'travelTime', e)}
                      onChange={(e) => setHasChanges(true)}
                      className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded px-1 py-1"
                      placeholder="Time"
                      isReadyOnly={isReadOnly}
                      isTextArea={false}
                    />
                  </div>
                </td>
                <td className="p-1">
                  <EditableText
                    id='notes'
                    attributeKey='notes'
                    attributeValue={day.notes}
                    onSave={(e) => updateDay(index, 'notes', e)}
                    onChange={(e) => setHasChanges(true)}
                    className="w-full bg-transparent text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-1 focus:ring-purple-500 rounded px-2 py-1"
                    placeholder="Additional notes, including links etc"
                    isReadyOnly={isReadOnly}
                    isTextArea={true}
                  />
                </td>
                {!isReadOnly && (
                  <td className="p-4 w-8">
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
      </div>

      {!isReadOnly && (
        <div className="flex justify-between items-center mt-4">
          <button
            type="button"
            onClick={addDay}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Day
          </button>

          <div className="space-x-2">
            {hasChanges && !isNewRecord && (
              <>
                <button
                  type="button"
                  onClick={handleReset}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </button>
                <button
                  type="button"
                  onClick={handleSave}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300"
                >
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripDayComponent;    