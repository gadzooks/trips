// types/trip.ts

import { TripAccessResult } from "./permissions"

// ============== TYPES defining a trip ==============
export interface MinimumTripRecord {
    createdBy: string
    tripId: string
    name: string
    createdAt: string
    updatedAt?: string
    startDate?: string
    endDate?: string
    isInvited?: boolean
    inviteSummary?: { total: number; accepted: number }
}

//FIXME use zod to validate the incoming data
export interface TripRecordDTO {
    tripId?: string
    SK?: string
    timestamp?: string
    userId?: string
    fakeData?: boolean
    name: string
    description: string
    isPublic: boolean
    invitees?: string[]
    tags?: string | string[]
    days?: TripDayDTO[]
    createdAt?: string
    createdBy?: string
}

//FIXME use zod to validate the incoming data
export interface TripDayDTO {
    date: string;
    itinerary: string;
    reservations: string;
    lodging: string;
    travelTime: string;
    notes: string;
    cost: string;
    cancelBy: string;
}

//FIXME use zod to validate the incoming data
export interface TripRecord extends TripRecordDTO{
    PK: string
    SK: string
}

// export enum AccessType {
//   Create = 'create',
//   ReadOnly = 'read-only',
//   ReadWrite = 'read-write',
//   Delete = 'delete'
// }

export interface TripRecordDTOWithAccess extends TripRecordDTO {
    tripAccessResult: TripAccessResult
}
// ============== TYPES defining a trip ==============