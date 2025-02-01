// app/components/trips/trip-types.ts

import { TripDayDTO, TripRecordDTO } from "@/types/trip";
  
// export interface TripFormData {
//   name: string;
//   tags: string;
//   description: string;
//   isPublic: boolean;
//   days: TripDay[];
// }

// export interface TripFormProps {
//   formData: TripRecordDTO;
//   onFieldChange: (field: keyof TripRecordDTO, value: any) => void;
//   onSubmit: (e: React.FormEvent) => void;
//   isReadOnly?: boolean;
//   submitLabel?: string;
// }

export interface TripFormProps {
  initialData?: Partial<TripRecordDTO>;
  isReadOnly?: boolean;
  isNewRecord?: boolean;
  onSubmit?: (tripData: TripRecordDTO) => Promise<void>;
}

export interface TripDayProps {
  onChange: (days: TripDayDTO[]) => void;
  initialRows?: TripDayDTO[];
  isReadOnly?: boolean;
}