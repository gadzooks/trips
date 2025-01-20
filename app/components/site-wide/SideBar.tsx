// app/components/site-wide/SideBar.tsx
"use client";
import { useTrips } from '@/hooks/useTrips';
import { TripCard } from './TripCard';

interface SidebarProps {
  tripsPerSection?: number;
}

export function Sidebar({ tripsPerSection = 2 }: SidebarProps) {
  const { 
    trips: publicTrips, 
    loading: publicLoading 
  } = useTrips({ 
    type: 'public', 
    limit: tripsPerSection,
    skipPagination: true 
  });

  const { 
    trips: myTrips, 
    loading: myTripsLoading 
  } = useTrips({ 
    type: 'myTrips', 
    limit: tripsPerSection,
    skipPagination: true 
  });

  return (
    <aside className="fixed left-0 top-16 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4">
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">Latest Public Trips</h2>
          <div className="space-y-4">
            {publicLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(tripsPerSection)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
                ))}
              </div>
            ) : (
              publicTrips.map((trip) => (
                <TripCard
                  key={trip.tripId}
                  title={trip.name}
                  date={new Date(trip.createdAt).toLocaleDateString()}
                />
              ))
            )}
          </div>
        </div>
        
        <div>
          <h2 className="text-lg font-semibold mb-4">My Recent Trips</h2>
          <div className="space-y-4">
            {myTripsLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(tripsPerSection)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
                ))}
              </div>
            ) : (
              myTrips.map((trip) => (
                <TripCard
                  key={trip.tripId}
                  title={trip.name}
                  date={new Date(trip.createdAt).toLocaleDateString()}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}