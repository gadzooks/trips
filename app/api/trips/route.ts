// app/api/trips/route.ts

import { NextResponse } from 'next/server'
import { TripRecordDTO } from '@/types/trip'
import { CreateTripDbService } from '../../../server/service/createTripDbService'
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
    const userId = body.userId || session.user.email
    // console.log('tags type is ', typeof body.tags)
    // console.log('tags is ', body.tags)
    // const createTripRequest: TripRecordDTO = toArrayTags(body)
    
    const result = await tripService.createTrip(body, userId)
    return NextResponse.json({ tripId: result })
  } catch (error) {
    console.error('Failed to create trip:', error)
    return new Response('Failed to create trip', { status: 500 })
  }
}