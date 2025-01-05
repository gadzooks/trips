import { NextResponse } from 'next/server';
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { stringify } from 'querystring';
import { docClient } from '@/lib/dynamodb';

export async function GET(request, context) {
  try {
    // Await the context to get params
    const params = await context.params;
    const { tripId } = params;

    console.log("PK:" + `TRIP#${tripId}`);
    console.log("SK:" + `METADATA#${tripId}`);

    const command = new QueryCommand({
      TableName: "TripPlanner",
      KeyConditionExpression: "PK = :pk AND SK = :sk",
      ExpressionAttributeValues: {
        ":pk": `TRIP#${tripId}`,
        ":sk": `METADATA#${tripId}`
      }
    });

    console.log("command:" + stringify(command));
    const { Items } = await docClient.send(command);
    const Item = Items[0];
    console.log("in api/trips/[tripId]/route.js");
    console.log(Item);
    
    if (!Item) {
      return NextResponse.json(
        { error: 'Trip not found' },
        { status: 404 }
      );
    }
    return NextResponse.json(Item);
  } catch (error) {
    console.error('Error fetching trip:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}