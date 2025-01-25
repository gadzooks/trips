// app/components/site-wide/TripCard.tsx
import Link from 'next/link';

interface TripCardProps {
  title: string;
  date: string;
  tripId: string;
  onClick?: () => void;
}

export function TripCard({ title, date, tripId, onClick }: TripCardProps) {
  return (
    <Link href={`/trips/${tripId}`} onClick={onClick}>
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
        <h3 className="font-medium text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-blue-600">
          {title}
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
      </div>
    </Link>
  );
}