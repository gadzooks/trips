// server/service/tripPermissionsService.ts

import { GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '@/lib/dynamodb'
import { queryByTripIdForPermissions, TripPermissionsDTO } from '../db/queryTripTransactions'
import { Permission, Role, rolePermissions, TripAccessResult } from '@/types/permissions';

export class TripPermissionsService {
  async validateTripAccess(
    requiredPermission: Permission,
    tripId?: string,
    userId?: string | null,
    entityId?: string
  ): Promise<TripAccessResult> {
    const deniedAccessResult: TripAccessResult = {
      allowed: false,
      reason: 'Access denied',
      roles: [],
      permissions: []
    };

    try {
      if (tripId === undefined || tripId === null) {
        return { ...deniedAccessResult, reason: 'Trip ID is required' };
      }

      const isValidUser = userId !== undefined && userId !== null;

      const tripDetailsRows = await docClient.send(
        new QueryCommand(queryByTripIdForPermissions(tripId))
      );

      //export interface TripPermissionsDTO {
      //    tripId: string
      //    isPublic: boolean
      //    createdBy: string
      //    invitees?: string[]
      // }
      const tripPermissionDetails = tripDetailsRows.Items?.[0] as TripPermissionsDTO;
      if (!tripPermissionDetails) {
        return { ...deniedAccessResult, reason: 'Trip not found' };
      }

      const roles: Role[] = [];

      // Owner role check
      if (isValidUser && tripPermissionDetails.createdBy === userId) {
        roles.push(Role.OWNER);
      }

      // TODO: implement co_owner role check

      // Invitee role check - separate from shared
      if (isValidUser &&
          tripPermissionDetails.invitees &&
          tripPermissionDetails.invitees.includes(userId)) {
        roles.push(Role.INVITEE);
      }

      // Public access check
      if (tripPermissionDetails.isPublic === true) {  // Explicit check for true
        roles.push(Role.PUBLIC);
      }

      // If no roles, deny access
      if (roles.length === 0 && isValidUser) {
        return { ...deniedAccessResult, reason: 'No access to this trip' };
      }

      if (roles.length === 0 && !isValidUser) {
        return { ...deniedAccessResult, reason: 'User needs to be logged in' };
      }

      // Collect all permissions from all roles
      const permissions = new Set<Permission>();
      roles.forEach(role => {
        rolePermissions[role].forEach(permission => {
          permissions.add(permission);
        });
      });

      // For entity-specific permissions
      if (entityId &&
          (requiredPermission === Permission.EDIT ||
           requiredPermission === Permission.DELETE)) {
        try {
          const entityDetails = await this.getEntityDetails(entityId);

          // If user is not owner of the entity and not trip owner
          if (entityDetails &&
              isValidUser &&
              entityDetails.createdBy !== userId &&
              !roles.includes(Role.OWNER)) {
            permissions.delete(Permission.EDIT);
            permissions.delete(Permission.DELETE);
          }
        } catch (error) {
          console.error('Error fetching entity details:', error);
          // On error, remove edit/delete permissions for safety
          if (!roles.includes(Role.OWNER)) {
            permissions.delete(Permission.EDIT);
            permissions.delete(Permission.DELETE);
          }
        }
      }

      const hasPermission = permissions.has(requiredPermission);

      return {
        allowed: hasPermission,
        reason: hasPermission ? 'Access granted' : 'Access denied',
        roles,
        permissions: Array.from(permissions)
      };
    } catch (error) {
      console.error('Failed to validate trip access:', error);
      return {
        ...deniedAccessResult,
        reason: 'Error validating access: ' + error
      };
    }
  }

  private async getEntityDetails(entityId: string): Promise<any> {
    try {
      const result = await docClient.send(
        new GetCommand({
          TableName: process.env.TRIP_PLANNER_TABLE_NAME,
          Key: {
            PK: `COMMENT#${entityId}`,
            SK: 'METADATA'
          }
        })
      );

      return result.Item;
    } catch (error) {
      console.error('Failed to get entity details:', error);
      throw error; // Propagate error to handle it in calling function
    }
  }

  async validateCommentAccess(
    permission: Permission,
    tripId: string,
    commentId: string,
    userId?: string | null
  ): Promise<TripAccessResult> {
    // First check trip access for VIEW permission
    const tripViewAccess = await this.validateTripAccess(
      Permission.VIEW,
      tripId,
      userId
    );

    if (!tripViewAccess.allowed && permission !== Permission.VIEW) {
      return tripViewAccess;
    }

    // For VIEW permission on a public trip, allow if the initial trip view access allows it
    if (permission === Permission.VIEW) {
      return tripViewAccess;
    }

    // For EDIT, DELETE, check if user is comment owner or trip owner
    try {
      const entityDetails = await this.getEntityDetails(commentId);

      // If user is owner of the comment, grant permission
      if (entityDetails && userId && entityDetails.createdBy === userId) {
        return {
          allowed: true,
          reason: 'Access granted as comment owner',
          roles: tripViewAccess.roles,
          permissions: [permission]
        };
      }

      // If user is owner of the trip, grant permission
      if (tripViewAccess.roles.includes(Role.OWNER)) {
        return {
          allowed: true,
          reason: 'Access granted as trip owner',
          roles: tripViewAccess.roles,
          permissions: [permission]
        };
      }

      // Otherwise deny permission
      return {
        allowed: false,
        reason: 'Only comment owners or trip owners can modify comments',
        roles: tripViewAccess.roles,
        permissions: []
      };
    } catch (error) {
      console.error('Failed to validate comment access:', error);
      return {
        allowed: false,
        reason: 'Error validating comment access: ' + error,
        roles: [],
        permissions: []
      };
    }
  }

  async validateReactionAccess(
    tripId: string,
    commentId: string,
    userId?: string | null
  ): Promise<TripAccessResult> {
    return this.validateTripAccess(Permission.REACT, tripId, userId);
  }
}