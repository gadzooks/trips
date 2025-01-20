// app/api/trips/shared/page.tsx
'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Calendar, Clock, MapPin, Share2, User } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { redirect } from 'next/navigation'
import React from 'react'
import { Trip } from '@/types/trip'

export default function TripsPage() {
  const { data: session, status } = useSession()
  const [trips, setTrips] = useState<Trip[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      redirect('/api/auth/signin')
    }
  }, [status])

  useEffect(() => {
    async function fetchTrips() {
      if (!session?.user?.id) return

      try {
        const response = await fetch('/api/trips/shared')
        if (!response.ok) throw new Error('Failed to fetch shared trips')
        const data = await response.json()
        setTrips(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load shared trips')
      } finally {
        setLoading(false)
      }
    }

    fetchTrips()
  }, [session?.user?.id])

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow p-6 animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
          {error}
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Shared with Me</h1>
      </div>

      {trips.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-6 text-center">
          <Share2 className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h2 className="text-xl font-semibold mb-2">No Shared Trips Yet</h2>
          <p className="text-gray-500">
            Trips shared with you by other users will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {trips.map((trip) => (
            <Link
              key={trip.tripId}
              href={`/trips/${trip.tripId}`}
              className="block bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200"
            >
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{trip.name}</h3>
                  <span className={`px-2 py-1 rounded text-xs ${
                    trip.permission === 'EDIT' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    {trip.permission.toLowerCase()}
                  </span>
                </div>

                {trip.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
                )}
                
                <div className="space-y-2 text-sm text-gray-500">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>Created by {trip.ownerName}</span>
                  </div>

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
      )}
    </div>
  )
}