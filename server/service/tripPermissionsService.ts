// app/api/services/tripDbService.ts

import { QueryCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '@/lib/dynamodb'
import { queryByTripIdForPermissions, TripPermissionsDTO } from '../db/queryTripTransactions'
import { AccessType, TripAccessResult } from '@/types/trip'

export class TripPermissionsService {
  async validateTripAccess(accessType: AccessType, tripId?: string, userId?: string | null): Promise<TripAccessResult> {
    let deniedAccessResult = { allowed: false, reason: 'Access denied', hasCreateAccess: false, hasReadAccess: false, hasWriteAccess: false, hasDeleteAccess: false }
    try {
      if (tripId === undefined || tripId === null) {
        return { ...deniedAccessResult, reason: 'Trip ID is required' }
      }

      const isValidUser = userId !== undefined && userId !== null

      // If user is not logged in, they can only access public trips
      if (!isValidUser && accessType !== AccessType.ReadOnly) {
        return { ...deniedAccessResult, reason: 'User needs to be logged' }
      }

      const tripDetailsRows = await docClient.send(new QueryCommand(queryByTripIdForPermissions(tripId)));
      const tripPermissionDetails = tripDetailsRows.Items?.[0] as TripPermissionsDTO
      if (!tripPermissionDetails) {
        return { ...deniedAccessResult, reason: 'Trip not found' }
      }

      const isOwner = isValidUser && tripPermissionDetails.createdBy === userId
      const isSharedWith = isValidUser && tripPermissionDetails.sharedWith && tripPermissionDetails.sharedWith.includes(userId)

      const hasCreateAccess = isValidUser;

      const hasReadAccess = isOwner ||
        tripPermissionDetails.isPublic ||
        isSharedWith ||
        false;

      const hasWriteAccess = isOwner ||
        isSharedWith ||
        false;

      const hasDeleteAccess = isOwner;

      switch (accessType) {
        case AccessType.Create:
          return { allowed: hasCreateAccess, reason: hasCreateAccess ? 'Access granted' : 'Access denied', hasCreateAccess, hasReadAccess, hasWriteAccess, hasDeleteAccess }
        case AccessType.ReadOnly:
          return { allowed: hasReadAccess, reason: hasReadAccess ? 'Access granted' : 'Access denied', hasCreateAccess, hasReadAccess, hasWriteAccess, hasDeleteAccess }
        case AccessType.ReadWrite:
          return { allowed: hasWriteAccess, reason: hasWriteAccess ? 'Access granted' : 'Access denied', hasCreateAccess, hasReadAccess, hasWriteAccess, hasDeleteAccess }
        case AccessType.Delete:
          return { allowed: hasDeleteAccess, reason: hasDeleteAccess ? 'Access granted' : 'Access denied', hasCreateAccess, hasReadAccess, hasWriteAccess, hasDeleteAccess }
        default:
          return { ...deniedAccessResult, reason: 'Invalid access type' }
      }

    } catch (error) {
      console.error('Failed to validate trip access:', error)
      return { ...deniedAccessResult, reason: 'Error validating access : ' + error}
    }
  }

}