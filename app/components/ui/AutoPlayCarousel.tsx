// app/components/ui/AutoPlayCarousel.tsx
import React, { useState, useEffect } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/shadcn/carousel"
import Autoplay from "embla-carousel-autoplay"
import { Card, CardContent } from './shadcn/card'
import { MinimumTripRecord, TripListType } from '@/types/trip'
import { TripSummaryCard } from '../trips/TripSummaryCard'

export default function AutoplayCarousel({ type }: { type: TripListType }) {
  const plugin = React.useRef(
    Autoplay({ delay: 2000, stopOnInteraction: true })
  )
  const [trips, setTrips] = useState<MinimumTripRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    async function fetchTrips() {
      try {
        const endpoint = {
          [TripListType.PUBLIC]: '/api/trips/public',
          [TripListType.MY_TRIPS]: '/api/trips/mine',
          [TripListType.BOTH]: '/api/trips/publicAndMine'
        }[type];

        const response = await fetch(endpoint);
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
  
  return (
    <Carousel
      plugins={[plugin.current]}
      className="w-full max-w-xs"
      onMouseEnter={plugin.current.stop}
      onMouseLeave={plugin.current.reset}
    >
      <CarouselContent>
        {trips.map((trip, index) => (
          <CarouselItem key={index}>
            <div className="">
                <TripSummaryCard key={trip.tripId} {...trip} />
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  )
}