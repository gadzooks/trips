"use client";
import { useTrips } from '@/hooks/useTrips';
import { TripCard } from './TripCard';
import { TripListType } from '@/types/trip';
import { Session } from 'next-auth';
import { useMediaQuery } from '@/hooks/useMediaQuery';

interface SidebarProps {
  tripsPerSection?: number;
  session: Session | null;
}

export function Sidebar({ tripsPerSection = 2, session }: SidebarProps) {
  const isDesktop = useMediaQuery('(min-width: 768px)');
  
  const { trips: publicTrips, loading: publicLoading } = useTrips({ 
    type: TripListType.PUBLIC, 
    limit: tripsPerSection,
    skipPagination: true 
  });
  
  const { trips: myTrips, loading: myTripsLoading } = useTrips({ 
    type: TripListType.MY_TRIPS, 
    limit: tripsPerSection,
    skipPagination: true 
  });

  if (!isDesktop) return null;

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-4rem)] overflow-y-auto bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
      <div className="p-4 pt-8">
        {session?.user && (
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">My Recent Trips</h2>
            <div className="space-y-4">
              {myTripsLoading ? (
                <div className="animate-pulse space-y-4">
                  {[...Array(tripsPerSection)].map((_, i) => (
                    <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
                  ))}
                </div>
              ) : myTrips?.length > 0 ? (
                myTrips.map((trip) => (
                  <TripCard
                    key={trip.tripId}
                    tripId={trip.tripId}
                    title={trip.name}
                    date={new Date(trip.createdAt).toLocaleDateString()}
                  />
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400 text-center">No trips yet</p>
              )}
            </div>
          </div>
        )}
        
        <div>
          <h2 className="text-lg font-semibold mb-4">Latest Public Trips</h2>
          <div className="space-y-4">
            {publicLoading ? (
              <div className="animate-pulse space-y-4">
                {[...Array(tripsPerSection)].map((_, i) => (
                  <div key={i} className="h-20 bg-gray-200 dark:bg-gray-700 rounded" />
                ))}
              </div>
            ) : publicTrips?.length > 0 ? (
                publicTrips.map((trip) => (
                  <TripCard
                    key={trip.tripId}
                    tripId={trip.tripId}
                    title={trip.name}
                    date={new Date(trip.createdAt).toLocaleDateString()}
                  />
                ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 text-center">No public trips available</p>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
}