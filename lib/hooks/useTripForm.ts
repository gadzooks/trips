// lib/hooks/useTripForm.ts
import { useState } from 'react';
import { Day } from '@/types/trip';

export interface TripFormData {
  name: string;
  description: string;
  tags: string;
  isPublic: boolean;
  days: Day[];
}

export function useTripForm(initialData?: Partial<TripFormData>) {
  const [formData, setFormData] = useState<TripFormData>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    tags: initialData?.tags || '',
    isPublic: initialData?.isPublic || false,
    days: initialData?.days || [],
  });

  const updateField = (field: keyof TripFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    updateField,
    setFormData,
  };
}