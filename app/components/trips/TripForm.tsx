// app/components/trips/TripForm.tsx
import React from 'react';
import { useEffect } from 'react';
import { Card } from '../ui/shadcn/card';
import { Switch } from '../ui/shadcn/switch';
import type { TripFormProps } from './trip-types';
import { EditableText } from '../ui/input/EditableText';
import { updateTripAttribute } from '../ui/utils/updateTrip';
import { useState } from 'react';
import TripDayComponent from './TripDayComponent';

export const TripForm: React.FC<TripFormProps> = ({
  formData,
  onFieldChange,
  isReadOnly = false,
  submitLabel = 'Save Trip'
}) => {

  const [isPublic, setIsPublic] = useState(formData.isPublic);

  useEffect(() => {
    setIsPublic(formData.isPublic);
  }, [formData.isPublic]);

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
                      checked={isPublic}
                      onCheckedChange={async (checked) => {
                        setIsPublic(checked);
                        const result = await updateTripAttribute({
                          tripId: formData.tripId || '',
                          SK: formData.SK || '',
                          attributeKey: 'isPublic',
                          attributeValue: checked
                        });
                        if (!result.success) {
                          setIsPublic(!checked); // Revert on failure
                        }
                      }}
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

          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Trip Name
                </label>
                <EditableText
                  tripId={formData.tripId}
                  SK={formData.SK}
                  attributeValue={formData.name}
                  attributeKey='name'
                  isReadyOnly={isReadOnly}
                  // onSave={(value) => updateTripAttribute(formData.tripId || '','name', value)}
                  className="block w-full text-gray-900 dark:text-gray-100 text-sm bg-white dark:bg-gray-800"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tags
                </label>
                <EditableText
                  tripId={formData.tripId}
                  SK={formData.SK}
                  attributeValue={(formData.tags || []).join(' ')}
                  attributeKey='tags'
                  isReadyOnly={isReadOnly}
                  // onSave={(value) => updateTripAttribute(formData.tripId || '', 'tags', value)}
                  className="block w-full text-gray-900 dark:text-gray-100 text-sm bg-white dark:bg-gray-800"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Description
              </label>
              <EditableText
                tripId={formData.tripId}
                SK={formData.SK}
                attributeKey='description'
                attributeValue={formData.description}
                isReadyOnly={isReadOnly}
                // onSave={(value) => handleFieldUpdate('description', value)}
                isTextArea={true}
                className="block w-full text-gray-900 dark:text-gray-100 text-sm bg-white dark:bg-gray-800"
              />
            </div>
            <div className="rounded-lg overflow-hidden">
              <TripDayComponent
                // onChange={(days) => handleFieldUpdate('days', days)}
                onChange={() => {}}
                initialRows={formData.days}
                isReadOnly={isReadOnly}
              />
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};