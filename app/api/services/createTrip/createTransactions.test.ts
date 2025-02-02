// app/api/services/createTrip/createTransactions.test.ts
import { describe, it, expect } from '@jest/globals';
import { createTripTransactions } from "./createTransactions"

describe('TripService', () => {
  describe('createTripTransactions', () => {
    it.each([
      ['public trip with tags', {
        input: {
          tripData: {
            name: 'Paris Trip',
            description: 'Trip to Paris',
            isPublic: true,
            tags: ['europe', 'france', 'england'],
            sharedWith: ['bob123', 'alice456']
          },
          userId: 'user123'
        },
        expected: {
          transactionCount: 8, // 1 trip + 1 owner + 3 tag associations + 2 shared user associations + 1 public status
          hasPublicStatus: true
        }
      }],
      ['private trip with tags', {
        input: {
          tripData: {
            name: 'Secret Trip',
            description: 'Secret Trip',
            isPublic: false,
            tags: ['secret'],
            sharedWith: []
          },
          userId: 'user123'
        },
        expected: {
          transactionCount: 3, // 1 trip + 1 tag + 1 owner
          hasPublicStatus: false
        }
      }],
      ['trip without tags', {
        input: {
          tripData: {
            name: 'No Tags Trip',
            description: 'No Tags Trip',
            isPublic: true,
            tags: [],
            sharedWith: []
          },
          userId: 'user123'
        },
        expected: {
          transactionCount: 3, // 1 trip + 1 public status + 1 owner
          hasPublicStatus: true
        }
      }],
      ['trip with undefined tags', {
        input: {
          tripData: {
            name: 'No Tags Trip',
            description: 'No Tags Trip',
            isPublic: true,
            sharedWith: []
          },
          userId: 'user123'
        },
        expected: {
          transactionCount: 3, // 1 trip + 1 public status + 1 owner
          hasPublicStatus: true
        }
      }]
    ])('%s', (_, testCase) => {
      const { tripId, userId, timestamp, transactItems } = createTripTransactions(
        testCase.input.tripData,
        testCase.input.userId
      )

      expect(tripId).toBeTruthy()
      expect(userId).toBeTruthy()
      expect(timestamp).toBeTruthy()
      expect(transactItems).toHaveLength(testCase.expected.transactionCount)
      
      transactItems.forEach(item => {
        expect(item).toHaveProperty('Put')
        expect(item.Put).toHaveProperty('Item')
        const itemData = item.Put.Item
        expect(itemData).toHaveProperty('PK')
        expect(itemData).toHaveProperty('SK')
        expect(itemData).toHaveProperty('name', testCase.input.tripData.name)
        // expect(itemData).toHaveProperty('tripId', tripId)
        expect(itemData).toHaveProperty('isPublic', testCase.expected.hasPublicStatus)
        expect(itemData).toHaveProperty('createdAt', timestamp)

        const pk = itemData.PK
        const sk = itemData.SK

        if (pk.startsWith('CREATEDBY#')) {
          expect(pk).toEqual(`CREATEDBY#${testCase.input.userId}`)
          expect(sk).toEqual(tripId)
          expect(itemData).toHaveProperty('name', testCase.input.tripData.name)
          expect(itemData).toHaveProperty('isPublic', testCase.expected.hasPublicStatus)
          expect(itemData).toHaveProperty('createdAt', timestamp)
        } else if (pk.startsWith('SHAREDWITH#')) {
          expect(sk).toEqual(tripId)
          expect(itemData).toHaveProperty('name', testCase.input.tripData.name)
          expect(itemData).toHaveProperty('isPublic', testCase.expected.hasPublicStatus)
          expect(itemData).toHaveProperty('createdAt', timestamp)
        } else if (pk.startsWith('TAG#')) {
          expect(sk).toEqual(tripId)
          expect(itemData).toHaveProperty('name', testCase.input.tripData.name)
          expect(itemData).toHaveProperty('isPublic', testCase.expected.hasPublicStatus)
          expect(itemData).toHaveProperty('createdAt', timestamp)
        }
      })
    })
  })
})