// app/components/site-wide/sidebar/PublicTrips.tsx
import { TripListType } from "@/types/trip";
import { TripSection } from "./TripSection";

// app/components/site-wide/sidebar/PublicTrips.tsx
export function PublicTrips({ tripsPerSection }: { tripsPerSection: number }) {
  return (
    <TripSection
      title="Latest Public Trips"
      type={TripListType.PUBLIC}
      tripsPerSection={tripsPerSection}
      emptyMessage="No public trips available"
    />
  );
}