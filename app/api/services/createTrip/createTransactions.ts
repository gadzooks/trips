// app/api/services/createTrip/createTransactions.ts
import { MinimumTripRecord, TripRecordDTO } from "@/types/trip";
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

export function queryByTag(tag: string, isPublic: boolean, limit: number = 10) {
    return {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
            ':pk': getTagDbPK(tag, isPublic)
        },
        ProjectionExpression: 'tripId, #name, isPublic, createdAt, createdBy',
        ExpressionAttributeNames: {
            '#name': 'name'  // 'name' is a reserved word in DynamoDB
        },
        Limit: limit,
        ScanIndexForward: false  // Set to false for descending order
    }
}

export function queryByCreatedBy(createdBy: string, limit: number = 10) {
    return {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
            ':pk': getOwnerWithDbPK(createdBy)
        },
        ProjectionExpression: 'tripId, #name, isPublic, createdAt, createdBy',
        ExpressionAttributeNames: {
            '#name': 'name'  // 'name' is a reserved word in DynamoDB
        },
        Limit: limit,
        ScanIndexForward: false  // Set to false for descending order
    }
}

export function queryByTagPaginated(tag: string, isPublic: boolean, limit: number = 10, exclusiveStartKey?: Record<string, any>) {
    return {
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
            ':pk': getTagDbPK(tag, isPublic)
        },
        ProjectionExpression: 'tripId, #name, isPublic, createdAt, createdBy',
        ExpressionAttributeNames: {
            '#name': 'name'  // 'name' is a reserved word in DynamoDB
        },
        Limit: limit,
        ScanIndexForward: false,
        ExclusiveStartKey: exclusiveStartKey
    }
}

export function createTripTransactions(tripData: TripRecordDTO, userId: string): CreateTripTransactionsResult {
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

    // Main record with all the details
    records.push(
        {
            //PK is ulid so its unique and lexically sortable
            PK: getTripIdPk(tripId),
            //SK is timestamp and can be used in range queries
            SK: timestamp,
            createdAt: timestamp,
            createdBy: userId,
            ...tripData
        }
    );
 
    const partialTripDetails: MinimumTripRecord = {
        tripId,
        name: tripData.name,
        // description: tripData.description, // will be too huge to store in shared records
        isPublic: tripData.isPublic,
        createdAt: timestamp,
        createdBy: userId,
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
            PK: getTagDbPK(tag, tripData.isPublic),
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


export interface CreateTripTransactionsResult {
    tripId: string;
    userId: string;
    timestamp: string;
    transactItems: any[]; //FIXME add type
}

function getTripIdPk(tripId: string) {
    return `TRIP#${tripId}`;
}

function getSharedWithDbPK(sharedUserId: string) {
    return `SHAREDWITH#${sharedUserId}`;
}

function getTagDbPK(tag: string, isPublic: boolean) {
    if (tag === 'PUBLIC') {
        return `TAG#PUBLIC`;
    }
    return isPublic ? `TAG#PUBLIC#${tag}` : `TAG#PRIVATE#${tag}`;
}

function getOwnerWithDbPK(userId: string) {
    return `CREATEDBY#${userId}`;
}
