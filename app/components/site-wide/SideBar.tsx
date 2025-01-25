// app/components/site-wide/SideBar.tsx
"use client";
import { useTrips } from '@/hooks/useTrips';
import { TripCard } from './TripCard';
import { TripListType } from '@/types/trip';
import { Session } from 'next-auth';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Sheet, SheetContent, SheetTrigger } from "../ui/shadcn/sheet";
import { Menu } from 'lucide-react';
import { Button } from '../ui/shadcn/button';

interface SidebarProps {
  tripsPerSection?: number;
  session: Session | null;
}

export function Sidebar({ tripsPerSection = 2, session }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  
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

  useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const SidebarContent = () => (
    <div className="p-4">
      {session?.user && (
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4 text-center">My Recent Trips</h2>
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
                  tripId={trip.tripId}
                  title={trip.name}
                  date={new Date(trip.createdAt).toLocaleDateString()}
                  onClick={() => setIsOpen(false)}
                />
              ))
            )}
          </div>
        </div>
      )}
      
      <div>
        <h2 className="text-lg font-semibold mb-4 text-center">Latest Public Trips</h2>
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
                tripId={trip.tripId}
                title={trip.name}
                date={new Date(trip.createdAt).toLocaleDateString()}
                onClick={() => setIsOpen(false)}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sheet */}
      <div className="md:hidden fixed left-4 top-4 z-50">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-0">
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Sidebar */}
      <aside className="hidden md:block fixed left-0 top-16 w-64 h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <SidebarContent />
      </aside>
    </>
  );
}