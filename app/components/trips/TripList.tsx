// app/components/trips/TripList.tsx
"use client"

import React, { useState, useEffect } from 'react';
import { MinimumTripRecord, TripListType, TripRecordDTO } from '@/types/trip';
import { TripSummaryCard } from './TripSummaryCard';

interface TripListProps {
  type: TripListType;
}

export default function TripList({ type }: TripListProps) {
  const [trips, setTrips] = useState<MinimumTripRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = true; // Mock session for demo

  useEffect(() => {
    async function fetchTrips() {
      try {
        setLoading(true);
        const response = await fetch(`/api/trips/type/${type}`);
        if (!response.ok) throw new Error('Failed to fetch trips');
        const data = await response.json();
        // console.log('data -------------->>>>>>>', JSON.stringify(data, null, 2));
        setTrips(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trips');
      } finally {
        setLoading(false);
      }
    }
    fetchTrips();
  }, [type]);

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
        <p className="text-gray-600 mb-4">No trips available.</p>
        {session && (
          <button
            onClick={() => window.location.href = '/trips/new'}
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg shadow-md hover:from-purple-700 hover:to-blue-700 transition-all duration-200 hover:scale-105"
          >
            Create a new trip!
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {trips.map((trip) => (
          <TripSummaryCard key={trip.tripId} {...trip} />
        ))}
      </div>
    </div>
  );
}

