// app/components/trips/trip-form/social/TripDescriptionTab.tsx
import React from 'react';
import { EditableText } from '@/app/components/ui/input/EditableText';
import { TripRecordDTO } from '@/types/trip';

interface TripDescriptionTabProps {
    isReadOnly?: boolean;
    formData: Partial<TripRecordDTO>;
    handleAttributeUpdate: (key: keyof TripRecordDTO, value: TripRecordDTO[keyof TripRecordDTO]) => Promise<boolean>;
}

const TripDescriptionTab: React.FC<TripDescriptionTabProps> = ({
    isReadOnly = false,
    formData,
    handleAttributeUpdate,
}) => {
    return (
        <div className="space-y-2 p-4">
            <label
                htmlFor="tripDescription"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
                Description*
            </label>
            <EditableText
                id="tripDescription"
                tripId={formData.tripId}
                SK={formData.SK}
                createdAt={formData.createdAt}
                createdBy={formData.createdBy}
                attributeKey="description"
                attributeValue={formData.description || ""}
                isReadyOnly={isReadOnly}
                onSave={(value: string) =>
                    handleAttributeUpdate("description", value)
                }
                isTextArea={true}
                className="block w-full h-32 px-4 py-3 text-gray-900 dark:text-gray-100 text-sm bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                placeholder="Enter trip description"
                tabIndex={3}
            />
        </div>
    );
};

export default TripDescriptionTab;


