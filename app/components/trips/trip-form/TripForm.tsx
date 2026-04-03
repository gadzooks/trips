// app/components/trips/trip-form/TripForm.tsx
import React, { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { updateTripAttribute } from '../../ui/utils/updateTrip';
import TripDayComponent from './TripDayComponent';
import { TripFormMetaData } from './TripFormMetaData';
import { TripRecordDTO, TripRecordDTOWithAccess } from '@/types/trip';
import { TripFormProps } from '../trip-types';
import CompactTripView from './CompactTripView';
import { EditableText } from '../../ui/input/EditableText';
import TripSocialTab from './TripSocialTab';
import { Permission } from '@/types/permissions';

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
    // console.log('Form submitted!'); 
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

  const hasWriteAccess = formData.tripAccessResult?.permissions && formData.tripAccessResult.permissions.includes(Permission.EDIT)
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
            <Tabs defaultValue="itinerary" className="w-full">
              <div className="px-4 pt-4 pb-2">
                <TabsList className="bg-gray-100 dark:bg-gray-800 p-1 h-auto gap-1 rounded-xl">
                  {(['itinerary', 'description', 'comments', 'invites'] as const).map((tab) => (
                    <TabsTrigger
                      key={tab}
                      value={tab}
                      className="rounded-lg px-4 py-1.5 font-medium uppercase tracking-wide text-gray-500 dark:text-gray-400 transition-all duration-200 data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700 data-[state=active]:text-purple-600 dark:data-[state=active]:text-purple-400 data-[state=active]:shadow-sm data-[state=active]:shadow-gray-200 dark:data-[state=active]:shadow-gray-900 hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      {tab}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </div>
              <TabsContent value="itinerary" className="mt-0">
                <div className="rounded-lg overflow-hidden">
                  <TripDayComponent
                    onChange={(days) => handleAttributeUpdate('days', days)}
                    initialRows={formData.days}
                    isReadOnly={isReadOnly}
                    isNewRecord={isNewRecord}
                  />
                </div>
              </TabsContent>
              <TabsContent value="description" className="mt-0">
                <div className="p-6">
                  <EditableText
                    id="tripDescription"
                    tripId={formData.tripId}
                    SK={formData.SK}
                    createdAt={formData.createdAt}
                    createdBy={formData.createdBy}
                    attributeKey="description"
                    attributeValue={formData.description || ''}
                    isReadyOnly={isReadOnly}
                    onSave={(value) => handleAttributeUpdate('description', value)}
                    isTextArea={true}
                    className="block w-full min-h-32 px-4 py-3 text-gray-900 dark:text-gray-100 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Enter trip description"
                  />
                </div>
              </TabsContent>
              <TabsContent value="invites" className="mt-0">
                <TripSocialTab
                  panel="invites"
                  isReadOnly={isReadOnly}
                  formData={formData}
                  handleAttributeUpdate={handleAttributeUpdate}
                />
              </TabsContent>
              <TabsContent value="comments" className="mt-0">
                <TripSocialTab
                  panel="comments"
                  isReadOnly={isReadOnly}
                  formData={formData}
                  handleAttributeUpdate={handleAttributeUpdate}
                />
              </TabsContent>
            </Tabs>
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