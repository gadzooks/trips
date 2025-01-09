import crypto from "crypto";
import { CreateTripBody } from "@/types/trip";
import { TABLE_NAME, timestampIsoFormat } from "../common";
import { time } from "console";

export function createTripTransactions(tripData: CreateTripBody, userId: string) {
    const tripId = crypto.randomUUID();
    const timestamp = timestampIsoFormat(new Date()); //.toISOString();

    const commonAttributes = {
        title: tripData.title,
        tripId,
        userId,
        createdAt: timestamp,
        updatedAt: timestamp,
        isDeleted: false,
        isPublic: tripData.isPublic,
    };

    const records = [];

    // We want to store : 
    // 1. The main record for the trip
    // 2. Records for each shared user but only store PK and SK
    // 3. Records for each tag but only store PK and SK
    // This is because if the title / description etc change we dont want to have to update multiple records.

    const baseRecord = {
        //This gives you both timestamp-based sorting on the main table and direct tripId lookup via the GSI.
        PK: `USER#${userId}`,
        SK: `TIMESTAMP#${timestamp}#${tripId}`,
        timestamp,
        ...tripData
    };
 
    // Main record
    records.push(baseRecord);
 
    // Shared records
    // Search for shared users using eq('USER#{userId}') and SK begins_with('SHARED#')
    // to delete shared users, search for PK eq('USER#{userId}') and SK eq('SHARED#{timestamp}#{tripId}')
    (tripData.sharedWith || []).forEach(sharedUserId => {
        records.push({
            // Add these for each shared user
            PK: `USER#${sharedUserId}`,
            SK: `SHARED#${timestamp}#${tripId}`,
            tripId,
            userId,
            timestamp,
        });
    });
 
    let allTags = tripData.tags || [];
    if (tripData.isPublic) {
        allTags.push('PUBLIC');
    }
 
    // Search for tags using eq('TAG#{tag}') and SK begins_with('TIMESTAMP#')
    // to delete tags, search for PK eq('TAG#{tag}') and SK eq('TIMESTAMP#{timestamp}#{tripId}')
    (allTags).forEach(tag => {
        records.push({
            PK: `TAG#${tag}`,
            SK: `TIMESTAMP#${timestamp}#${tripId}`,
            tripId,
            userId,
            timestamp,
        });
    });

    const transactItems = records.map(record => ({
        Put: {
            TableName: TABLE_NAME,
            Item: record
        }
    }));

    return { tripId, transactItems };
}