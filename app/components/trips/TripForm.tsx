// app/components/trips/TripForm.tsx
import { TripDay } from '@/app/components/trips/TripDay';
import { Day } from '@/types/trip';
import PublicPrivateToggle from '../ui/input/PublicPrivateToggle';

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
  isReadOnly: boolean;
  submitLabel?: string;
}

export function TripForm({
  formData,
  onFieldChange,
  onSubmit,
  isReadOnly,
  submitLabel = 'Save Trip'
}: TripFormProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-2 py-2">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <div className="p-4 border-b border-gray-100 dark:border-gray-700">
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {isReadOnly ? 'View Trip' : submitLabel}
            </h1>
          </div>
          
          <form onSubmit={onSubmit} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trip Name
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => onFieldChange('name', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  required
                  placeholder="Enter trip name"
                  readOnly={isReadOnly}
                />
              </div>
              
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Tags (separated by space)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => onFieldChange('tags', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                  placeholder="summer beach family"
                  readOnly={isReadOnly}
                />
              </div>
              
              {!isReadOnly && (
                <div className="flex items-center space-y-2">
                  <div className="flex-grow">
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      {formData.isPublic ? 'Public' : 'Private'} Trip
                    </label>
                    <PublicPrivateToggle 
                      isPrivate={!formData.isPublic} 
                      toggle={() => onFieldChange('isPublic', !formData.isPublic)}
                    />
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => onFieldChange('description', e.target.value)}
                className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
                rows={3}
                placeholder="Describe your trip"
                readOnly={isReadOnly}
              />
            </div>

            <div className="mt-2">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-md">
                <TripDay 
                  onChange={(days) => onFieldChange('days', days)}
                  initialRows={formData.days}
                  isReadOnly={isReadOnly}
                />
              </div>
            </div>

            {!isReadOnly && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
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