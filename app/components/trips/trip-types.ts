// app/components/trips/trip-types.ts
export interface TripDay {
    date: string;
    itinerary: string;
    reservations: string;
    lodging: string;
    driveTimes: string;
  }
  
  export interface TripFormData {
    name: string;
    tags: string;
    description: string;
    isPublic: boolean;
    days: TripDay[];
  }
  
  export interface TripFormProps {
    formData: TripFormData;
    onFieldChange: (field: keyof TripFormData, value: any) => void;
    onSubmit: (e: React.FormEvent) => void;
    isReadOnly?: boolean;
    submitLabel?: string;
  }
  
  export interface TripDayProps {
    onChange: (days: TripDay[]) => void;
    initialRows?: TripDay[];
    isReadOnly?: boolean;
  }