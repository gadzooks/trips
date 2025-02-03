// app/api/services/createTrip/createTransactions.ts

import { getOwnerWithDbPK, getTagDbPK } from "./dbKeys";

export function queryByTripId(tripId: string) {
    return {
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
            ':pk': getTripIdPk(tripId)
        },
        Limit: 1
    }
}

export function queryByTag(tag: string, isPublic: boolean, limit: number = 10) {
    return {
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
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
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
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
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
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


export function extractTagsFromTripData(tags: string | string[] | undefined): string[] {
    let allTags: string[] = [];
    if (typeof tags === 'string') {
        allTags = tags.split(' ').map(tag => tag.trim());
    } else if (Array.isArray(tags)) {
        allTags = tags;
    }
    return uniqueStrings(allTags);
}

function uniqueStrings(arr: string[]): string[] {
    return [...new Set(arr.filter(str => str.trim().length > 0))];
}

export function getTripIdPrefix() {
    return 'TRIP#';
}

export function getTripIdPk(tripId: string) {
    return `${getTripIdPrefix()}${tripId}`;
}