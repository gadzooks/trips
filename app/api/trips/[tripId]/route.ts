// app/api/trips/[tripId]/route.ts
import { DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { NextResponse } from 'next/server'
import { docClient } from '@/lib/dynamodb'
import { CreateTripDbService } from '../../services/createTripDbService';

const tripService = new CreateTripDbService()

// get trip by tripId
// get trip by userId
// get trips shared with user
// get public trips - GSI on isPublic, 
// get trips by tag
// search trips by description
// search public trips by description


// GET single trip
export async function GET(
  request: Request,
  context: { params: { tripId: string } }
) {
  const params = await context.params;
  const { tripId } = params;

  try {
    const result = await tripService.getTripById(tripId)
    if (!result) {
      return new Response('Trip not found', { status: 404 })
    }

    return NextResponse.json({ ...result })
  } catch (error) {
    console.error('Failed to fetch trip:', error)
    return new Response('Failed to fetch trip', { status: 500 })
  }
}

interface ItineraryRow {
  id: string;
  day: number;
  time?: string;
  activity: string;
  location?: string;
  notes?: string;
}

interface ItineraryUpdate {
  added?: ItineraryRow[];
  updated?: ItineraryRow[];
  deleted?: string[];  // Array of row IDs to delete
}

// Update trip
export async function PATCH(
  request: Request,
  context: { params: { tripId: string } }
) {
  const params = await context.params;
  const { tripId } = params;
  const body = await request.json()

    // await docClient.send(new UpdateCommand(updateCommand))

    return NextResponse.json({ success: true })
  // } catch (error) {
  //   console.error('Failed to update trip:', error)
  //   return new Response('Failed to update trip', { status: 500 })
  // }
}

// Delete trip
export async function DELETE(
  request: Request,
  context: { params: { tripId: string } }
) {
  const params = await context.params;
  const { tripId } = params;

  try {
    await docClient.send(new DeleteCommand({
      TableName: 'TripPlanner',
      Key: {
        PK: `TRIP#${tripId}`,
        SK: `METADATA#${tripId}`
      }
    }))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete trip:', error)
    return new Response('Failed to delete trip', { status: 500 })
  }
}