import { TripPermissionsService, AccessType } from './tripPermissionsService'
import { docClient } from '@/lib/dynamodb'
import { TripPermissionsDTO } from '../db/queryTripTransactions'

jest.mock('@/lib/dynamodb', () => ({
  docClient: {
    send: jest.fn()
  }
}))

describe('TripPermissionsService', () => {
  let service: TripPermissionsService
  const mockTripId = 'trip123'
  const mockUserId = 'user123'
  
  beforeEach(() => {
    service = new TripPermissionsService()
    jest.clearAllMocks()
  })

  const mockQueryResponse = (tripDetails: Partial<TripPermissionsDTO> | null) => {
    ;(docClient.send as jest.Mock).mockResolvedValue({
      Items: tripDetails ? [tripDetails] : []
    })
  }

  describe('validateTripAccess edge cases', () => {
    test.each([
      ['missing tripId', undefined, mockUserId, AccessType.ReadOnly, 'Trip ID is required'],
      ['non-existent trip', mockTripId, mockUserId, AccessType.ReadOnly, 'Trip not found'],
    ])('%s', async (_, tripId, userId, accessType, expectedReason) => {
      mockQueryResponse(null)
      const result = await service.validateTripAccess(accessType, tripId, userId)
      expect(result.allowed).toBe(false)
      expect(result.reason).toBe(expectedReason)
    })
  })

  describe('validateTripAccess edge cases - Private trips', () => {
    test.each([
      ['missing userId', mockTripId, undefined, AccessType.ReadOnly, 'Access denied'],
      ['null userId', mockTripId, null, AccessType.ReadOnly, 'Access denied'],
      ['invalid access type', mockTripId, mockUserId, 'invalid' as AccessType, 'Invalid access type']
    ])('%s', async (_, tripId, userId, accessType, expectedReason) => {
      mockQueryResponse({ tripId: mockTripId, isPublic: false })
      const result = await service.validateTripAccess(accessType, tripId, userId)
      expect(result.allowed).toBe(false)
      expect(result.reason).toBe(expectedReason)
    })
  })

  describe('permission scenarios', () => {
    const testCases: [string, AccessType, Partial<TripPermissionsDTO>, string | undefined, boolean][] = [
      // [scenario, accessType, tripDetails, userId, expectedAllowed]
      ['owner has all permissions', AccessType.Delete, { createdBy: mockUserId }, mockUserId, true],
      ['public read access', AccessType.ReadOnly, { isPublic: true }, 'otherUser', true],
      ['shared user read access', AccessType.ReadOnly, { sharedWith: ['otherUser'] }, 'otherUser', true],
      ['shared user write access', AccessType.ReadWrite, { sharedWith: ['otherUser'] }, 'otherUser', true],
      ['non-shared user no access', AccessType.ReadOnly, { sharedWith: ['someone'] }, 'otherUser', false],
      ['shared user no delete access', AccessType.Delete, { sharedWith: ['otherUser'] }, 'otherUser', false]
    ]

    test.each(testCases)('%s', async (_, accessType, tripDetails, userId, expectedAllowed) => {
      mockQueryResponse({ ...tripDetails, tripId: mockTripId })
      const result = await service.validateTripAccess(accessType, mockTripId, userId)
      expect(result.allowed).toBe(expectedAllowed)
      expect(result.reason).toBe(expectedAllowed ? 'Access granted' : 'Access denied')
    })
  })

  test('handles DynamoDB errors', async () => {
    const error = new Error('DB Error')
    ;(docClient.send as jest.Mock).mockRejectedValue(error)
    
    const result = await service.validateTripAccess(AccessType.ReadOnly, mockTripId, mockUserId)
    expect(result.allowed).toBe(false)
    expect(result.reason).toContain('Error validating access')
  })

  test('correctly sets all permission flags', async () => {
    mockQueryResponse({
      tripId: mockTripId,
      createdBy: mockUserId,
      isPublic: true,
      sharedWith: ['otherUser']
    })

    const result = await service.validateTripAccess(AccessType.ReadOnly, mockTripId, mockUserId)
    expect(result).toEqual({
      allowed: true,
      reason: 'Access granted',
      hasCreateAccess: true,
      hasReadAccess: true,
      hasWriteAccess: true,
      hasDeleteAccess: true
    })
  })
})