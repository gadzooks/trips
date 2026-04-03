// types/invitation.ts

export enum InviteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
}

export enum InviteAccessLevel {
  READ_ONLY = 'readonly',
  READ_WRITE = 'readwrite'
}

export interface Invite {
  tripId: string;
  email: string;
  status: InviteStatus;
  name?: string;
  invitedAt: string;
  invitedBy: string;
  accessLevel?: InviteAccessLevel;
}

export interface Comment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  isNew: boolean;
}