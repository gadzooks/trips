// types/errors.ts

// export type InviteStatus = 'accepted' | 'pending' | 'declined';

export type TripErrorCode =
  | 'INVITE_NOT_FOUND'      // Invite does not exist
  | 'INVALID_STATUS'        // Invalid invite status provided
  | 'INVALID_EMAIL'         // Invalid email format
  | 'DATABASE_ERROR'        // DynamoDB operation failed
  | 'VALIDATION_ERROR'      // Input validation failed
  | 'DUPLICATE_INVITE'      // Invite already exists
  | 'UNAUTHORIZED'          // User not authorized for operation
  | 'TRIP_NOT_FOUND';       // Referenced trip does not exist

// Custom error class for trip service operations
export class TripServiceError extends Error {
    constructor(
      message: string,
      public readonly code: TripErrorCode,
      public readonly statusCode: number,
      public readonly originalError?: unknown
    ) {
      super(message);
      this.name = 'TripServiceError';
    }
  }

  // Constant object with all error codes for easy reference
export const TripErrorCodes: Record<TripErrorCode, TripErrorCode> = {
  INVITE_NOT_FOUND: "INVITE_NOT_FOUND",
  INVALID_STATUS: "INVALID_STATUS",
  INVALID_EMAIL: "INVALID_EMAIL",
  DATABASE_ERROR: "DATABASE_ERROR",
  VALIDATION_ERROR: "VALIDATION_ERROR",
  DUPLICATE_INVITE: "DUPLICATE_INVITE",
  UNAUTHORIZED: "UNAUTHORIZED",
  TRIP_NOT_FOUND: "TRIP_NOT_FOUND",
} as const;

// HTTP status codes mapping for error codes
export const ErrorStatusCodes: Record<TripErrorCode, number> = {
    INVITE_NOT_FOUND: 404,
    INVALID_STATUS: 400,
    INVALID_EMAIL: 400,
    DATABASE_ERROR: 500,
    VALIDATION_ERROR: 400,
    DUPLICATE_INVITE: 409,
    UNAUTHORIZED: 403,
    TRIP_NOT_FOUND: 404
  } as const;