// app/api/trips/tags/[tagName]/route.ts
import { NextResponse } from 'next/server';
import { CreateTripDbService } from '../../../services/createTripDbService'

const tripService = new CreateTripDbService()

export async function GET(
  request: Request,
  context: { params: { tagName: string } }
) {
  try {

    const params = await context.params;
    const { tagName } = params;
    const trips = await tripService.getByTag(tagName, true)

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Failed to fetch trips:', error)
    return new Response('Failed to fetch trips', { status: 500 })
  }
}