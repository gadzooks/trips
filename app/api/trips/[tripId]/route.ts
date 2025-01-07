import { PutCommand, QueryCommand, UpdateCommand, GetCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { NextResponse } from 'next/server'
import { docClient } from '@/lib/dynamodb'

// GET single trip
export async function GET(
  request: Request,
  context: { params: { tripId: string } }
) {
  const params = await context.params;
  const { tripId } = params;

  try {
    const result = await docClient.send(new GetCommand({
      TableName: 'TripPlanner',
      Key: {
        PK: `TRIP#${tripId}`,
        SK: `METADATA#${tripId}`
      }
    }))

    if (!result.Item) {
      return new Response('Trip not found', { status: 404 })
    }

    return NextResponse.json(result.Item)
  } catch (error) {
    console.error('Failed to fetch trip:', error)
    return new Response('Failed to fetch trip', { status: 500 })
  }
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
    // First get the current trip to check if public status changed
    const currentTrip = await docClient.send(new GetCommand({
      TableName: 'TripPlanner',
      Key: {
        PK: `TRIP#${tripId}`,
        SK: `METADATA#${tripId}`
      }
    }))

    // Build update expression and attribute values
    let updateExpression = 'SET updatedAt = :updatedAt'
    const expressionAttributeValues: any = {
      ':updatedAt': new Date().toISOString()
    }
    let expressionAttributeNames: Record<string, string> | undefined

    // Handle each possible field
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
    if (body.rows !== undefined) {
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