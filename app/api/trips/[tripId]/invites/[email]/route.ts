// app/api/trips/[tripId]/invites/[email]/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth';
import { TripPermissionsService } from '@/server/service/tripPermissionsService';
import { InviteService } from '@/server/service/inviteService';
import { Permission } from '@/types/permissions';

const tripPermissionsService = new TripPermissionsService()
const inviteService = new InviteService()

// Update an invite (e.g., accept/decline)
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string, email: string }> }
) {
  const session = await auth()
  const { tripId, email } = await params
  
  // Anyone can update their own invite status, but only owner can update others
  const isOwnInvite = session?.user?.email === email
  const requiredAccess = isOwnInvite ? Permission.RSVP : Permission.INVITE
  
  const tripAccessResult = await tripPermissionsService.validateTripAccess(
    requiredAccess, 
    tripId, 
    session?.user?.email
  )
  
  if (!tripAccessResult.allowed) {
    return new NextResponse(null, { status: 403 })
  }

  if (!session?.user?.email) {
    return new NextResponse("email is required", { status: 403 })
  }
  
  const { status } = await request.json()
  
  // Update the invite
  const updatedInvite = await inviteService.updateTripInvite(
    tripId, 
    email, 
    status,
    session?.user?.email
  )
  
  return NextResponse.json(updatedInvite)
}

// Delete an invite
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string, email: string }> }
) {
  const session = await auth()
  const { tripId, email } = await params
  
  // Only owner can delete invites
  const tripAccessResult = await tripPermissionsService.validateTripAccess(
    Permission.INVITE,
    tripId, 
    session?.user?.email
  )
  
  if (!tripAccessResult.allowed) {
    return new NextResponse(null, { status: 403 })
  }
  
  await inviteService.deleteTripInvite(tripId, email)
  
  return new NextResponse(null, { status: 204 })
}