import React from 'react';

interface TripRow {
  day: number;
  activity: string;
}

interface TripDetailsProps {
  name?: string;
  description?: string;
  isPublic?: boolean;
  rows?: TripRow[];
}

export default function TripDetails({ 
  name = 'Untitled Trip', 
  description = '', 
  isPublic = false, 
  rows = []
}: TripDetailsProps) {
  return (
    <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-sm space-y-8 p-6">
      <div>
        <h2 className="text-sm font-semibold text-gray-600">Trip Name</h2>
        <p className="mt-2 text-xl font-medium text-gray-900">{name}</p>
      </div>
      
      {description && (
        <div>
          <h2 className="text-sm font-semibold text-gray-600">Description</h2>
          <p className="mt-2 text-gray-700 whitespace-pre-wrap">{description}</p>
        </div>
      )}

      <div>
        <h2 className="text-sm font-semibold text-gray-600">Visibility</h2>
        <div className="mt-2 flex items-center">
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm ${
            isPublic 
              ? 'bg-green-100 text-green-800' 
              : 'bg-gray-100 text-gray-800'
          }`}>
            <div className={`w-2 h-2 rounded-full mr-2 ${
              isPublic ? 'bg-green-500' : 'bg-gray-500'
            }`}></div>
            {isPublic ? 'Public' : 'Private'}
          </div>
        </div>
      </div>

      <div>
        <h2 className="text-sm font-semibold text-gray-600 mb-4">Itinerary</h2>
        <div className="overflow-hidden border border-gray-200 rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                  Day
                </th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                  Activity
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {rows.length > 0 ? (
                rows.map((row, index) => (
                  <tr 
                    key={index}
                    className="hover:bg-gray-50 transition-colors duration-150 ease-in-out"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      Day {row.day}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {row.activity}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={2} className="px-6 py-8 text-center text-sm text-gray-500">
                    No itinerary items yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}