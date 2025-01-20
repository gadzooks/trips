// app/components/trips/TripSummaryList.tsx
"use client";

import { useTrips } from '@/lib/hooks/useTrips';

export default function TripsList({
  type,
  page = 1,
  limit = 2,
  skipPagination = false
}) {
  const { trips, metadata, loading, error } = useTrips({
    type,
    page,
    limit,
    skipPagination
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {/* Render your trips here */}
    </div>
  );
}