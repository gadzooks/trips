// app/components/trips/trip-types.ts

import { TripDayDTO, TripRecordDTO, TripRecordDTOWithAccess } from "@/types/trip";
  
export interface TripFormProps {
  initialData: Partial<TripRecordDTOWithAccess>;
  isNewRecord: boolean;
  onSubmit?: (tripData: TripRecordDTO) => Promise<void>;
}

export interface TripDayProps {
  onChange: (days: TripDayDTO[]) => void;
  initialRows?: TripDayDTO[];
  isReadOnly: boolean;
  isNewRecord: boolean;
}

export interface TripComment {
  PK: string;
  SK: string;
  commentId: string;
  tripId: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: string;
  updatedAt?: string;
  isSystem: boolean;
  parentCommentId?: string;
  GSI1PK?: string;
  GSI1SK?: string;
}