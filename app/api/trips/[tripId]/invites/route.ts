// app/api/trips/[tripId]/invites/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth';
import { TripPermissionsService } from '@/server/service/tripPermissionsService';
import { InviteService } from '@/server/service/inviteService';
import { CreateTripDbService } from '@/server/service/createTripDbService';
import { Permission } from '@/types/permissions';
import { TripServiceError } from '@/types/errors';

const tripPermissionsService = new TripPermissionsService()
const inviteService = new InviteService()
const tripService = new CreateTripDbService()

// Get all invites for a trip
export async function GET(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const session = await auth()
  const tripId = (await params).tripId
  const tripAccessResult = await tripPermissionsService.validateTripAccess(
    Permission.VIEW,
    tripId,
    session?.user?.email
  )

  if (!tripAccessResult.allowed) {
    return new NextResponse(null, { status: 403 })
  }

  const invites = await inviteService.getTripInvites(tripId)
  return NextResponse.json(invites)
}

// Create new invite(s)
export async function POST(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  try {
    const session = await auth()
    const tripId = (await params).tripId

    // Only trip owners can invite people
    const tripAccessResult = await tripPermissionsService.validateTripAccess(
      Permission.INVITE,
      tripId,
      session?.user?.email
    )

    if (!tripAccessResult.allowed) {
      return new NextResponse(null, { status: 403 })
    }

    if (!session?.user?.email) {
      return new NextResponse("email is required", { status: 403 })
    }

    const { emails } = await request.json()

    if (!Array.isArray(emails) || emails.length === 0) {
      return NextResponse.json({ message: 'emails array is required' }, { status: 400 })
    }

    const trip = await tripService.getTripById(tripId)
    if (!trip) {
      return NextResponse.json({ message: 'Trip not found' }, { status: 404 })
    }

    const tripMetadata = {
      name: trip.name,
      createdAt: trip.SK ?? trip.createdAt ?? '',
      createdBy: trip.createdBy ?? '',
    }

    const results = []
    for (const email of emails) {
      try {
        const invite = await inviteService.createTripInvite(
          tripId,
          email,
          session.user.email,
          tripMetadata
        )
        results.push(invite)
      } catch (error) {
        if (error instanceof TripServiceError) {
          // Skip duplicate invites silently; re-throw other service errors
          if (error.code !== 'DUPLICATE_INVITE') throw error
        } else {
          throw error
        }
      }
    }

    return NextResponse.json(results, { status: 201 })
  } catch (error) {
    if (error instanceof TripServiceError) {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: error.statusCode }
      )
    }
    console.error('Failed to create invite:', error)
    return NextResponse.json({ message: 'Failed to create invite' }, { status: 500 })
  }
}
