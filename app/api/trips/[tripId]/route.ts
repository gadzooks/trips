import { UpdateCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { NextResponse } from 'next/server'
import { docClient } from '@/lib/dynamodb'
import { CreateTripDbService } from '../../services/createTripDbService';
import { TripIdentifier } from '@/types/trip';

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
  context: { params: { tripId: TripIdentifier } }
) {
  const params = await context.params;
  const { tripId } = params;

  try {
    const result = await tripService.getTripByOwnerTripIdTimestamp(tripId)
    if (!result) {
      return new Response('Trip not found', { status: 404 })
    }

    return NextResponse.json({ trip: result })
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

  try {
    // First get the current trip to check if public status changed and get current rows
    const currentTrip = await docClient.send(new GetCommand({
      TableName: 'TripPlanner',
      Key: {
        PK: `TRIP#${tripId}`,
        SK: `METADATA#${tripId}`
      }
    }))

    if (!currentTrip.Item) {
      return new Response('Trip not found', { status: 404 })
    }

    // Build update expression and attribute values
    let updateExpression = 'SET updatedAt = :updatedAt'
    const expressionAttributeValues: any = {
      ':updatedAt': new Date().toISOString()
    }
    let expressionAttributeNames: Record<string, string> | undefined

    // Handle basic fields
    if (body.name !== undefined) {
      updateExpression += ', #name = :name'
      expressionAttributeValues[':name'] = body.name
      expressionAttributeNames = expressionAttributeNames || {}
      expressionAttributeNames['#name'] = 'name'
    }
    if (body.description !== undefined) {
      updateExpression += ', description = :description'
      expressionAttributeValues[':description'] = body.description
    }
    if (body.isPublic !== undefined) {
      updateExpression += ', isPublic = :isPublic'
      expressionAttributeValues[':isPublic'] = body.isPublic
    }

    // Handle itinerary updates
    if (body.itinerary) {
      const itineraryUpdate: ItineraryUpdate = body.itinerary;
      let updatedRows = [...(currentTrip.Item.rows || [])];

      // Handle deletions
      if (itineraryUpdate.deleted && itineraryUpdate.deleted.length > 0) {
        updatedRows = updatedRows.filter(row => !itineraryUpdate.deleted?.includes(row.id));
      }

      // Handle updates
      if (itineraryUpdate.updated && itineraryUpdate.updated.length > 0) {
        itineraryUpdate.updated.forEach(updatedRow => {
          const index = updatedRows.findIndex(row => row.id === updatedRow.id);
          if (index !== -1) {
            updatedRows[index] = {
              ...updatedRows[index],
              ...updatedRow,
            };
          }
        });
      }

      // Handle additions
      if (itineraryUpdate.added && itineraryUpdate.added.length > 0) {
        updatedRows = [...updatedRows, ...itineraryUpdate.added];
      }

      // Sort rows by day and time
      updatedRows.sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day;
        if (!a.time) return -1;
        if (!b.time) return 1;
        return a.time.localeCompare(b.time);
      });

      updateExpression += ', rows = :rows'
      expressionAttributeValues[':rows'] = updatedRows;
    } else if (body.rows !== undefined) {
      // Maintain backward compatibility with direct rows update
      updateExpression += ', rows = :rows'
      expressionAttributeValues[':rows'] = body.rows
    }

    // Handle public/private status change
    if (body.isPublic !== undefined && body.isPublic !== currentTrip.Item?.isPublic) {
      if (body.isPublic) {
        updateExpression += ', GSI2PK = :gsi2pk, GSI2SK = :gsi2sk'
        expressionAttributeValues[':gsi2pk'] = 'PUBLIC'
        expressionAttributeValues[':gsi2sk'] = `TRIP#${tripId}`
      } else {
        updateExpression += ' REMOVE GSI2PK, GSI2SK'
      }
    }

    // Construct the update command
    const updateCommand: any = {
      TableName: 'TripPlanner',
      Key: {
        PK: `TRIP#${tripId}`,
        SK: `METADATA#${tripId}`
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues
    }

    // Only add ExpressionAttributeNames if we have any
    if (expressionAttributeNames) {
      updateCommand.ExpressionAttributeNames = expressionAttributeNames
    }

    await docClient.send(new UpdateCommand(updateCommand))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update trip:', error)
    return new Response('Failed to update trip', { status: 500 })
  }
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