import { TripRecordDTO } from "@/types/trip";
import { TABLE_NAME, timestampIsoFormat } from "../common";
import { ulid } from 'ulid'

export function queryByTripId(tripId: string) {
    return {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
            ':pk': getTripIdPk(tripId)
        },
        Limit: 1
    }
}

export function createTripTransactions(tripData: TripRecordDTO, userId: string) {
    // lexically sortable UUID
    const tripId = ulid()
    const timestamp = timestampIsoFormat(new Date()); //.toISOString();

    const records = [];

    // We want to store : 
    // 1. The main record : PK = TRIP#{tripId} - store all attributes here
    // 2. Trip for owner : PK = CREATEDBY#{userId} SK = TRIP#{tripId} -- store PK, SK, name, maybe desc
    // 3. For each tag : PK = TAG#{tag} SK = TRIP#{tripId} -- store PK, SK, name, maybe desc
    // 4. For each shared user : PK = SHAREDWITH#{userId} SK = TRIP#{tripId} -- store PK, SK, name, maybe desc
    // 5. For public trips : PK = PUBLIC#TRIP#{tripId} -- store PK, SK, name, maybe desc

    // When showing trips for each user or each tag or public trips or shared with a user,
    // we will only show titile, maybe desc. User will need to click to pull the full trip details by tripId

    const baseRecord = {
        //PK is ulid so its unique and lexically sortable
        PK: getTripIdPk(tripId),
        //SK is timestamp and can be used in range queries
        SK: timestamp,
        ...tripData
    };
 
    // Main record
    records.push(baseRecord);
 
    const partialTripDetails = {
        name: tripData.name,
        description: tripData.description,
        isPublic: tripData.isPublic,
        timestamp
    };
 
    // Owner record
    records.push({
        PK: getOwnerWithDbPK(userId),
        SK: tripId,
        ...partialTripDetails
    });
 
    // Shared records
    // Search for shared users using eq('SHAREDWITH#{userId}') 
    // to delete shared users, search for PK eq('USER#{userId}') and SK eq(tripId)
    (tripData.sharedWith || []).forEach(sharedUserId => {
        records.push({
            // Add these for each shared user
            PK: getSharedWithDbPK(sharedUserId),
            SK: tripId,
            ...partialTripDetails
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
            PK: getTagDbPK(tag),
            SK: tripId,
            ...partialTripDetails,
        });
    });

    const transactItems = records.map(record => ({
        Put: {
            TableName: TABLE_NAME,
            Item: record
        }
    }));

    return { tripId, userId, timestamp, transactItems };
}

function getTripIdPk(tripId: string) {
    return `TRIP#${tripId}`;
}

function getSharedWithDbPK(sharedUserId: string) {
    return `SHAREDWITH#${sharedUserId}`;
}

function getTagDbPK(tag: string) {
    return `TAG#${tag}`;
}

function getOwnerWithDbPK(userId: string) {
    return `CREATEDBY#${userId}`;
}
