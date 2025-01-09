// src/services/tripDbService.ts

import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '@/lib/dynamodb'
import { TripAccessResult, TripRecord } from '@/types/trip'
import { TABLE_NAME } from './common'


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

  PublicTripsIndex = 'PublicTripsIndex';
  PublicStatusPartitionKey = 'publicStatusPartitionKey';

  //FIXME: need to paginate
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
          IndexName: this.PublicTripsIndex,
          KeyConditionExpression: `begins_with(${this.PublicStatusPartitionKey}, :pk)`,
          ExpressionAttributeValues: {
            ':pk': this.getPublicStatusPartitionKey('')
          },
          Limit: 3
        }))
      )
    }

    const results = await Promise.all(queries)
    return results.flatMap(result => result.Items ?? [])
  }

  async getTripByTripIdAndUser(tripId: string, userId: string) {
    console.log("getTripByTripIdAndUser with inputs tripId: ", tripId, " userId: ", userId)
    const params = {
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND SK = :sk',
      ExpressionAttributeValues: {
        ':pk': this.getTripPrimaryKey(userId),
        ':sk': this.getTripSortKey(tripId)
      },
      Limit: 1
    }
   
    const result = await docClient.send(new QueryCommand(params))
    console.log("getTripByTripIdAndUser result: ", result)
    const item = result.Items?.[0]
   
    if (!item) {
      return null
    }
   
    // if (userId && 
    //     item.SK !== `USER#${userId}` && 
    //     item.SK !== `SHARE#${userId}` && 
    //     !item.isPublic) {
    //   return null
    // }
   
    // return item
   }


}