export enum TripListType {
    PUBLIC = 'public',
    MY_TRIPS = 'myTrips',
    BOTH = 'both'
}


// ============== TYPES defining a trip ==============
export interface TripRecordDTO {
    name: string
    description: string
    isPublic: boolean
    sharedWith?: string[]
    tags?: string[]
    days?: Day[]
}

export interface TripRecord extends TripRecordDTO{
    PK: string
    SK: string
}

export interface Day {
    id: string
    date: string
    activity: string
    bookings: string
    stay: string
    travelTime: string
    notes: string
}

// ============== TYPES defining a trip ==============

export interface TripAccessResult {
    allowed: boolean
    reason: string
}