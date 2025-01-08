export interface TripRow {
    date: string;
    location: string;
    id: string;
    notes: string;
    activity: string;
    driveTime: string;
    [key: string]: string;
  }

  export interface Trip {
    tripId: string
    name: string
    description: string
    userId: string // owner's ID
    ownerName: string // owner's name
    permission: 'READ' | 'EDIT'
    createdAt: string
    rows: TripRow[]
  }
  
  export interface TripData {
  name?: string;
  description?: string;
  isPublic?: boolean;
  rows?: TripRow[];
  tripId?: string;
  updatedAt?: string;
  createdAt?: string;
  SK?: string;
  GSI1SK?: string;
  PK?: string;
}