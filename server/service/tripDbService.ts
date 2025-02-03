// app/api/services/tripDbService.ts

import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '@/lib/dynamodb'
import { TripRecord } from '@/types/trip'
import { getTripIdPk } from '../db/createTransactions'

export interface TripAccessResult {
  allowed: boolean
  reason: string
}

export class TripDbService {
  async validateTripAccess(tripId: string, userId: string, requireOwnership: boolean = false): Promise<TripAccessResult> {
    try {
      const result = await docClient.send(new QueryCommand({
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `${getTripIdPk(tripId)}`,
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
        (trip.sharedWith && trip.sharedWith.includes(userId)) || 
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

}