// types/trip.ts
export enum TripListType {
    PUBLIC = 'public',
    MY_TRIPS = 'myTrips',
    BOTH = 'both'
}

// ============== TYPES defining a trip ==============
export interface MinimumTripRecord {
    createdBy: string
    tripId: string
    name: string
    // isPublic: boolean
    createdAt: string
}

export interface TripRecordDTO {
    tripId?: string
    SK?: string
    timestamp?: string
    userId?: string
    fakeData?: boolean
    name: string
    description: string
    isPublic: boolean
    sharedWith?: string[]
    tags?: string | string[]
    days?: TripDayDTO[]
    createdAt?: string
    createdBy?: string
}

export interface TripDayDTO {
    date: string;
    itinerary: string;
    reservations: string;
    lodging: string;
    travelTime: string;
    notes: string;
}

export interface TripRecord extends TripRecordDTO{
    PK: string
    SK: string
}
// ============== TYPES defining a trip ==============