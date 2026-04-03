// server/service/inviteService.test.ts

import { TripServiceError, TripErrorCodes } from '@/types/errors';
import { InviteStatus } from '@/types/invitation';

// Assuming these methods are part of a class called TripService
// You'll need to adjust the import and class structure to match your actual implementation
class TripService {
  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new TripServiceError(
        'Invalid email format',
        TripErrorCodes.VALIDATION_ERROR,
        400
      );
    }
  }
  
  private validateStatus(status: string): void {
    if (!Object.values(InviteStatus).includes(status as InviteStatus)) {
      throw new TripServiceError(
        'Invalid invite status',
        TripErrorCodes.INVALID_STATUS,
        400
      );
    }
  }
}

describe('TripService Validation Methods', () => {
  let tripService: TripService;

  beforeEach(() => {
    tripService = new TripService();
  });

  describe('validateEmail', () => {
    // Using test.each for parameterized tests with valid emails
    test.each([
      'user@example.com',
      'user.name@example.com',
      'user+tag@example.com',
      'user-name@example.com',
      'user123@sub.example.co.uk',
    ])('should accept valid email: %s', (validEmail) => {
      // We need to access the private method using any type casting
      expect(() => {
        (tripService as any).validateEmail(validEmail);
      }).not.toThrow();
    });

    // Using test.each for parameterized tests with invalid emails
    test.each([
      '',
      'plaintext',
      '@example.com',
      'user@',
      'user@.com',
      'user@example.',
      'user @example.com',
      'user@ example.com',
      'us er@example.com',
      'user@exam ple.com',
    ])('should reject invalid email: %s', (invalidEmail) => {
      expect(() => {
        (tripService as any).validateEmail(invalidEmail);
      }).toThrow(new TripServiceError(
        'Invalid email format',
        TripErrorCodes.VALIDATION_ERROR,
        400
      ));
    });
  });

  describe('validateStatus', () => {
    // Setup mock for InviteStatus enum
    // Replace this with your actual InviteStatus values
    const mockInviteStatus = {
      PENDING: 'PENDING',
      ACCEPTED: 'ACCEPTED',
      DECLINED: 'DECLINED',
    };

    beforeEach(() => {
      // This mock ensures tests work without the actual enum
      jest.spyOn(Object, 'values').mockReturnValue(Object.values(mockInviteStatus));
    });

    afterEach(() => {
      jest.restoreAllMocks();
    });

    // Test with valid statuses
    test.each(Object.values(mockInviteStatus))('should accept valid status: %s', (validStatus) => {
      expect(() => {
        (tripService as any).validateStatus(validStatus);
      }).not.toThrow();
    });

    // Test with invalid statuses
    test.each([
      '',
      'INVALID_STATUS',
      'pending', // lowercase version of valid status
      'CANCELLED', // plausible but not included status
      123, // non-string value
    ])('should reject invalid status: %s', (invalidStatus) => {
      expect(() => {
        (tripService as any).validateStatus(invalidStatus as string);
      }).toThrow(new TripServiceError(
        'Invalid invite status',
        TripErrorCodes.INVALID_STATUS,
        400
      ));
    });
  });
});