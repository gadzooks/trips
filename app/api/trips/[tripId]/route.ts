// app/api/trips/[tripId]/route.ts
import { NextResponse } from 'next/server'
import { CreateTripDbService } from '../../services/createTripDbService';
import { TripVisibilityService } from '../../services/tripVisibilityService';
import { UpdateTripAttributeRequest } from '@/app/components/ui/utils/updateTrip';

const createTripDbService = new CreateTripDbService()
const tripVisibilityService = new TripVisibilityService()

// GET single trip
export async function GET(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const tripId = (await params).tripId

  try {
    const result = await createTripDbService.getTripById(tripId)
    if (!result) {
      return new Response('Trip not found', { status: 404 })
    }

    return NextResponse.json({ ...result })
  } catch (error) {
    console.error('Failed to fetch trip:', error)
    return new NextResponse('Failed to fetch trip', { status: 500 })
  }
}

// Update trip
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const tripId = (await params).tripId
  try {
    const body = await request.json() as UpdateTripAttributeRequest;
    // console.log(`Updating trip ${tripId} with:`, body);
    
    // Validate request body
    if (!body.attributeKey || body.attributeValue === undefined || body.attributeKey === null ) {
      return NextResponse.json(
        { error: "Missing attributeKey or attributeValue" },
        { status: 400 }
      );
    }

    await tripVisibilityService.updateTripAtributes(body)
    return NextResponse.json({
      success: true,
      updatedTrip: body.attributeValue
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

// Delete trip
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ tripId: string }> }
) {
  const tripId = (await params).tripId

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