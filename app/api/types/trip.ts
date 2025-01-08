// src/types/trip.ts

export interface Day {
    date: string
    activity: string
    bookings: string
    stay: string
    travelTime: string
  }
  
  export interface CreateTripBody {
    title: string
    description: string
    isPublic: boolean
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
  
  export interface TripRecord {
    PK: string
    SK: string
    tripId: string
    userId: string
    title: string
    description: string
    isPublic: boolean
    isDeleted: boolean
    createdAt: string
    updatedAt: string
    'GSI1-PK'?: string
    'GSI1-SK'?: string
    sharedWith?: Record<string, boolean>
  }