'use client';

import { useRouter } from 'next/navigation';
import { TripForm } from '@/app/components/trips/TripForm';
import { useTripForm } from '@/hooks/useTripForm';
import { useEffect, useState } from 'react';
import { use } from 'react';

export default function EditTrip({ params }: { params: Promise<{ tripId: string }> }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const { formData, updateField, setFormData } = useTripForm();
  const [isReadOnly, setIsReadOnly] = useState(false);
  
  // Unwrap the params Promise using React.use()
  const resolvedParams = use(params);

  useEffect(() => {
    const fetchTrip = async () => {
      try {
        const response = await fetch(`/api/trips/${resolvedParams.tripId}`);
        if (!response.ok) throw new Error('Failed to fetch trip');
        const trip = await response.json();
        // console.log('trip -------------->>>>>>>', JSON.stringify(trip, null, 2));
        
        setFormData({
          ...trip,
          tags: Array.isArray(trip.tags) ? trip.tags.join(' ') : trip.tags,
        });
        
        setIsReadOnly(trip.isPublic);
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch trip:', error);
        setIsLoading(false);
      }
    };
    fetchTrip();
  }, [resolvedParams.tripId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/trips/${resolvedParams.tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(' '),
        }),
      });
      
      if (!response.ok) throw new Error('Failed to update trip');
      router.push(`/trips/${resolvedParams.tripId}`);
    } catch (error) {
      console.error('Failed to update trip:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <TripForm
      formData={formData}
      onFieldChange={updateField}
      onSubmit={handleSubmit}
      isReadOnly={isReadOnly}
      submitLabel="Update Trip"
    />
  );
}