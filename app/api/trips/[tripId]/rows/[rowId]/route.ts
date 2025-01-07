// app/api/trips/[tripId]/rows/[rowId]/route.ts
import { UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { NextResponse } from 'next/server'
import { docClient } from '@/lib/dynamodb'

export async function PATCH(
  request: Request,
  { params }: { params: { tripId: string; rowId: string } }
) {
  // const session = await auth()
  // if (!session?.user) {
  //   return new Response('Unauthorized', { status: 401 })
  // }

  const body = await request.json()
  const { tripId } = params

  try {
    // Get current trip data
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

    // Update the specific row
    const updatedRows = result.Item.rows.map((row: any) => {
      if (row.id === params.rowId) {
        return { ...row, ...body }
      }
      return row
    })

    // Update the trip with the modified rows
    await docClient.send(new UpdateCommand({
      TableName: 'TripPlanner',
      Key: {
        PK: `TRIP#${tripId}`,
        SK: `METADATA#${tripId}`
      },
      UpdateExpression: 'SET rows = :rows, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':rows': updatedRows,
        ':updatedAt': new Date().toISOString()
      }
    }))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to update row:', error)
    return new Response('Failed to update row', { status: 500 })
  }
}