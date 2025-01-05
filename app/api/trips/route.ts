// import { auth } from '@/auth'
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { NextResponse } from 'next/server'

const client = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
  },
  region: process.env.AWS_REGION
})

const docClient = DynamoDBDocumentClient.from(client)

export async function POST(request: Request) {
//   const session = await auth()
//   if (!session?.user) {
//     return new Response('Unauthorized', { status: 401 })
//   }

  const body = await request.json()
  const tripId = crypto.randomUUID()

  try {
    await docClient.send(new PutCommand({
      TableName: 'TripPlanner',
      Item: {
        PK: `TRIP#${tripId}`,
        SK: `METADATA#${tripId}`,
        tripId,
        name: body.name,
        description: body.description,
        // userId: session.user.id,
        isPublic: body.isPublic,
        rows: body.rows,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        // GSI1PK: `USER#${session.user.id}`,
        GSI1SK: `TRIP#${tripId}`,
        ...(body.isPublic && {
          GSI2PK: 'PUBLIC',
          GSI2SK: `TRIP#${tripId}`
        })
      }
    }))

    return NextResponse.json({ tripId })
  } catch (error) {
    console.error('Failed to create trip:', error)
    return new Response('Failed to create trip', { status: 500 })
  }
}

export async function GET() {
//   const session = await auth()
//   if (!session?.user) {
//     return new Response('Unauthorized', { status: 401 })
//   }

  try {
    const result = await docClient.send(new QueryCommand({
      TableName: 'TripPlanner',
      IndexName: 'UserTrips',
      KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
      ExpressionAttributeValues: {
        // ':pk': `USER#${session.user.id}`,
        ':sk': 'TRIP#'
      }
    }))

    return NextResponse.json(result.Items)
  } catch (error) {
    console.error('Failed to fetch trips:', error)
    return new Response('Failed to fetch trips', { status: 500 })
  }
}