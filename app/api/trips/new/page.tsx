'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { TripItinerary } from '@/app/components/trip-itinerary'
import { TripRecordDTO, Day } from '@/types/trip'

export default function NewTrip() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [isPublic, setIsPublic] = useState(false)
  const [days, setDays] = useState<Day[]>([])
  const [error, setError] = useState('')
  const sharedWith = ['tom', 'jerry']

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    
    const tripData: TripRecordDTO = {
      name: name,
      description,
      isPublic,
      sharedWith,
      days: days.map(day => ({
        id: day.id,
        date: day.date,
        activity: day.activity,
        bookings: day.bookings,
        stay: day.stay,
        travelTime: day.travelTime,
        notes: day.notes
      }))
    }

    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tripData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Failed to create trip')
      }

      const { tripId } = await response.json()
      router.push(`/trips/${tripId}`)
    } catch (error) {
      console.error('Failed to create trip:', error)
      setError(error instanceof Error ? error.message : 'Failed to create trip')
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Trip</h1>
      
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Trip Name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isPublic"
            checked={isPublic}
            onChange={(e) => setIsPublic(e.target.checked)}
            className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          />
          <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-900">
            Make this trip public
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Itinerary
          </label>
          <TripItinerary onChange={setDays} />
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Create Trip
          </button>
        </div>
      </form>
    </div>
  )
}