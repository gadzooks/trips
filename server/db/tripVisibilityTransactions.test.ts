// app/api/services/createTrip/tripVisibilityTransactions.test.ts
import { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';
import { createVisibilityTransactions } from './tripVisibilityTransactions';
import { UpdateTripAttributeRequest } from '@/app/components/ui/utils/updateTrip';

// Mock environment variables
process.env.TRIP_PLANNER_TABLE_NAME = 'test-table';

type TransactItem = NonNullable<TransactWriteCommandInput['TransactItems']>[number];

describe('createVisibilityTransactions', () => {
  // Base test request that we'll modify for different scenarios
  const baseRequest: UpdateTripAttributeRequest = {
    name: 'Trip to the beach',
    tripId: 'trip123',
    createdAt: '2024-02-02',
    createdBy: 'user123',
    attributeKey: 'isPublic',
    attributeValue: true,
    tags: 'beach summer'
  };

  // Test cases using parameterized pattern
  describe.each([
    {
      scenario: 'public trip with tags',
      request: baseRequest,
      expectedLength: 6, // 1 update + 2 tags * 2 operations + 1 public tag
      verifyTransactions: (items: any[]) => {
        // Main trip update
        expect(items[0]).toHaveProperty('Update');
        expect(items[0].Update.Key.PK).toBe('TRIP#trip123');
        expect(items[0].Update.ExpressionAttributeValues[':isPublic']).toBe(true);

        // Tag operations (Delete old PRIVATE tags, Create new PUBLIC tags)
        expect(items[1].Delete.Key.PK).toBe('TAG#PRIVATE#beach');
        expect(items[1].Delete.Key.SK).toBe(baseRequest.tripId);

        expect(items[2].Put.Item.PK).toBe('TAG#PUBLIC#beach');
        expect(items[2].Put.Item.SK).toBe(baseRequest.tripId);

        expect(items[3].Delete.Key.PK).toBe('TAG#PRIVATE#summer');
        expect(items[3].Delete.Key.SK).toBe(baseRequest.tripId);

        expect(items[4].Put.Item.PK).toBe('TAG#PUBLIC#summer');
        expect(items[4].Put.Item.SK).toBe(baseRequest.tripId);

        expect(items[5].Put.Item.PK).toBe('TAG#PUBLIC');
        expect(items[5].Put.Item.SK).toBe(baseRequest.tripId);
      }
    },
    {
      scenario: 'private trip with tags',
      request: { ...baseRequest, attributeValue: false },
      expectedLength: 6, // 1 update + 2 tags * 2 operations + 1 public tag,
      verifyTransactions: (items: any[]) => {
        expect(items[0].Update.ExpressionAttributeValues[':isPublic']).toBe(false);
        expect(items[0].Update.Key.PK).toBe('TRIP#trip123');
        expect(items[0].Update.Key.SK).toBe(baseRequest.createdAt);

        expect(items[1].Delete.Key.PK).toBe('TAG#PUBLIC#beach');
        expect(items[1].Delete.Key.SK).toBe(baseRequest.tripId);

        expect(items[2].Put.Item.PK).toBe('TAG#PRIVATE#beach');
        expect(items[2].Put.Item.SK).toBe(baseRequest.tripId);

        expect(items[3].Delete.Key.PK).toBe('TAG#PUBLIC#summer');
        expect(items[3].Delete.Key.SK).toBe(baseRequest.tripId);

        expect(items[4].Put.Item.PK).toBe('TAG#PRIVATE#summer');
        expect(items[4].Put.Item.SK).toBe(baseRequest.tripId);
      }
    },
    {
      scenario: 'public trip without tags',
      request: { ...baseRequest, tags: '' },
      expectedLength: 2, // 1 update + 1 public tag operation
      verifyTransactions: (items: any[]) => {
        expect(items[0].Update.ExpressionAttributeValues[':isPublic']).toBe(true);
        expect(items[0].Update.Key.PK).toBe('TRIP#trip123');
        expect(items[0].Update.Key.SK).toBe(baseRequest.createdAt);

        expect(items[1].Put.Item.PK).toBe('TAG#PUBLIC');
        expect(items[1].Put.Item.SK).toBe(baseRequest.tripId);
      }
    },
    {
      scenario: 'private trip without tags',
      request: { ...baseRequest, tags: '', attributeValue: false },
      expectedLength: 2, // 1 update + 1 public tag delete
      verifyTransactions: (items: any[]) => {
        expect(items[0].Update.ExpressionAttributeValues[':isPublic']).toBe(false);
        expect(items[0].Update.Key.PK).toBe('TRIP#trip123');
        expect(items[0].Update.Key.SK).toBe(baseRequest.createdAt);

        expect(items[1].Delete.Key.PK).toBe('TAG#PUBLIC');
        expect(items[1].Delete.Key.SK).toBe(baseRequest.tripId);
      }
    }
  ])('should handle $scenario correctly', ({ request, expectedLength, verifyTransactions }) => {
    it('creates correct transaction items', () => {
      const result = createVisibilityTransactions(request);

      // Verify the number of transactions
      expect(result).toHaveLength(expectedLength);

      // Verify transaction details
      verifyTransactions(result);

      // Common assertions for all scenarios
      result.forEach((item: TransactItem) => {
        // Verify table name is set correctly
        if (item.Update) {
          expect(item.Update.TableName).toBe('test-table');
        } else if (item.Delete) {
          expect(item.Delete.TableName).toBe('test-table');
        } else if (item.Put) {
          expect(item.Put.TableName).toBe('test-table');
        }
      });
    });
  });

  // Additional edge case tests
  it('should handle empty tags array', () => {
    const request = { ...baseRequest, tags: '' };
    const result = createVisibilityTransactions(request);
    
    expect(result).toHaveLength(2); // Just the update and PUBLIC tag
    expect(result[0]).toHaveProperty('Update');
    expect(result[1]).toHaveProperty('Put');
  });

  it('should maintain consistent transaction structure', () => {
    const result = createVisibilityTransactions(baseRequest);
    
    // Verify all transactions have required properties
    result.forEach(item => {
      if (item.Put) {
        expect(item.Put.Item).toMatchObject({
          createdAt: expect.any(String),
          createdBy: expect.any(String),
          tripId: expect.any(String)
        });
      }
    });
  });
});