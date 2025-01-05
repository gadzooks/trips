// app/api/trips/public/route.js
import { NextResponse } from 'next/server';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({
  region: process.env.NEXT_PUBLIC_AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

const dynamoDB = DynamoDBDocumentClient.from(client);

// GET /trips/public
export async function GET() {
  try {
    const command = new ScanCommand({
      TableName: "TripPlanner",
      FilterExpression: "isPublic = :isPublic",
      ExpressionAttributeValues: {
        ":isPublic": true
      }
    });

    const { Items } = await dynamoDB.send(command);
    return NextResponse.json(Items);
  } catch (error) {
    console.error('Error fetching public trips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public trips' },
      { status: 500 }
    );
  }
}