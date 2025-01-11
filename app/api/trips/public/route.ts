// app/api/trips/public/route.js
import { NextResponse } from 'next/server';
import { CreateTripDbService } from '../../services/createTripDbService'
import { MinimumTripRecord} from '@/types/trip';

const tripService = new CreateTripDbService()

export async function GET(request: Request) {
  try {

    const trips: MinimumTripRecord[] = await tripService.getByTag('PUBLIC', true)

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Failed to fetch trips:', error)
    return new Response('Failed to fetch trips', { status: 500 })
  }
}