// src/services/tripDbService.ts

import { QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '@/lib/dynamodb'
import { CreateTripBody, TripAccessResult, TripRecord } from '@/types/trip'

const TABLE_NAME = 'TripPlanner'

export class TripDbService {
  async validateTripAccess(tripId: string, userId: string, requireOwnership: boolean = false): Promise<TripAccessResult> {
    try {
      const result = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `TRIP#${tripId}`,
          ':sk': 'USER#'
        }
      }))

      const trip = result.Items?.[0] as TripRecord
      if (!trip) {
        return { allowed: false, reason: 'Trip not found' }
      }

      const isOwner = trip.userId === userId
      
      if (requireOwnership && !isOwner) {
        return { allowed: false, reason: 'Operation requires trip ownership' }
      }

      const hasAccess = isOwner || 
        trip.isPublic || 
        (trip.sharedWith && trip.sharedWith[userId]) || 
        false

      return {
        allowed: hasAccess,
        reason: hasAccess ? 'Access granted' : 'Access denied'
      }
    } catch (error) {
      console.error('Failed to validate trip access:', error)
      return { allowed: false, reason: 'Error validating access' }
    }
  }

  async getTripDays(tripId: string) {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `TRIP#${tripId}`,
        ':sk': 'DAY#'
      }
    }))
    return result.Items ?? []
  }

  async createTrip(tripData: CreateTripBody, userId: string) {
    const tripId = crypto.randomUUID()
    const timestamp = new Date().toISOString()
    const commonAttributes = {
        tripId,
        userId,
        title: tripData.title,
        createdAt: timestamp,
        updatedAt: timestamp,
        isDeleted: false,
        isPublic: tripData.isPublic,
    }
    const tripRecord: TripRecord = {
        PK: `USER#${userId}`,
        SK: `TRIP#${tripId}`,
        ...commonAttributes,
        description: tripData.description,
        days: tripData.days || [],
    }

    const transactItems = [
      {
        Put: {
          TableName: TABLE_NAME,
          Item: tripRecord
        }
      },
      ...(tripData.isPublic ? [{
        Put: {
          TableName: TABLE_NAME,
          Item: {
            ...commonAttributes,
            PK: 'STATUS#PUBLIC',
            SK: `TRIP#${timestamp}`,
          }
        }
      }] : [])
    ]

    await docClient.send(new TransactWriteCommand({
      TransactItems: transactItems
    }))
    return tripId
  }

  async executeBatchWrite(transactItems: any[]) {
    await docClient.send(new TransactWriteCommand({
      TransactItems: transactItems
    }))
  }

  async getTripsForUser(userId: string, includePublic: boolean = false, publicOnly: boolean = false) {
    const queries = []

    if (!publicOnly) {
      // Get user's own trips
      queries.push(
        docClient.send(new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'begins_with(PK, :pk) AND SK = :sk',
          ExpressionAttributeValues: {
            ':pk': 'TRIP#',
            ':sk': `USER#${userId}`
          }
        }))
      )

      // Get shared trips
      queries.push(
        docClient.send(new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'begins_with(PK, :pk) AND SK = :sk',
          ExpressionAttributeValues: {
            ':pk': 'TRIP#',
            ':sk': `SHARE#${userId}`
          }
        }))
      )
    }

    if (includePublic || publicOnly) {
      queries.push(
        docClient.send(new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: 'GSI1',
          KeyConditionExpression: 'publicStatusPartitionKey = :pk',
          ExpressionAttributeValues: {
            ':pk': 'STATUS#PUBLIC'
          }
        }))
      )
    }

    const results = await Promise.all(queries)
    return results.flatMap(result => result.Items ?? [])
  }
}