export enum TripListType {
    PUBLIC = 'public',
    MY_TRIPS = 'myTrips',
    BOTH = 'both'
}

export interface CreateTripBody {
    name: string
    description: string
    isPublic: boolean
    sharedWith?: string[]
    tags?: string[]
    days?: Day[]
}

export interface ReorderDaysBody {
    tripId: string
    moves: Array<{
        dayId: string
        newPosition: number
    }>
}

export interface InsertDaysBody {
    tripId: string
    days: Array<Day & {
        position: number
    }>
}

export interface DeleteDaysBody {
    tripId: string
    dayIds: string[]
}

export interface TripAccessResult {
    allowed: boolean
    reason: string
}

export interface TripIdentifier {
    tripId: string;
    userId: string;
    timestamp: string;
}

export interface TripRecord {
    PK: string
    SK: string
    tripId: string
    userId: string
    name: string
    description: string
    isPublic: boolean
    isDeleted: boolean
    days: Day[]
    createdAt: string
    updatedAt: string
    tags?: string[]
    sharedWith?: string[]
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