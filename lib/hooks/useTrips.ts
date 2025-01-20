// lib/hooks/useTrips.ts
"use client";
import { useEffect, useState } from 'react';
import { MinimumTripRecord, TripListType } from '@/types/trip';
import { PaginatedResponse, PaginationParams } from '@/types/pagination';

interface UseTripProps extends PaginationParams {
  type: TripListType;
  page?: number;
  skipPagination?: boolean;
}

export function useTrips({ 
  type, 
  page = 1, 
  limit = 2,
  skipPagination = false 
}: UseTripProps) {
  const [trips, setTrips] = useState<MinimumTripRecord[]>([]);
  const [metadata, setMetadata] = useState<PaginatedResponse<MinimumTripRecord>['metadata'] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
          skipPagination: skipPagination.toString()
        });

        const response = await fetch(`/api/trips/type/${type}?${queryParams}`);

        if (!response.ok) {
          throw new Error('Failed to fetch trips');
        }

        const data = await response.json();
        
        if (skipPagination) {
          setTrips(data);
          setMetadata(null);
        } else {
          setTrips(data.data);
          setMetadata(data.metadata);
        }
        
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchTrips();
  }, [type, page, limit, skipPagination]);

  return { trips, metadata, loading, error };
}