// components/trip/trip-details.tsx
interface TripRow {
    day: number
    activity: string
  }
  
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
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Day
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.map((row, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {row.day}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {row.activity}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    )
  }