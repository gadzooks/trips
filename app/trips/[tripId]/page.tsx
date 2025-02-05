// app/trips/[tripId]/page.tsx
"use client";
import { use, useEffect, useState } from 'react';
import { TripForm } from '@/app/components/trips/TripForm';
import { TripRecordDTO } from '@/types/trip';

export default function TripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const [trip, setTrip] = useState<TripRecordDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTripDetails() {
      try {
        const response = await fetch(`/api/trips/${tripId}`);
        if (!response.ok) throw new Error('Failed to fetch trip details');
        const data = await response.json();
        console.log('data -------------->>>>>>>', JSON.stringify(data, null, 2));
        setTrip(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trip details');
      } finally {
        setLoading(false);
      }
    }
    fetchTripDetails();
  }, [tripId]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!trip) return <div>Trip not found</div>;

  return (
    <TripForm 
      initialData={trip}
      isNewRecord={false}
      onSubmit={async (updatedTrip) => {
        // Handle any additional submit logic if needed
      }}
    />
  );
}