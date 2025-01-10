// app/trips/new/page.tsx
'use client';

import { useRouter } from 'next/navigation';
import { useTripForm } from '@/hooks/useTripForm';
import { TripForm } from '@/app/components/trips/TripForm';

export default function NewTrip() {
  const router = useRouter();
  const { formData, updateField } = useTripForm();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          tags: formData.tags.split(' '),
        }),
      });
      
      if (!response.ok) throw new Error('Failed to create trip');
      const { tripId } = await response.json();
      router.push(`/trips/${tripId}`);
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  return (
    <TripForm
      formData={formData}
      onFieldChange={updateField}
      onSubmit={handleSubmit}
      submitLabel="Create Trip"
    />
  );
}