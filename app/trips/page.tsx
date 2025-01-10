// src/app/(dashboard)/trips/page.tsx
import TripList from './components/TripList';
import { TripListType } from '@/types/trip';

export default function TripsPage() {
  return <TripList type={TripListType.MY_TRIPS} />;
}