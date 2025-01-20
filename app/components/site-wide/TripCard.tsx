// app/components/site-wide/TripCard.tsx
interface TripCardProps {
    title: string
    date: string
  }

  export function TripCard({ title, date }: TripCardProps) {
    return (
      <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer">
        <h3 className="font-medium text-transparent bg-clip-text bg-blue-400">{title}</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{date}</p>
      </div>
    )
  }