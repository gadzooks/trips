// app/components/trips/trip-form/TripFormMetaData.tsx
import React from 'react';
import { Switch } from '@/components/ui/switch';
import { EditableText } from '../../ui/input/EditableText';
import { TripRecordDTO } from '@/types/trip';
import TripInvitesAndComments from './TripInvitesAndComments';

interface TripFormMetaDataProps {
  isNewRecord: boolean;
  isReadOnly: boolean;
  formData: Partial<TripRecordDTO>;
  handleAttributeUpdate: (key: keyof TripRecordDTO, value: TripRecordDTO[keyof TripRecordDTO]) => Promise<boolean>;
}

export const TripFormMetaData: React.FC<TripFormMetaDataProps> = ({
  isNewRecord,
  isReadOnly,
  formData,
  handleAttributeUpdate
}) => {
  return (
    <>
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            {isNewRecord ? 'Create New Trip' : isReadOnly ? 'View Trip' : 'Edit Trip'}
          </h1>
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

      <div className="p-6 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-2">
            <label htmlFor="tripName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Trip Name (Cannot be changed) *
            </label>
            <EditableText
              id='tripName'
              tripId={formData.tripId}
              SK={formData.SK}
              createdAt={formData.createdAt}
              createdBy={formData.createdBy}
              attributeValue={formData.name || ''}
              attributeKey="name"
              isReadyOnly={isReadOnly || !isNewRecord}
              onSave={(value: string) => handleAttributeUpdate('name', value)}
              className="block w-full h-12 px-4 py-3 text-gray-900 dark:text-gray-100 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter trip name"
              tabIndex={1}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="tripTags" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Tags
            </label>
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
        </div>

        <div className="space-y-2">
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

      </div>
    </>
  );
};