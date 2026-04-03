// app/components/trips/TripSummaryCard.tsx
import Link from 'next/link'
import { Clock, UserCheck, Users } from 'lucide-react';
import { MinimumTripRecord } from '@/types/trip';

export function TripSummaryCard(trip: MinimumTripRecord): React.JSX.Element {
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
            <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
              <Clock className="h-4 w-4" />
              <span>
                {new Date(trip.createdAt).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </span>
            </div>
            {trip.isInvited && trip.createdBy && (
              <div className="text-xs text-gray-400 dark:text-gray-500">
                Shared by {trip.createdBy}
              </div>
            )}
            {trip.inviteSummary && (
              <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
                <Users className="h-4 w-4" />
                <span>Invites: {trip.inviteSummary.accepted}/{trip.inviteSummary.total}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}
