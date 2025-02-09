// app/components/trips/trip-form/CompactTripView.tsx
import React, { useState } from 'react';
import { Switch } from '../../ui/shadcn/switch';
import { TripRecordDTO } from '@/types/trip';
import { EditableText } from '../../ui/input/EditableText';
import { Plane } from 'lucide-react';

interface CompactTripViewProps {
  isReadOnly: boolean;
  formData: Partial<TripRecordDTO>;
  handleAttributeUpdate: (key: keyof TripRecordDTO, value: TripRecordDTO[keyof TripRecordDTO]) => Promise<boolean>;
}

const CompactTripView: React.FC<CompactTripViewProps> = ({
  isReadOnly,
  formData,
  handleAttributeUpdate
}) => {
  const tags = Array.isArray(formData.tags) ? formData.tags : (formData.tags || '').split(' ').filter(Boolean);

  return (
    <>
      <div className="p-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
              <Plane className="w-8 h-8 text-blue-600" />
            <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {formData.name}
            </h1>

          </div>

          <div className='flex justify-evenly space-x-4' >
            <div className="flex items-center space-x-2">
              {!isReadOnly && (

                <label htmlFor="tripTags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Edit Tags
                </label>
              )}
              <EditableText
                id='tripTags'
                tripId={formData.tripId}
                SK={formData.SK}
                createdAt={formData.createdAt}
                createdBy={formData.createdBy}
                attributeValue={Array.isArray(formData.tags) ? formData.tags.join(' ') : formData.tags || ''}
                attributeKey="tags"
                isReadyOnly={isReadOnly}
                onSave={(value: string) => handleAttributeUpdate('tags', value.split(' ').filter(Boolean))}
                className="block w-full h-12 px-4 py-3 text-gray-900 dark:text-gray-100 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter tags separated by spaces"
                tabIndex={2}
              />

            </div>

            {!isReadOnly && (
              <div className="flex items-center space-x-2">
                <Switch
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleAttributeUpdate('isPublic', checked)}
                  className="bg-red-400 data-[state=checked]:bg-green-600"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {formData.isPublic ? 'Public' : 'Private'} Trip
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="space-y-2 p-4">
        <label htmlFor="tripDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Description*
        </label>
        <EditableText
          id='tripDescription'
          tripId={formData.tripId}
          SK={formData.SK}
          createdAt={formData.createdAt}
          createdBy={formData.createdBy}
          attributeKey="description"
          attributeValue={formData.description || ''}
          isReadyOnly={isReadOnly}
          onSave={(value: string) => handleAttributeUpdate('description', value)}
          isTextArea={true}
          className="block w-full h-32 px-4 py-3 text-gray-900 dark:text-gray-100 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
          placeholder="Enter trip description"
          tabIndex={3}
        />
      </div>
    </>
  );
};

export default CompactTripView;