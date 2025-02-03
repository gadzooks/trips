// app/components/trips/trip-types.ts

import { TripDayDTO, TripRecordDTO } from "@/types/trip";
  
export interface TripFormProps {
  initialData?: Partial<TripRecordDTO>;
  isReadOnly?: boolean;
  isNewRecord?: boolean;
  onSubmit?: (tripData: TripRecordDTO) => Promise<void>;
}

export interface TripDayProps {
  onChange: (days: TripDayDTO[]) => void;
  initialRows?: TripDayDTO[];
  isReadOnly: boolean;
  isNewRecord: boolean;
}