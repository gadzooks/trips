// server/service/tripPermissionsService.test.ts

import { GetCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { docClient } from '@/lib/dynamodb';
import { TripPermissionsService } from '../service/tripPermissionsService';
import { Permission, Role, TripAccessResult } from '@/types/permissions';

// Mock AWS DynamoDB client
jest.mock('@/lib/dynamodb', () => ({
  docClient: {
    send: jest.fn()
  }
}));

describe('TripPermissionsService', () => {
  let service: TripPermissionsService;
  const mockTripId = 'trip123';
  const mockUserId = 'user123';
  const mockCommentId = 'comment123';

  beforeEach(() => {
    service = new TripPermissionsService();
    jest.clearAllMocks();
  });

  describe('validateTripAccess', () => {
    const mockTripData = {
      tripId: mockTripId,
      createdBy: mockUserId,
      isPublic: false,
      invitees: ['shared123']
    };

    beforeEach(() => {
      (docClient.send as jest.Mock).mockResolvedValue({
        Items: [mockTripData]
      });
    });

    test.each([
      // [undefined, Permission.VIEW, 'Trip ID is required', false],
      // [null, Permission.VIEW, 'Trip ID is required', false],
      ['nonexistent', Permission.VIEW, 'Trip not found', false]
    ])('should handle invalid trip IDs - tripId: %s', async (tripId, permission, expectedReason, expectedAllowed) => {
      if (tripId === 'nonexistent') {
        (docClient.send as jest.Mock).mockResolvedValue({ Items: [] });
      }

      const result = await service.validateTripAccess(permission, tripId, mockUserId);

      expect(result.allowed).toBe(expectedAllowed);
      expect(result.reason).toBe(expectedReason);
    });

    test('should return denied access for unauthenticated user on private trip', async () => {
      const result = await service.validateTripAccess(Permission.VIEW, mockTripId, undefined);

      expect(result.allowed).toBe(false);
      expect(result.reason).toBe('User needs to be logged in');
      expect(result.roles).toHaveLength(0);
    });

    test.each([
      [Role.OWNER, Permission.EDIT, true],
      [Role.OWNER, Permission.DELETE, true],
      [Role.INVITEE, Permission.VIEW, true],
      [Role.PUBLIC, Permission.VIEW, true]
    ])('should correctly handle permissions for role %s requesting %s permission', async (role, permission, expectedAllowed) => {
      // Setup mock data based on role
      const mockData = { ...mockTripData };
      if (role === Role.OWNER) {
        mockData.createdBy = mockUserId;
      } else if (role === Role.INVITEE) {
        mockData.createdBy = 'otherUser'; // ensure test user is not owner
        mockData.invitees = [mockUserId];
      } else if (role === Role.PUBLIC) {
        mockData.createdBy = 'otherUser';
        mockData.isPublic = true;
      }

      (docClient.send as jest.Mock).mockResolvedValue({ Items: [mockData] });

      const result = await service.validateTripAccess(permission, mockTripId, mockUserId);

      expect(result.allowed).toBe(expectedAllowed);
      expect(result.roles).toContain(role);
    });
  });

  describe('validateCommentAccess', () => {
    const mockCommentData = {
      PK: `COMMENT#${mockCommentId}`,
      SK: 'METADATA',
      createdBy: mockUserId
    };

    beforeEach(() => {
      // Mock trip access check
      (docClient.send as jest.Mock).mockImplementation((command) => {
        if (command instanceof QueryCommand) {
          return Promise.resolve({
            Items: [{
              tripId: mockTripId,
              createdBy: 'otherUser',
              isPublic: false,
              invitees: [mockUserId]
            }]
          });
        } else if (command instanceof GetCommand) {
          return Promise.resolve({ Item: mockCommentData });
        }
      });
    });

    test.each([
      [Permission.VIEW, true, 'Any role with view access can view comments'],
      [Permission.EDIT, true, 'Comment owner can edit their comment'],
      [Permission.DELETE, true, 'Comment owner can delete their comment'],
      [Permission.REACT, true, 'Users with access can react to comments']
    ])('should handle %s permission correctly', async (permission, expectedAllowed, testDescription) => {
      const result = await service.validateCommentAccess(
        permission,
        mockTripId,
        mockCommentId,
        mockUserId
      );

      expect(result.allowed).toBe(expectedAllowed);
    });

    test('should deny edit access for non-owner of comment', async () => {
      // Mock a scenario where the requesting user is not the comment owner
      (docClient.send as jest.Mock).mockImplementationOnce((command) => {
        if (command instanceof GetCommand) {
          return Promise.resolve({ Item: { ...mockCommentData, createdBy: 'otherUser' } });
        } else if (command instanceof QueryCommand) {
          return Promise.resolve({
            Items: [{
              tripId: mockTripId,
              createdBy: mockUserId,
              isPublic: false,
              invitees: []
            }]
          });
        }
      });

      const nonOwnerUserId = 'nonOwner';
      const result = await service.validateCommentAccess(
        Permission.EDIT,
        mockTripId,
        mockCommentId,
        nonOwnerUserId
      );

      expect(result.allowed).toBe(false);
    });

    // public trip should not allow users who are not the owner or invitee to view comments
    test('should deny view access for non-owner or invitee on public trip', async () => {
      // Mock a public trip and a non-owner, non-invitee user
      // Call sequence: 1) QueryCommand (trip lookup), 2) GetCommand (invite record - not found),
      //                3) GetCommand (comment entity check)
      (docClient.send as jest.Mock)
        .mockResolvedValueOnce({
          Items: [{
            tripId: mockTripId,
            createdBy: 'owner',
            isPublic: true,
            invitees: []
          }]
        })
        .mockResolvedValueOnce({ Item: undefined }) // invite record: not found
        .mockResolvedValueOnce({ Item: mockCommentData }); // comment entity

      const unauthorizedUser = 'unauthorizedUser';
      const result = await service.validateCommentAccess(
        Permission.VIEW,
        mockTripId,
        mockCommentId,
        unauthorizedUser
      );

      expect(result.allowed).toBe(false);
    }
    );
  });

  describe('validateReactionAccess', () => {
    beforeEach(() => {
      (docClient.send as jest.Mock).mockResolvedValue({
        Items: [{
          tripId: mockTripId,
          createdBy: 'otherUser',
          isPublic: false,
          invitees: [mockUserId]
        }]
      });
    });

    test.each([
      [mockUserId, true, 'User with access can react'],
      [undefined, false, 'Unauthenticated user cannot react'],
      ['unauthorizedUser', false, 'Unauthorized user cannot react']
    ])('should handle reaction access for user %s correctly', async (userId, expectedAllowed, testDescription) => {
      const result = await service.validateReactionAccess(
        mockTripId,
        mockCommentId,
        userId
      );

      expect(result.allowed).toBe(expectedAllowed);
    });
  });

  describe('error handling', () => {
    test('should handle DynamoDB errors gracefully', async () => {
      const mockError = new Error('DynamoDB error');
      (docClient.send as jest.Mock).mockRejectedValue(mockError);

      const result = await service.validateTripAccess(
        Permission.VIEW,
        mockTripId,
        mockUserId
      );

      expect(result.allowed).toBe(false);
      expect(result.reason).toContain('Error validating access');
    });

    test('should handle entity details retrieval errors', async () => {
      // First call succeeds (trip lookup), second call fails (entity lookup)
      (docClient.send as jest.Mock)
        .mockResolvedValueOnce({
          Items: [{
            tripId: mockTripId,
            createdBy: mockUserId,
            isPublic: false
          }]
        })
        .mockRejectedValueOnce(new Error('Entity lookup failed'));

      const result = await service.validateTripAccess(
        Permission.EDIT,
        mockTripId,
        mockUserId,
        'nonexistentEntity'
      );

      expect(result.allowed).toBe(true); // Should still succeed as owner
      expect(result.roles).toContain(Role.OWNER);
    });
  });
});

