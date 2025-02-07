// app/components/site-wide/sidebar/TripSection.tsx
"use client";
import { useTrips } from '@/hooks/useTrips';
import { TripCard } from '../TripCard';
import { TripListType } from '@/types/trip';

interface TripSectionProps {
  title: string;
  type: TripListType;
  tripsPerSection: number;
  emptyMessage: string;
}

export function TripSection({ title, type, tripsPerSection, emptyMessage }: TripSectionProps) {
  const { trips, loading } = useTrips({ 
    type, 
    limit: tripsPerSection,
    skipPagination: true 
  });

  return (
    <div className="mb-3">
      <div className='text-center'>
        <h2 className="text-lg font-semibold mb-2 ">{title}</h2>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="animate-pulse space-y-4">
            {[...Array(tripsPerSection)].map((_, i) => (
              <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
            ))}
          </div>
        ) : trips?.length > 0 ? (
          trips.map((trip) => (
            <TripCard
              key={trip.tripId}
              tripId={trip.tripId}
              title={trip.name}
              date={new Date(trip.createdAt).toLocaleDateString()}
            />
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center">{emptyMessage}</p>
        )}
      </div>
    </div>
  );
}