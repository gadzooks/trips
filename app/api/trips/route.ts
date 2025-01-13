// app/api/trips/route.ts

import { NextResponse } from 'next/server'
import { TripDbService } from '../services/tripDbService'
import { TripRecordDTO } from '@/types/trip'
import { CreateTripDbService } from '../services/createTripDbService'
import { auth } from '@/auth'

const tripService = new CreateTripDbService()

export async function POST(request: Request) {
  try {
    const session = await auth()
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: 'Failed to create trip for ' },
        { status: 403 }
      )
    }
    const body: TripRecordDTO = await request.json()
    const userId = session.user.email
    
    const result = await tripService.createTrip(body, userId)
    return NextResponse.json({ tripId: result })
  } catch (error) {
    console.error('Failed to create trip:', error)
    return new Response('Failed to create trip', { status: 500 })
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tripId = searchParams.get('tripId')
  const tag = searchParams.get('tag')
  const userId = 'test-user' // Replace with session.user.id
  const includePublic = searchParams.get('includePublic') === 'true'
  const publicOnly = searchParams.get('publicOnly') === 'true'

  const dbService = new TripDbService()

  try {
    // Case 1: Get specific trip
    if (tripId) {
      const { allowed } = await dbService.validateTripAccess(tripId, userId)
      if (!allowed) {
        return new Response('Access denied', { status: 403 })
      }

      const result = await dbService.getTripDays(tripId)
      return NextResponse.json(result)
    }

    // Case 2: Get trips by tag or user's trips
    const trips = await dbService.getTripsForUser(userId, includePublic, publicOnly)
    
    if (tag) {
      // Filter by tag if specified
      const taggedTrips = trips.filter(trip => 
        trip['tripTimestampSortKey']?.startsWith(`TAG#${tag}`)
      )
      return NextResponse.json(taggedTrips)
    }

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Failed to fetch trips:', error)
    return new Response('Failed to fetch trips', { status: 500 })
  }
}