// app/trips/[tripId]/page.tsx
"use client";
import React, { use, useEffect } from 'react';
import { Card } from '@/app/components/ui/shadcn/card';
import { Switch } from '@/app/components/ui/shadcn/switch';
import { TripFormProps } from '@/app/components/trips/trip-types';
import TripDayComponent from '@/app/components/trips/TripDayComponent'; 
import { EditableText } from '@/app/components/ui/input/EditableText';
import { useState } from 'react';

interface ExtendedTripFormProps extends TripFormProps {
  mode: 'create' | 'edit' | 'view';
}

function getTripLabel(mode: 'create' | 'edit' | 'view', tripId?: string) {
  switch (mode) {
    case 'create':
      return 'Create Trip';
    case 'edit':
      return 'Edit Trip ' + (tripId ? `# ${tripId.slice(-5)}` : '');
    case 'view':
      return 'Trip Details' + (tripId ? `: ${tripId.slice(-5)}` : '');
  }
}

export const TripForm: React.FC<ExtendedTripFormProps> = ({
  formData,
  onFieldChange,
  onSubmit,
  mode,
  isReadOnly = false,
  submitLabel = getTripLabel(mode, formData.tripId)
}) => {
  const handleFieldUpdate = async (field: string, value: string | boolean) => {
    onFieldChange(field, value);
    
    if (mode === 'edit' && formData.tripId) {
      try {
        const response = await fetch(`/api/trips/${formData.tripId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            [field]: field === 'tags' ? value.split(' ') : value 
          })
        });
        
        if (!response.ok) {
          throw new Error('Failed to update field');
        }
      } catch (error) {
        console.error(`Failed to update ${field}:`, error);
      }
    }
  };

  const renderField = (label: string, field: string, value: string, isTextArea = false) => {
    if (mode === 'create') {
      return (
        <input
          type={isTextArea ? 'textarea' : 'text'}
          value={value}
          onChange={(e) => onFieldChange(field, e.target.value)}
          className="block w-full rounded-md border border-gray-300 dark:border-gray-600 px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm shadow-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          required={field === 'name'}
        />
      );
    }
    
    return (
      <EditableText
        value={value}
        onSave={(value) => handleFieldUpdate(field, value)}
        isTextArea={isTextArea}
        className="block w-full text-gray-900 dark:text-gray-100 text-sm bg-white dark:bg-gray-800"
      />
    );
  };

  const content = (
    <div className="p-6 space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Trip Name
          </label>
          {renderField('Trip Name', 'name', formData.name)}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Tags
          </label>
          {renderField('Tags', 'tags', formData.tags)}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        {renderField('Description', 'description', formData.description, true)}
      </div>

      <div className="rounded-lg overflow-hidden">
        <TripDayComponent
          onChange={(days) => handleFieldUpdate('days', days)}
          initialRows={formData.days}
          isReadOnly={isReadOnly}
        />
      </div>
    </div>
  );

  if (mode === 'create') {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
            <form onSubmit={onSubmit}>
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {submitLabel}
                </h1>
              </div>
              {content}
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
            </form>
          </Card>
        </div>
      </div>
    );
  }

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
                      onCheckedChange={(checked) => handleFieldUpdate('isPublic', checked)}
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
          {content}
        </Card>
      </div>
    </div>
  );
};

export default function TripPage({ params }: { params: Promise<{ tripId: string }> }) {
  const { tripId } = use(params);
  const [formData, setFormData] = useState({
    id: tripId,
    name: '',
    description: '',
    tags: [],
    days: [],
    isPublic: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTripDetails() {
      try {
        setLoading(true);
        const response = await fetch(`/api/trips/${tripId}`);
        if (!response.ok) throw new Error('Failed to fetch trip details');
        const data = await response.json();
        console.log('response -------------->>>>>>>', data);
        setFormData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load trip details');
      } finally {
        setLoading(false);
      }
    }
    fetchTripDetails();
  }, [tripId]);


  const handleFieldChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  };

  return (
    <TripForm
      mode="edit"
      formData={formData}
      onFieldChange={handleFieldChange}
      onSubmit={handleSubmit}
    />
  );
}