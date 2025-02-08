// app/components/trips/trip-form/TripForm.tsx
import React, { useState } from 'react';
import { Card } from '../../ui/shadcn/card';
import { Button } from '../../ui/shadcn/button';
import { updateTripAttribute } from '../../ui/utils/updateTrip';
import TripDayComponent from './TripDayComponent';
import { TripFormMetaData } from './TripFormMetaData';
import { TripRecordDTO, TripRecordDTOWithAccess } from '@/types/trip';
import { TripFormProps } from '../trip-types';
import CompactTripView from './CompactTripView';

export const TripForm: React.FC<TripFormProps> = ({
  initialData,
  isNewRecord,
  onSubmit
}) => {
  const [formData, setFormData] = useState<Partial<TripRecordDTOWithAccess>>({ 
    ...initialData,
    tags: Array.isArray(initialData?.tags) ? initialData.tags : initialData?.tags?.split(' ').filter(Boolean) || []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAttributeUpdate = async (
    key: keyof TripRecordDTO,
    value: TripRecordDTO[keyof TripRecordDTO]
  ): Promise<boolean> => {
    if (isNewRecord) {
      setFormData(prev => ({ ...prev, [key]: value }));
      return true;
    }
  
    try {
      if (formData.tripId === undefined || formData.SK === undefined || formData.createdBy === undefined || formData.name === undefined) {
        setError('Invalid trip data : missing tripId, SK or createdBy : ' + [formData.tripId, formData.SK, formData.createdBy]);
        return false;
      }
      const result = await updateTripAttribute({
        tripId: formData.tripId,
        name: formData.name,
        createdAt: formData.SK,
        createdBy: formData.createdBy,
        tags: Array.isArray(formData.tags) ? formData.tags.join(' ') : formData.tags,
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
    if (!formData.name?.trim()) {
      setError('Trip name is required');
      return;
    }

    if (!formData.description?.trim()) {
      setError('Trip description is required');
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      
      const tripDataToSubmit = {
        ...formData,
        name: formData.name.trim(),
        description: formData.description.trim(),
        tags: Array.isArray(formData.tags) ? formData.tags.join(' ') : formData.tags || '',
        days: formData.days || []
      };

      if (onSubmit) {
        await onSubmit(tripDataToSubmit as TripRecordDTO);
      }
    } catch (err: any) {
      setError(err.message || 'Failed to save trip');
    } finally {
      setIsSubmitting(false);
    }
  };

  const hasWriteAccess = formData.tripAccessResult?.hasWriteAccess;
  const isReadOnly = !hasWriteAccess;

  return (
    <form onSubmit={handleSubmit} className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto">
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          {isNewRecord && (
          <TripFormMetaData
            isNewRecord={isNewRecord}
            isReadOnly={isReadOnly}
            formData={formData}
            handleAttributeUpdate={handleAttributeUpdate}
          />
          )}

          {!isNewRecord && (
          <CompactTripView
            isReadOnly={isReadOnly}
            formData={formData}
            handleAttributeUpdate={handleAttributeUpdate}  
          /> )}

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
            <div className='flex justify-center text-gray-600 dark:text-gray-400'>
              Create a new trip to add itinerary
            </div>
          )}

          {error && (
            <div className="text-red-500 text-sm mt-2">
              {error}
            </div>
          )}

          {isNewRecord && (
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
        </Card>
      </div>
    </form>
  );
};