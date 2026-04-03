// types/invitation.ts

export enum InviteStatus {
  PENDING = 'pending',
  ACCEPTED = 'accepted',
  DECLINED = 'declined'
}

export interface Invite {
  tripId: string;
  email: string;
  status: InviteStatus;
  name?: string;
  invitedAt: string;
  invitedBy: string;
}

export interface Comment {
  id: number;
  author: string;
  content: string;
  timestamp: string;
  isNew: boolean;
}