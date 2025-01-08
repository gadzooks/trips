// src/services/tripDbService.ts

import { QueryCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '@/lib/dynamodb'
import { TripRecord, TripAccessResult, Day } from '@/types/trip'

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
        (trip.sharedWith && trip.sharedWith[userId])

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

  async createTrip(tripId: string, userId: string, tripData: TripRecord, days?: Day[], tags?: string[]) {
    const timestamp = new Date().toISOString()
    const transactItems = [
      {
        Put: {
          TableName: TABLE_NAME,
          Item: {
            ...tripData,
            createdAt: timestamp,
            updatedAt: timestamp
          }
        }
      },
      
      ...(tags?.map(tag => ({
        Put: {
          TableName: TABLE_NAME,
          Item: {
            PK: `TAG#${tag}`,
            SK: `TRIP#${tripId}`,
            tripId,
            'GSI1-PK': `TRIP#${tripId}`,
            'GSI1-SK': `TAG#${tag}`,
            createdAt: timestamp
          }
        }
      })) ?? []),

      ...(days?.map((day, index) => ({
        Put: {
          TableName: TABLE_NAME,
          Item: {
            PK: `TRIP#${tripId}`,
            SK: `DAY#${String(index + 1).padStart(6, '0')}`,
            ordinal: index + 1,
            ...day,
            createdAt: timestamp
          }
        }
      })) ?? [])
    ]

    await docClient.send(new TransactWriteCommand({
      TransactItems: transactItems
    }))
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
          KeyConditionExpression: 'GSI1-PK = :pk',
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