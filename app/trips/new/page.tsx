"use client";

import { useState } from 'react';
import { TripTable } from '@/app/components/trip-table';
import { useRouter } from 'next/navigation';
import { TripRow } from '@/types/trip';

export default function NewTrip() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [rows, setRows] = useState<TripRow[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          description,
          isPublic,
          rows,
        }),
      });
      if (!response.ok) throw new Error('Failed to create trip');
      const { tripId } = await response.json();
      router.push(`/trips/${tripId}`);
    } catch (error) {
      console.error('Failed to create trip:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            Create New Trip
          </h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trip Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-3 px-4 text-gray-700 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors duration-200"
                  required
                  placeholder="Enter your trip name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-3 px-4 text-gray-700 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors duration-200"
                  rows={4}
                  placeholder="Describe your trip"
                />
              </div>

              <div className="flex items-center bg-purple-50 p-4 rounded-lg">
                <div className="relative">
                  <input
                    type="checkbox"
                    id="isPublic"
                    checked={isPublic}
                    onChange={(e) => setIsPublic(e.target.checked)}
                    className="h-5 w-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500 transition-colors duration-200"
                  />
                </div>
                <label htmlFor="isPublic" className="ml-3 block text-sm font-medium text-gray-700">
                  Make this trip public
                </label>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Itinerary
                </label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <TripTable onChange={setRows} />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-6 border-t border-gray-100">
              <button
                type="submit"
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105"
              >
                Create Trip
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}