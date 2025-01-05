interface DynamoDBRow {
    M: {
      [key: string]: {
        S: string
      }
    }
  }
  
  interface TripDetailsProps {
    name: string
    description: string
    isPublic: boolean
    rows: {
      L: DynamoDBRow[]
    }
  }
  
  export function TripDetails({ name, description, isPublic, rows }: TripDetailsProps) {
    // Get column names from the first row if available
    const columns = rows.L.length > 0 ? Object.keys(rows.L[0].M) : []
  
    // Helper to format column header
    const formatColumnHeader = (column: string) => {
      return column
        .split(/(?=[A-Z])/)
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ')
    }
  
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
          <h2 className="text-sm font-medium text-gray-700 mb-2">Itinerary aaaaaaaaaaaa</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  {columns.map(column => (
                    <th
                      key={column}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {formatColumnHeader(column)}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {rows.L.map((row) => (
                  <tr key={row.M.id.S}>
                    {columns.map(column => (
                      <td
                        key={column}
                        className="px-6 py-4 text-sm text-gray-900"
                      >
                        {row.M[column].S}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }