// app/components/trips/TripForm.tsx
import React from 'react';
import { Card } from '../ui/shadcn/card';
import { Switch } from '../ui/shadcn/switch';
import type { TripFormProps } from './trip-types';
import TripDayComponent from './TripDayComponent';

export const TripForm: React.FC<TripFormProps> = ({
  formData,
  onFieldChange,
  onSubmit,
  isReadOnly = false,
  submitLabel = 'Save Trip'
}) => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {isReadOnly ? 'Trip Details' : submitLabel}
              </h1>
              {!isReadOnly && (
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={formData.isPublic}
                      onCheckedChange={(checked) => onFieldChange('isPublic', checked)}
                      className="bg-red-400 data-[state=checked]:bg-green-600"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      {formData.isPublic ? 'Public' : 'Private'} Trip
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          <form onSubmit={onSubmit}>
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Trip Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => onFieldChange('name', e.target.value)}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    required
                    placeholder="Enter trip name"
                    readOnly={isReadOnly}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Tags
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => onFieldChange('tags', e.target.value)}
                    className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    placeholder="summer beach family"
                    readOnly={isReadOnly}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => onFieldChange('description', e.target.value)}
                  className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500 placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  rows={3}
                  placeholder="Describe your trip"
                  readOnly={isReadOnly}
                />
              </div>

              <div className="rounded-lg overflow-hidden">
                <TripDayComponent
                  onChange={(days) => onFieldChange('days', days)}
                  initialRows={formData.days}
                  isReadOnly={isReadOnly}
                />
              </div>
            </div>

            {!isReadOnly && (
              <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-2 bg-purple-600 text-white text-sm font-medium rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900 transition-colors"
                  >
                    {submitLabel}
                  </button>
                </div>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};