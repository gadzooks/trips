'use client'

import { useState } from 'react'
import { TrashIcon, PlusIcon } from 'lucide-react'
import { Day } from '@/types/trip'

export function TripItinerary({ 
  initialRows = [], 
  isReadOnly = true,
  onChange 
}: { 
  initialRows?: Day[]
  isReadOnly: boolean
  onChange?: (days: Day[]) => void 
}) {
  
  if (!initialRows || initialRows.length === 0) {
    initialRows = [
      {
        id: crypto.randomUUID(),
        date: '',
        activity: '',
        bookings: '',
        stay: '',
        travelTime: '',
        notes: ''
      }

    ]
  }
  // console.log('initialRows', initialRows)
  const [days, setDays] = useState<Day[]>(initialRows)

  const addDay = () => {
    const newDay: Day = {
      id: crypto.randomUUID(),
      date: '',
      activity: '',
      bookings: '',
      stay: '',
      travelTime: '',
      notes: ''
    }
    const newDays = [...days, newDay]
    setDays(newDays)
    onChange?.(newDays)
  }

  const updateDay = (id: string, field: keyof Day, value: string) => {
    const newDays = days.map(day => 
      day.id === id ? { ...day, [field]: value } : day
    )
    setDays(newDays)
    onChange?.(newDays)
  }

  const deleteDay = (id: string) => {
    const newDays = days.filter(day => day.id !== id)
    setDays(newDays)
    onChange?.(newDays)
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bookings</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stay</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Travel Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {days.map(day => (
            <tr key={day.id}>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={day.date}
                  onChange={e => updateDay(day.id, 'date', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={day.activity}
                  onChange={e => updateDay(day.id, 'activity', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={day.bookings}
                  onChange={e => updateDay(day.id, 'bookings', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={day.stay}
                  onChange={e => updateDay(day.id, 'stay', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={day.travelTime}
                  onChange={e => updateDay(day.id, 'travelTime', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={day.notes}
                  onChange={e => updateDay(day.id, 'notes', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </td>
              <td className="px-6 py-4">
                <button
                  type="button"
                  onClick={() => deleteDay(day.id)}
                  // readOnly={isReadOnly}
                  disabled={isReadOnly}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button
        type="button"
        onClick={addDay}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        <PlusIcon className="h-5 w-5" />
        Add Day
      </button>
    </div>
  )
}