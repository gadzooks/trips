// src/app/api/trips/route.ts

import { NextResponse } from 'next/server'
import { TripService } from '@/services/tripService'
import { TripDbService } from '@/services/tripDbService'
import { CreateTripBody, ReorderDaysBody, InsertDaysBody, DeleteDaysBody } from '@/types/trip'

const tripService = new TripService(new TripDbService())

export async function POST(request: Request) {
  try {
    const body: CreateTripBody = await request.json()
    const userId = 'test-user' // Replace with session.user.id
    
    const result = await tripService.createTrip(body, userId)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Failed to create trip:', error)
    return new Response('Failed to create trip', { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const userId = 'test-user' // Replace with session.user.id

  try {
    if (action === 'reorder-days') {
      const body: ReorderDaysBody = await request.json()
      await tripService.reorderDays(body, userId)
      return NextResponse.json({ success: true })
    }
    else if (action === 'insert-days') {
      const body: InsertDaysBody = await request.json()
      await tripService.insertDays(body, userId)
      return NextResponse.json({ success: true })
    }
    else if (action === 'delete-days') {
      const body: DeleteDaysBody = await request.json()
      await tripService.deleteDays(body, userId)
      return NextResponse.json({ success: true })
    }

    return new Response('Invalid action', { status: 400 })
  } catch (error) {
    console.error(`Failed to ${action} trip:`, error)
    if (error instanceof Error) {
      return new Response(error.message, { status: 403 })
    }
    return new Response(`Failed to ${action} trip`, { status: 500 })
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
        trip['GSI1-SK']?.startsWith(`TAG#${tag}`)
      )
      return NextResponse.json(taggedTrips)
    }

    return NextResponse.json(trips)
  } catch (error) {
    console.error('Failed to fetch trips:', error)
    return new Response('Failed to fetch trips', { status: 500 })
  }
}