// app/api/trips/[tripId]/route.ts
import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { NextResponse } from 'next/server'
import { docClient } from '@/lib/dynamodb'
import { CreateTripDbService } from '../../services/createTripDbService';

const tripService = new CreateTripDbService()

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

// Update trip
export async function PATCH(
  request: Request,
  context: { params: { tripId: string } }
) {
  try {
    const params = await context.params;
    const { tripId } = params;
    const body = await request.json();
    console.log(`Updating trip ${tripId} with:`, body);
    
    // Validate request body
    if (!body.attributeKey || body.attributeValue === undefined) {
      return NextResponse.json(
        { error: "Missing attributeKey or attributeValue" },
        { status: 400 }
      );
    }

    // Create the update expression and attribute values
    const { updateExpression, expressionAttributeValues, expressionAttributeNames } = 
      buildUpdateExpression(body.attributeKey, body.attributeValue);

    const updateCommand = {
      TableName: process.env.TRIPS_TABLE_NAME,
      Key: {
        PK: `TRIP#${tripId}`
      },
      UpdateExpression: updateExpression,
      ExpressionAttributeValues: expressionAttributeValues,
      ExpressionAttributeNames: expressionAttributeNames,
      ConditionExpression: "attribute_exists(PK)",
      ReturnValues: "ALL_NEW"
    };

    const result = await docClient.send(new UpdateCommand(updateCommand));
    
    return NextResponse.json({
      success: true,
      updatedTrip: result.Attributes
    });

  } catch (error) {
    console.error('Failed to update trip:', error);
    if ((error as any).name === 'ConditionalCheckFailedException') {
      return NextResponse.json(
        { error: "Trip not found" },
        { status: 404 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update trip" },
      { status: 500 }
    );
  }
}

// Helper function to build the update expression
function buildUpdateExpression(
  attributeKey: string,
  attributeValue: any
): {
  updateExpression: string;
  expressionAttributeValues: Record<string, any>;
  expressionAttributeNames: Record<string, string>;
} {
  // Validate that attributeKey is a valid property of TripRecord
  const validTopLevelKeys = [
    'name', 'description', 'isPublic', 'sharedWith',
    'tags', 'days'
  ];

  if (!validTopLevelKeys.includes(attributeKey)) {
    throw new Error(`Invalid attribute key: ${attributeKey}`);
  }

  // Special handling for arrays and complex types
  if (attributeKey === 'days') {
    // Validate days array structure
    if (!Array.isArray(attributeValue) || !validateDaysArray(attributeValue)) {
      throw new Error('Invalid days array structure');
    }
  }

  if (attributeKey === 'sharedWith' || attributeKey === 'tags') {
    // Validate array input
    if (!Array.isArray(attributeValue)) {
      throw new Error(`${attributeKey} must be an array`);
    }
  }

  return {
    updateExpression: `SET #${attributeKey} = :${attributeKey}`,
    expressionAttributeValues: {
      [`:${attributeKey}`]: attributeValue
    },
    expressionAttributeNames: {
      [`#${attributeKey}`]: attributeKey
    }
  };
}

// Helper function to validate days array structure
function validateDaysArray(days: any[]): boolean {
  return days.every(day => {
    return (
      typeof day.date === 'string' &&
      typeof day.itinerary === 'string' &&
      typeof day.reservations === 'string' &&
      typeof day.lodging === 'string' &&
      typeof day.driveTimes === 'string' &&
      typeof day.notes === 'string'
    );
  });
}

// Delete trip
export async function DELETE(
  request: Request,
  context: { params: { tripId: string } }
) {
  const params = await context.params;
  const { tripId } = params;

  try {
    throw new Error('DELETE Not implemented')
    // await docClient.send(new DeleteCommand({
    //   TableName: 'TripPlanner',
    //   Key: {
    //     PK: `TRIP#${tripId}`,
    //     SK: `METADATA#${tripId}`
    //   }
    // }))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete trip:', error)
    return new Response('Failed to delete trip', { status: 500 })
  }
}