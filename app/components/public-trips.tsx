'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, MapPin } from 'lucide-react'
// import { useSession } from 'next-auth/react'

interface TripRow {
  date: string
  activity: string
  location: string
  driveTime: string
}

interface Trip {
  tripId: string
  name: string
  description: string
  userId: string
  createdAt: string
  rows: TripRow[]
}

export function PublicTrips() {
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
//   const { data: session } = useSession()
  const session = true

  useEffect(() => {
    async function fetchPublicTrips() {
      try {
        const response = await fetch('/api/trips/public')
        if (!response.ok) throw new Error('Failed to fetch trips')
        const data = await response.json()
        setTrips(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trips')
      } finally {
        setLoading(false)
      }
    }

    fetchPublicTrips()
  }, [])

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    )
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
        {error}
      </div>
    )
  }

  if (trips.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">No public trips available yet.</p>
        {session && (
          <Link
            href="/trips/new"
            className="mt-4 inline-block text-blue-600 hover:text-blue-700"
          >
            Create the first public trip!
          </Link>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Public Trips</h2>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <Link
            key={trip.tripId}
            href={`/trips/${trip.tripId}`}
            className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
          >
            <div className="p-6">
              <h3 className="text-xl font-semibold mb-2">{trip.name}</h3>
              {trip.description && (
                <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
              )}
              
              <div className="space-y-2 text-sm text-gray-500">
                {trip.rows?.[0] && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>Starts: {trip.rows[0].date}</span>
                  </div>
                )}
                
                {trip.rows?.[0]?.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{trip.rows[0].location}</span>
                  </div>
                )}
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>
                    {new Date(trip.createdAt).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}