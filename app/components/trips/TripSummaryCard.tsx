// app/components/trips/TripSummaryCard.tsx
import Link from 'next/link'
import { Clock, UserCheck, CalendarRange } from 'lucide-react';
import { MinimumTripRecord } from '@/types/trip';

function formatCardDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function formatTripDate(dateStr: string): string {
  // Handles MM/DD/YYYY or ISO formats
  const parts = dateStr.split('/');
  if (parts.length === 3) {
    const d = new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1]));
    return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
  }
  return new Date(dateStr).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });
}

export function TripSummaryCard(trip: MinimumTripRecord): React.JSX.Element {
  const displayDate = trip.updatedAt || trip.createdAt;
  const startDate = trip.days?.[0]?.date;
  const endDate = trip.days?.[trip.days.length - 1]?.date;
  const hasTripDates = !!(startDate && endDate);
  const sameDay = startDate === endDate;

  return (
    <Link href={`/trips/${trip.tripId}`} className="group cursor-pointer">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
        <div className={`h-2 bg-gradient-to-r ${trip.isInvited ? 'from-teal-500 to-cyan-500' : 'from-purple-500 to-blue-500'}`}></div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
              {trip.name}
            </h3>
            {trip.isInvited && (
              <span className="ml-2 shrink-0 inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-cyan-100 text-cyan-800 dark:bg-cyan-900/40 dark:text-cyan-300">
                <UserCheck className="w-3 h-3" />
                Invited
              </span>
            )}
          </div>
          <div className="space-y-1.5 text-sm">
            {hasTripDates && (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-300">
                <CalendarRange className="h-4 w-4 shrink-0" />
                <span>
                  {sameDay
                    ? formatTripDate(startDate!)
                    : `${formatTripDate(startDate!)} – ${formatTripDate(endDate!)}`}
                </span>
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-400 dark:text-gray-500">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span className="text-xs">Updated {formatCardDate(displayDate)}</span>
            </div>
            {trip.isInvited && trip.createdBy && (
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Shared by {trip.createdBy}
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
