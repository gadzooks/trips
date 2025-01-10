// components/TripForm.tsx
import { TripItinerary } from '@/app/components/trip-itinerary';
import { Day } from '@/types/trip';

export interface TripFormData {
  name: string;
  description: string;
  tags: string;
  isPublic: boolean;
  days: Day[];
}

interface TripFormProps {
  formData: TripFormData;
  onFieldChange: (field: keyof TripFormData, value: any) => void;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  isReadOnly?: boolean;
  submitLabel?: string;
}

export function TripForm({
  formData,
  onFieldChange,
  onSubmit,
  isReadOnly = false,
  submitLabel = 'Save Trip'
}: TripFormProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
            {isReadOnly ? 'View Trip' : submitLabel}
          </h1>
          
          <form onSubmit={onSubmit} className="space-y-8">
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Trip Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => onFieldChange('name', e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-3 px-4 text-gray-700 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors duration-200"
                  required
                  placeholder="Enter your trip name"
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => onFieldChange('description', e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-3 px-4 text-gray-700 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors duration-200"
                  rows={4}
                  placeholder="Describe your trip"
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => onFieldChange('tags', e.target.value)}
                  className="mt-1 block w-full rounded-lg border-gray-200 bg-gray-50 py-3 px-4 text-gray-700 shadow-sm focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-colors duration-200"
                  placeholder="Enter tags separated by spaces"
                  readOnly={isReadOnly}
                  disabled={isReadOnly}
                />
                {!isReadOnly && (
                  <p className="mt-2 text-sm text-gray-500">
                    Separate tags with spaces (e.g., "summer beach family")
                  </p>
                )}
              </div>
 
              {!isReadOnly && (
                <div className="flex items-center bg-purple-50 p-4 rounded-lg">
                  <div className="relative">
                    <input
                      type="checkbox"
                      id="isPublic"
                      checked={formData.isPublic}
                      onChange={(e) => onFieldChange('isPublic', e.target.checked)}
                      className="h-5 w-5 rounded border-purple-300 text-purple-600 focus:ring-purple-500 transition-colors duration-200"
                      disabled={isReadOnly}
                    />
                  </div>
                  <label htmlFor="isPublic" className="ml-3 block text-sm font-medium text-gray-700">
                    Make this trip public
                  </label>
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  Itinerary
                </label>
                <div className="bg-gray-50 rounded-lg p-4">
                  <TripItinerary 
                    onChange={(days) => onFieldChange('days', days)}
                    initialRows={formData.days}
                    isReadOnly={isReadOnly}
                  />
                </div>
              </div>
            </div>

            {!isReadOnly && (
              <div className="flex justify-end pt-6 border-t border-gray-100">
                <button
                  type="submit"
                  className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg shadow-md hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 transform transition-all duration-200 hover:scale-105"
                >
                  {submitLabel}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}