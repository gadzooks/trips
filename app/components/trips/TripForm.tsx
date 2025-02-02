// app/components/trips/TripForm.tsx
import React, { useState, useEffect } from 'react';
import { Card } from '../ui/shadcn/card';
import { Switch } from '../ui/shadcn/switch';
import { Button } from '../ui/shadcn/button';
import { EditableText } from '../ui/input/EditableText';
import { updateTripAttribute } from '../ui/utils/updateTrip';
import TripDayComponent from './TripDayComponent';
import { TripRecordDTO } from '@/types/trip';
import { TripFormProps } from './trip-types';

const defaultTrip: TripRecordDTO = {
  name: '',
  description: '',
  tags: [],
  isPublic: false,
  days: []
};

export const TripForm: React.FC<TripFormProps> = ({
  initialData = {},
  isReadOnly = false,
  isNewRecord = false,
  onSubmit
}) => {
  const [formData, setFormData] = useState<TripRecordDTO>({ 
    ...defaultTrip, 
    ...initialData,
    tags: Array.isArray(initialData.tags) ? initialData.tags : []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = Boolean(formData.tripId && formData.SK);

  const handleAttributeUpdate = async (
    key: keyof TripRecordDTO,
    value: TripRecordDTO[keyof TripRecordDTO]
  ): Promise<boolean> => {
    if (isNewRecord || !isEditMode) {
      setFormData(prev => ({ ...prev, [key]: value }));
      return true;
    }
  
    try {
      const result = await updateTripAttribute({
        tripId: formData.tripId!,
        SK: formData.SK!,
        attributeKey: key,
        attributeValue: value
      });
  
      if (result.success) {
        setFormData(prev => ({ ...prev, [key]: value }));
        return true;
      }
      setError('Failed to update trip');
      return false;
    } catch (err) {
      setError('Error updating trip');
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isReadOnly || !onSubmit) return;

    try {
      setIsSubmitting(true);
      setError(null);
      await onSubmit(formData);
    } catch (err: any) {
      setError('Failed to save trip : ' + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <div className="p-6 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {isReadOnly ? 'Trip Details' : isEditMode ? 'Edit Trip' : 'Create Trip'}
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
                  Trip Name
                </label>
                <EditableText
                  tripId={formData.tripId}
                  SK={formData.SK}
                  attributeValue={formData.name}
                  attributeKey="name"
                  isReadyOnly={isReadOnly}
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
                  tripId={formData.tripId}
                  SK={formData.SK}
                  attributeValue={typeof formData.tags === 'string' ? formData.tags : (formData.tags || []).join(' ')}
                  attributeKey="tags"
                  isReadyOnly={isReadOnly}
                  onSave={(value: string) => handleAttributeUpdate('tags', value)}
                  className="block w-full h-12 px-4 py-3 text-gray-900 dark:text-gray-100 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter tags separated by spaces"
                  tabIndex={2}
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="tripDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </label>
              <EditableText
                tripId={formData.tripId}
                SK={formData.SK}
                attributeKey="description"
                attributeValue={formData.description}
                isReadyOnly={isReadOnly}
                onSave={(value: string) => handleAttributeUpdate('description', value)}
                isTextArea={true}
                className="block w-full h-32 px-4 py-3 text-gray-900 dark:text-gray-100 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Enter trip description"
                tabIndex={3}
              />
            </div>

            {!isNewRecord && (
            <div className="rounded-lg overflow-hidden">
              <TripDayComponent
                onChange={(days) => handleAttributeUpdate('days', days)}
                initialRows={formData.days}
                isReadOnly={isReadOnly}
                isNewRecord={isNewRecord}
              />
            </div>
            )}

            {isNewRecord && (
            <div className='flex justify-center' >
              Create a new trip to add itinerary
              </div>
            )}

            {error && (
              <div className="text-red-500 text-sm mt-2">
                {error}
              </div>
            )}

            {!isReadOnly && !isEditMode && (
              <div className="flex justify-end mt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                  tabIndex={4}
                >
                  {isSubmitting ? 'Saving...' : 'Create Trip'}
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </form>
  );
};