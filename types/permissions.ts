// types/permissions.ts

export enum TripListType {
  PUBLIC = 'public',
  MY_TRIPS = 'myTrips',
  BOTH = 'both'
}

// https://claude.ai/chat/963374b0-7a68-4697-b053-9dbecc1db0a2
// Permission-based access control for finer granularity
export enum Permission {
  VIEW = 'view',
  EDIT = 'edit',
  DELETE = 'delete',
  INVITE = 'invite',
  COMMENT = 'comment',
  RSVP = 'rsvp',
  REACT = 'react'
}

// Role-based access control for easier assignment
export enum Role {
  OWNER = 'owner',
  INVITEE = 'invitee',
  // CO_OWNER = 'co_owner', // This role is not used in the current implementation
  PUBLIC = 'public'
}

// Map roles to their default permissions
export const rolePermissions: Record<Role, Permission[]> = {
  [Role.OWNER]: [
    Permission.VIEW,
    Permission.EDIT,
    Permission.DELETE,
    Permission.INVITE,
    Permission.COMMENT,
    Permission.RSVP,
    Permission.REACT
  ],
  [Role.INVITEE]: [
    Permission.VIEW,
    Permission.COMMENT,
    Permission.RSVP,
    Permission.REACT
  ],
  // [Role.SHARED]: [
  //   Permission.VIEW,
  //   Permission.REACT
  // ],
  [Role.PUBLIC]: [
    Permission.VIEW
  ]
}

export interface TripAccessResult {
  allowed: boolean;
  reason: string;
  roles: Role[];
  permissions: Permission[];
}

// Interface for access control
export interface AccessControl {
  role: Role;
  entityId?: string;       // For entity-specific permissions (like a specific comment)
  customPermissions?: Permission[]; // For overriding default permissions
}