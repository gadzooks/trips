// app/api/trips/[tripId]/invites/route.ts
import { NextResponse } from 'next/server'
import { auth } from '@/auth';
import { TripPermissionsService } from '@/server/service/tripPermissionsService';
import { InviteService } from '@/server/service/inviteService';
import { Permission } from '@/types/permissions';

const tripPermissionsService = new TripPermissionsService()
const inviteService = new InviteService()

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

// Create a new invite
export async function POST(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
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
  
  if (session?.user?.email === undefined || session.user.email === null) {
    return new NextResponse("email is required", { status: 403 })
  }
  
  const { email, name } = await request.json()
  
  // Create the invite
  const invite = await inviteService.createTripInvite(
    tripId, 
    email, 
    name, 
    session?.user?.email
  )
  
  return NextResponse.json(invite, { status: 201 })
}