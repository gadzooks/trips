'use client'

import { useState } from 'react'
import { TrashIcon, PlusIcon } from 'lucide-react'

interface TripRow {
  id: string
  date: string
  activity: string
  notes: string
  location: string
  driveTime: string
}

export function TripTable({ 
  initialRows = [], 
  onChange 
}: { 
  initialRows?: TripRow[]
  onChange?: (rows: TripRow[]) => void 
}) {
  const [rows, setRows] = useState<TripRow[]>(initialRows)

  const addRow = () => {
    const newRow: TripRow = {
      id: crypto.randomUUID(),
      date: '',
      activity: '',
      notes: '',
      location: '',
      driveTime: ''
    }
    const newRows = [...rows, newRow]
    setRows(newRows)
    onChange?.(newRows)
  }

  const updateRow = (id: string, field: keyof TripRow, value: string) => {
    const newRows = rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    )
    setRows(newRows)
    onChange?.(newRows)
  }

  const deleteRow = (id: string) => {
    const newRows = rows.filter(row => row.id !== id)
    setRows(newRows)
    onChange?.(newRows)
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Drive Time</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map(row => (
            <tr key={row.id}>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={row.date}
                  onChange={e => updateRow(row.id, 'date', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={row.activity}
                  onChange={e => updateRow(row.id, 'activity', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={row.notes}
                  onChange={e => updateRow(row.id, 'notes', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={row.location}
                  onChange={e => updateRow(row.id, 'location', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </td>
              <td className="px-6 py-4">
                <input
                  type="text"
                  value={row.driveTime}
                  onChange={e => updateRow(row.id, 'driveTime', e.target.value)}
                  className="border rounded px-2 py-1 w-full"
                />
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => deleteRow(row.id)}
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
        onClick={addRow}
        className="mt-4 flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        <PlusIcon className="h-5 w-5" />
        Add Row
      </button>
    </div>
  )
}