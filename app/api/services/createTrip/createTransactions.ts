import crypto from "crypto";
import { CreateTripBody } from "@/types/trip";
import { TABLE_NAME, timestampIsoFormat } from "../common";

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

    const commonKeys = {
        //This gives you both timestamp-based sorting on the main table and direct tripId lookup via the GSI.
        PK: `USER#${userId}`,
        SK: `TIMESTAMP#${timestamp}#${tripId}`,
    }

    const baseRecord = {
        GSI1PK: `USER#${userId}`,
        GSI1SK: `TRIP#${tripId}`,
        ...tripData
    };
 
    // Main record
    records.push(baseRecord);
 
    // Shared records
    (tripData.sharedWith || []).forEach(sharedUserId => {
        records.push({
            ...commonKeys,
            // Add these for each shared user
            GSI2PK: `USER#${sharedUserId}`,
            GSI2SK: `SHARED#${timestamp}#${tripId}`,
            tripId,
            userId,
        });
    });
 
    let tags = tripData.tags || [];
    if (tripData.isPublic) {
        tags.push('PUBLIC');
    }
 
    (tripData.tags || []).forEach(tag => {
        records.push({
            ...commonKeys,
            GSI3PK: `USER#${userId}`,
            GSI3SK: `TAG#${tag}#${timestamp}#${tripId}`,
            tripId,
            userId,
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