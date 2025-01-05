// app/api/trips/public/route.js
import { NextResponse } from 'next/server';
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient } from '@/lib/dynamodb';

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

    const { Items } = await docClient.send(command);
    return NextResponse.json(Items);
  } catch (error) {
    console.error('Error fetching public trips:', error);
    return NextResponse.json(
      { error: 'Failed to fetch public trips' },
      { status: 500 }
    );
  }
}