// app/api/trips/[tripId]/comments/route.ts

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { TripPermissionsService } from '@/server/service/tripPermissionsService';
import { CommentsService } from '@/server/service/commentsService';
import { Permission } from '@/types/permissions';

const tripPermissionsService = new TripPermissionsService()


// Get all comments for a trip
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
  
  // Optional query parameters for pagination or filtering
  const url = new URL(request.url)
  const limit = parseInt(url.searchParams.get('limit') || '50')
  const before = url.searchParams.get('before') // timestamp for pagination
  
  const comments = await CommentsService.getTripComments(tripId, { limit, before })
  return NextResponse.json(comments)
}

// Create a new comment
export async function POST(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const session = await auth()
  const tripId = (await params).tripId
  
  // Anyone with read access can comment
  const tripAccessResult = await tripPermissionsService.validateTripAccess(
    Permission.VIEW, 
    tripId, 
    session?.user?.email
  )
  
  if (!tripAccessResult.allowed) {
    return new NextResponse(null, { status: 403 })
  }
  
  const { content, parentCommentId } = await request.json()
  
  if (!content || content.trim() === '') {
    return new NextResponse(
      JSON.stringify({ error: 'Comment content cannot be empty' }), 
      { status: 400 }
    )
  }
  
  // Create the comment
  const comment = await CommentsService.createTripComment({
    tripId,
    userId: session?.user?.email!,
    userName: session?.user?.name || 'Anonymous', // Get name from session
    content,
    parentCommentId,
    isSystem: false // Regular user comment
  })
  
  return NextResponse.json(comment, { status: 201 })
}