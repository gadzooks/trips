// app/trips/page.tsx
import { TripListType } from '@/types/permissions';
import TripList from '../components/trips/TripList';

export default function TripsPage() {
  return <TripList type={TripListType.MY_TRIPS} />;
}