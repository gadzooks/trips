// app/trips/new/page.tsx
'use client';
import { useRouter } from 'next/navigation';
import { TripForm } from '@/app/components/trips/TripForm';
import type { TripRecordDTO } from '@/types/trip';

export default function NewTrip() {
 const router = useRouter();

 const handleSubmit = async (tripData: TripRecordDTO) => {
   if (!tripData.name.trim()) {
     throw new Error('Trip name is required');
   }

   if (!tripData.description.trim()) {
     throw new Error('Trip description is required');
   }

   try {
     console.log('new trip tripData:', JSON.stringify(tripData));
     const response = await fetch('/api/trips', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify(tripData),
     });

     if (!response.ok) throw new Error('Failed to create trip');
     const { tripId } = await response.json();
     router.push(`/trips/${tripId}`);
   } catch (error) {
     throw new Error('Failed to create trip');
   }
 };

 return (
   <TripForm
     initialData={
       {
         name: '', description: '', tags: '',
         days: [
           {
             date: '1',
             itinerary: 'Day 1',
             reservations: '',
             lodging: '',
             travelTime: '',
             notes: ''
           }
         ],
         tripAccessResult: {
           allowed: true,
           reason: 'new trip',
           hasCreateAccess: true,
           hasReadAccess: true,
           hasWriteAccess: true,
           hasDeleteAccess: true
         }
       }}

     onSubmit={handleSubmit}
     isNewRecord={true}
   />
 );
}