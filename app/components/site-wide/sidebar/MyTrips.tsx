// app/components/site-wide/sidebar/MyTrips.tsx
import { TripListType } from "@/types/trip";
import { TripSection } from "./TripSection";
export function MyTrips({ tripsPerSection }: { tripsPerSection: number }) {
  return (
    <TripSection
      title="My Recent Trips"
      type={TripListType.MY_TRIPS}
      tripsPerSection={tripsPerSection}
      emptyMessage="No trips yet"
    />
  );
}