// app/api/trips/tags/[tagName]/route.ts
import { NextResponse } from 'next/server';
import { CreateTripDbService } from '../../../../../server/service/createTripDbService'

const tripService = new CreateTripDbService()

export async function GET(
  request: Request,
  { params }: { params: Promise<{ tagName: string }> }
) {
  const tagName = (await params).tagName
  try {

    const trips = await tripService.getByTag(tagName, true)

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Failed to fetch trips:', error)
    return new Response('Failed to fetch trips', { status: 500 })
  }
}