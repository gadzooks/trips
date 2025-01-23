// lib/hooks/useTripForm.ts
import { useState } from 'react';
import { TripDayDTO, TripRecordDTO } from '@/types/trip';

// export interface TripFormData {
//   name: string;
//   description: string;
//   tags: string;
//   isPublic: boolean;
//   days: TripDayDTO[];
// }

export function useTripForm(initialData?: Partial<TripRecordDTO>) {
  const [formData, setFormData] = useState<TripRecordDTO>({
    name: initialData?.name || '',
    description: initialData?.description || '',
    tags: initialData?.tags || [],
    isPublic: initialData?.isPublic || false,
    days: initialData?.days || [],
  });

  const updateField = (field: keyof TripRecordDTO, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return {
    formData,
    updateField,
    setFormData,
  };
}