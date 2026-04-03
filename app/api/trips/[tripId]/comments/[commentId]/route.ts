// app/api/trips/[tripId]/comments/[commentId]/route.ts

import { NextResponse } from 'next/server'
import { auth } from '@/auth'
import { TripPermissionsService } from '@/server/service/tripPermissionsService';
import { CommentsService } from '@/server/service/commentsService';
import { Permission } from '@/types/permissions';

const tripPermissionsService = new TripPermissionsService()

// Update a comment
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string, commentId: string }> }
) {
  const session = await auth()
  const { tripId, commentId } = await params
  
  // Fetch the comment first to check ownership
  const comment = await CommentsService.getTripComment(tripId, commentId)
  
  if (!comment) {
    return new NextResponse(null, { status: 404 })
  }
  
  // Users can only edit their own comments
  const isOwnComment = comment.userId === session?.user?.email
  const requiredAccess = isOwnComment ? Permission.EDIT : Permission.VIEW
  
  const tripAccessResult = await tripPermissionsService.validateTripAccess(
    requiredAccess, 
    tripId, 
    session?.user?.email
  )
  
  if (!tripAccessResult.allowed) {
    return new NextResponse(null, { status: 403 })
  }
  
  const { content } = await request.json()
  
  if (!content || content.trim() === '') {
    return new NextResponse(
      JSON.stringify({ error: 'Comment content cannot be empty' }), 
      { status: 400 }
    )
  }
  
  // Update the comment
  const updatedComment = await CommentsService.updateTripComment(
    tripId,
    commentId,
    { content }
  )
  
  return NextResponse.json(updatedComment)
}

// Delete a comment
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string, commentId: string }> }
) {
  const session = await auth()
  const { tripId, commentId } = await params
  
  // Fetch the comment first to check ownership
  const comment = await CommentsService.getTripComment(tripId, commentId)
  
  if (!comment) {
    return new NextResponse(null, { status: 404 })
  }
  
  // Users can only delete their own comments, unless they're the trip owner
  const isOwnComment = comment.userId === session?.user?.email
  // Only trip owners can delete comments
  if (!isOwnComment) {
    return new NextResponse(null, { status: 403 })
  }

  // in futher we may give other users the ability to delete comments, so we still check the trip access
  const requiredAccess = Permission.DELETE;
  
  const tripAccessResult = await tripPermissionsService.validateTripAccess(
    requiredAccess, 
    tripId, 
    session?.user?.email
  )
  
  if (!tripAccessResult.allowed) {
    return new NextResponse(null, { status: 403 })
  }
  
  // Delete the comment
  await CommentsService.deleteTripComment(tripId, commentId)
  
  return new NextResponse(null, { status: 204 })
}