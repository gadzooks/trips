import { describe, it, expect, jest, beforeEach } from '@jest/globals';
import { createTripTransactions } from "./createTransactions"

describe('TripService', () => {
  describe('createTripTransactions', () => {
    it.each([
      ['public trip with tags', {
        input: {
          tripData: {
            title: 'Paris Trip',
            description: 'Trip to Paris',
            isPublic: true,
            tags: ['europe', 'france', 'england'],
            sharedWith: ['bob123', 'alice456']
          },
          userId: 'user123'
        },
        expected: {
          transactionCount: 7, // 1 trip + 3 tag associations + 2 shared user associations + 1 public status
          hasPublicStatus: true
        }
      }],
      ['private trip with tags', {
        input: {
          tripData: {
            title: 'Secret Trip',
            description: 'Secret Trip',
            isPublic: false,
            tags: ['secret'],
            sharedWith: []
          },
          userId: 'user123'
        },
        expected: {
          transactionCount: 2, // 1 trip + 1 tag
          hasPublicStatus: false
        }
      }],
      ['trip without tags', {
        input: {
          tripData: {
            title: 'No Tags Trip',
            description: 'No Tags Trip',
            isPublic: true,
            tags: [],
            sharedWith: []
          },
          userId: 'user123'
        },
        expected: {
          transactionCount: 2, // 1 trip + 1 public status
          hasPublicStatus: true
        }
      }]
    ])('%s', (_, testCase) => {
      const { tripId, transactItems } = createTripTransactions(
        testCase.input.tripData,
        testCase.input.userId
      )

      expect(tripId).toBeTruthy()
      expect(transactItems).toHaveLength(testCase.expected.transactionCount)
      
      // if (testCase.expected.hasPublicStatus) {
      //   expect(transactItems).toContainEqual(
      //     expect.objectContaining({
      //       Put: expect.objectContaining({
      //         Item: expect.objectContaining({
      //           PK: dbService.getPublicStatusPartitionKey(mockUUID)
      //         })
      //       })
      //     })
      //   )
      // }

      // const tripRecord = 'Put' in transactItems[0] ? transactItems[0].Put.Item : null
      // expect(tripRecord).toMatchObject({
      //   PK: dbService.getTripPrimaryKey(testCase.input.userId),
      //   SK: dbService.getTripSortKey(mockUUID),
      //   description: testCase.input.tripData.description,
      //   isPublic: testCase.input.tripData.isPublic,
      //   createdAt: mockTimestamp,
      //   updatedAt: mockTimestamp
      // })
      })
  })
})