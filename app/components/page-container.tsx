// components/ui/page-container.tsx
export function PageContainer({ children }: { children: React.ReactNode }) {
    return (
      <div className="max-w-4xl mx-auto">
        {children}
      </div>
    )
  }
  
  // components/ui/page-header.tsx
  export function PageHeader({ title }: { title: string }) {
    return (
      <h1 className="text-3xl font-bold mb-6">{title}</h1>
    )
  }
  
  // components/trip/trip-details.tsx
  import { TripRow } from './types/TripRow'
  
  interface TripDetailsProps {
    name: string
    description: string
    isPublic: boolean
    rows: TripRow[]
  }
  
  export function TripDetails({ name, description, isPublic, rows }: TripDetailsProps) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-sm font-medium text-gray-700">Trip Name</h2>
          <p className="mt-1 text-lg">{name}</p>
        </div>
        
        {description && (
          <div>
            <h2 className="text-sm font-medium text-gray-700">Description</h2>
            <p className="mt-1 whitespace-pre-wrap">{description}</p>
          </div>
        )}
  
        <div>
          <h2 className="text-sm font-medium text-gray-700">Visibility</h2>
          <p className="mt-1">{isPublic ? 'Public' : 'Private'}</p>
        </div>
  
        <div>
          <h2 className="text-sm font-medium text-gray-700 mb-2">Itinerary</h2>
          {tripActivities(rows)}
        </div>
      </div>
    )
  }

function tripActivities(rows: TripRow[]) {
    return <table className="min-w-full divide-y divide-gray-200">
        <thead>
            <tr>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Day</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-500">Activity</th>
            </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
            {rows.map((row, index) => (
                <tr key={index}>
                    <td className="px-4 py-2 text-sm">{row.day}</td>
                    <td className="px-4 py-2 text-sm">{row.activity}</td>
                </tr>
            ))}
        </tbody>
    </table>
}
