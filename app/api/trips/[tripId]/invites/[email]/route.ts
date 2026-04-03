// app/api/trips/[tripId]/invites/[email]/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth';
import { TripPermissionsService } from '@/server/service/tripPermissionsService';
import { InviteService } from '@/server/service/inviteService';
import { Permission } from '@/types/permissions';
import { TripServiceError } from '@/types/errors';
import { InviteStatus } from '@/types/invitation';

const tripPermissionsService = new TripPermissionsService()
const inviteService = new InviteService()

// Update an invite (e.g., accept/decline)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string, email: string }> }
) {
  try {
    const session = await auth()
    const { tripId, email: encodedEmail } = await params
    const email = decodeURIComponent(encodedEmail)

    if (!session?.user?.email) {
      return new NextResponse(null, { status: 401 })
    }

    // Anyone can update their own invite status; only owner can update others
    const isOwnInvite = session.user.email === email
    const requiredAccess = isOwnInvite ? Permission.RSVP : Permission.INVITE

    const tripAccessResult = await tripPermissionsService.validateTripAccess(
      requiredAccess,
      tripId,
      session.user.email
    )

    if (!tripAccessResult.allowed) {
      return new NextResponse(null, { status: 403 })
    }

    const { status } = await request.json()

    const updatedInvite = await inviteService.updateTripInvite(
      tripId,
      email,
      status as InviteStatus,
      session.user.email
    )

    return NextResponse.json(updatedInvite)
  } catch (error) {
    if (error instanceof TripServiceError) {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: error.statusCode }
      )
    }
    console.error('Failed to update invite:', error)
    return NextResponse.json({ message: 'Failed to update invite' }, { status: 500 })
  }
}

// Delete an invite
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string, email: string }> }
) {
  try {
    const session = await auth()
    const { tripId, email: encodedEmail } = await params
    const email = decodeURIComponent(encodedEmail)

    if (!session?.user?.email) {
      return new NextResponse(null, { status: 401 })
    }

    const tripAccessResult = await tripPermissionsService.validateTripAccess(
      Permission.INVITE,
      tripId,
      session.user.email
    )

    if (!tripAccessResult.allowed) {
      return new NextResponse(null, { status: 403 })
    }

    await inviteService.deleteTripInvite(tripId, email)

    return new NextResponse(null, { status: 204 })
  } catch (error) {
    if (error instanceof TripServiceError) {
      return NextResponse.json(
        { message: error.message, code: error.code },
        { status: error.statusCode }
      )
    }
    console.error('Failed to delete invite:', error)
    return NextResponse.json({ message: 'Failed to delete invite' }, { status: 500 })
  }
}
