import { UpdateCommand, GetCommand } from '@aws-sdk/lib-dynamodb'
import { NextResponse } from 'next/server'
import { docClient } from '@/lib/dynamodb'

export async function PATCH(
  request: Request,
  context: { params: { tripId: string; rowId: string } }
) {
  const params = await context.params;
  const { tripId, rowId } = params;
  const body = await request.json()

  try {
    // First get the current trip
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
      if (row.id === rowId) {
        return { ...row, ...body }
      }
      return row
    })

    // Sort rows by day and time
    updatedRows.sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      if (!a.time) return -1;
      if (!b.time) return 1;
      return a.time.localeCompare(b.time);
    });

    // Update the trip with the modified rows
    await docClient.send(new UpdateCommand({
      TableName: 'TripPlanner',
      Key: {
        PK: `TRIP#${tripId}`,
        SK: `METADATA#${tripId}`
      },
      UpdateExpression: 'SET #rowsAttr = :rows, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#rowsAttr': 'rows'
      },
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

export async function DELETE(
  request: Request,
  context: { params: { tripId: string; rowId: string } }
) {
  const params = await context.params;
  const { tripId, rowId } = params;

  try {
    // First get the current trip
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

    // Filter out the row to be deleted
    const updatedRows = result.Item.rows.filter((row: any) => row.id !== rowId)

    // Update the trip with the filtered rows
    await docClient.send(new UpdateCommand({
      TableName: 'TripPlanner',
      Key: {
        PK: `TRIP#${tripId}`,
        SK: `METADATA#${tripId}`
      },
      UpdateExpression: 'SET #rowsAttr = :rows, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#rowsAttr': 'rows'
      },
      ExpressionAttributeValues: {
        ':rows': updatedRows,
        ':updatedAt': new Date().toISOString()
      }
    }))

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Failed to delete row:', error)
    return new Response('Failed to delete row', { status: 500 })
  }
}