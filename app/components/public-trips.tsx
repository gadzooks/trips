"use client"

import React, { useState, useEffect } from 'react';
import { Calendar, Clock, MapPin } from 'lucide-react';
import { Trip } from '@/types/trip';

export default function PublicTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = true; // Mock session for demo

  useEffect(() => {
    async function fetchPublicTrips() {
      try {
        const response = await fetch('/api/trips/public');
        if (!response.ok) throw new Error('Failed to fetch trips');
        const data = await response.json();
        setTrips(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trips');
      } finally {
        setLoading(false);
      }
    }
    fetchPublicTrips();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-lg p-6 animate-pulse">
            <div className="h-4 bg-purple-100 rounded-full w-3/4 mb-4"></div>
            <div className="h-4 bg-blue-100 rounded-full w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-2 border-red-200 rounded-xl p-6 text-red-700 shadow-lg">
        <div className="flex items-center gap-2">
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
          </svg>
          <span className="font-medium">{error}</span>
        </div>
      </div>
    );
  }

  if (trips.length === 0) {
    return (
      <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl shadow-lg p-8 text-center">
        <p className="text-gray-600 mb-4">No public trips available yet.</p>
        {session && (
          <button
            onClick={() => window.location.href = '/trips/new'}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:scale-105"
          >
            Create the first public trip!
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
          Public Trips
        </h2>
        <p className="mt-2 text-gray-600">Discover amazing journey plans shared by our community</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <div
            key={trip.tripId}
            onClick={() => window.location.href = `/trips/${trip.tripId}`}
            className="group cursor-pointer"
          >
            <div className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
              <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-2 text-gray-800 group-hover:text-purple-600 transition-colors duration-200">
                  {trip.name}
                </h3>
                {trip.description && (
                  <p className="text-gray-600 mb-4 line-clamp-2">{trip.description}</p>
                )}
                
                <div className="space-y-3 text-sm">
                  {trip.rows?.[0] && (
                    <div className="flex items-center gap-2 text-purple-600">
                      <Calendar className="h-4 w-4" />
                      <span>Starts: {trip.rows[0].date}</span>
                    </div>
                  )}
                  
                  {trip.rows?.[0]?.location && (
                    <div className="flex items-center gap-2 text-blue-600">
                      <MapPin className="h-4 w-4" />
                      <span>{trip.rows[0].location}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-2 text-gray-500">
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}