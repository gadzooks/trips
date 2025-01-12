import { Clock } from 'lucide-react';
import { MinimumTripRecord } from '@/types/trip';

export function TripSummaryCard(trip: MinimumTripRecord): React.JSX.Element {
    return (
      <div
        key={trip.tripId}
        onClick={() => window.location.href = `/trips/${trip.tripId}`}
        className="group cursor-pointer"
      >
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-gray-100 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
              {trip.name}
            </h3>
            <div className="space-y-3 text-sm">
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
            </div>
          </div>
        </div>
      </div>
    );
  }