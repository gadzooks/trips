"use client";
import React, { useEffect, useState } from 'react';
import { TripRecord } from '@/types/trip';
import { EditableText } from '@/app/components/input/EditableText';

interface TripDetailsProps {
  tripId: string;
}

interface ColumnConfig {
  key: string;
  label: string;
  width?: string;
}

export default function TripDetails({ tripId }: TripDetailsProps) {
  const [trip, setTrip] = useState<TripRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTrip() {
      try {
        const response = await fetch(`/api/trips/${tripId}`);
        if (!response.ok) throw new Error('Failed to fetch trip');
        const data = await response.json();
        // console.log(JSON.stringify(data, null, 2));
        setTrip(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trip details');
      } finally {
        setLoading(false);
      }
    }

    fetchTrip();
  }, [tripId]);

  const handleUpdateTrip = async (updates: Partial<TripRecord>) => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      });
      
      if (!response.ok) throw new Error('Failed to update trip');
      
      setTrip(prev => prev ? { ...prev, ...updates } : null);
    } catch (err) {
      console.error('Failed to update trip:', err);
    }
  };

  if (loading) return <p>Loading trip details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!trip) return <p>Trip not found</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-purple-500 to-blue-500"></div>
          <div className="p-8 space-y-8">
            <div>
              <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-2">Trip Name</h2>
              <EditableText
                value={trip.name || ''}
                onSave={(value) => handleUpdateTrip({ name: value })}
                className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600"
              />
            </div>
            
            {trip.description !== undefined && (
              <div>
                <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-2">Description</h2>
                <EditableText
                  value={trip.description || ''}
                  onSave={(value) => handleUpdateTrip({ description: value })}
                  isTextArea={true}
                  className="text-gray-700 whitespace-pre-wrap bg-gray-50 rounded-lg border border-gray-100"
                />
              </div>
            )}

            <div>
              <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-2">Visibility</h2>
              <div className="mt-2 flex items-center">
                <button
                  onClick={() => handleUpdateTrip({ isPublic: !trip.isPublic })}
                  className={`inline-flex items-center px-4 py-2 rounded-full text-sm font-medium shadow-sm transition-colors duration-200 ${
                    trip.isPublic 
                      ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
                      : 'bg-gradient-to-r from-gray-500 to-gray-600 text-white'
                  }`}
                >
                  {trip.isPublic ? 'Public' : 'Private'}
                </button>
              </div>
            </div>

            <div>
              <h2 className="text-sm font-semibold text-purple-600 uppercase tracking-wider mb-4">Itinerary</h2>
              <div className="overflow-hidden border border-gray-200 rounded-xl shadow-sm">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr className="bg-gradient-to-r from-purple-50 to-blue-50">
                      {columns.map((column) => (
                        <th
                          key={column.key}
                          scope="col"
                          className={`px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider ${column.width || ''}`}
                        >
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {trip.rows?.length ?? 0 > 0 ? (
                      trip.rows?.map((row, index) => (
                        <tr 
                          key={row.id || index}
                          className="hover:bg-gradient-to-r hover:from-purple-50 hover:to-blue-50 transition-colors duration-200"
                        >
                          {columns.map((column) => (
                            <td key={`${row.id}-${column.key}`} className="px-6 py-4 whitespace-nowrap">
                              {column.key === 'date' ? (
                                <EditableText
                                  value={row[column.key]}
                                  onSave={(value) => { console.log(value); }}
                                //   onSave={(value) => handleUpdateRow(row.id, { [column.key]: value })}
                                  className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-700"
                                />
                              ) : (
                                <EditableText
                                  value={row[column.key]}
                                  onSave={(value) => { console.log(value); }}
                                //   onSave={(value) => handleUpdateRow(row.id, { [column.key]: value })}
                                  className="text-gray-700"
                                />
                              )}
                            </td>
                          ))}
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={columns.length} className="px-6 py-8 text-center">
                          <div className="text-gray-500">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                            </svg>
                            <p className="text-sm">No itinerary items yet</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}