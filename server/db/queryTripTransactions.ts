// server/db/queryTripTransactions.ts

import { getOwnerWithDbPK, getTagDbPK, getTripIdPk, getInviteesDbPK } from "./dbKeys";

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

export interface TripPermissionsDTO {
    tripId: string
    isPublic: boolean
    createdBy: string
    invitees?: string[]
}

export function queryByTripIdForPermissions(tripId: string) {
    return {
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
            ':pk': getTripIdPk(tripId)
        },
        ProjectionExpression: 'tripId, isPublic, createdBy, invitees',
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
        ProjectionExpression: 'tripId, #name, isPublic, createdAt, updatedAt, startDate, endDate, createdBy',
        ExpressionAttributeNames: {
            '#name': 'name'  // 'name' is a reserved word in DynamoDB
        },
        Limit: limit,
        ScanIndexForward: false  // Set to false for descending order
    }
}

export function queryByInvitee(email: string, limit: number = 10) {
    return {
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
            ':pk': getInviteesDbPK(email)
        },
        ProjectionExpression: 'tripId, #name, isPublic, createdAt, updatedAt, startDate, endDate, createdBy',
        ExpressionAttributeNames: {
            '#name': 'name'
        },
        Limit: limit,
        ScanIndexForward: false
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