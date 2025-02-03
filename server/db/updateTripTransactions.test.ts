// app/server/service/updateTripDbService.test.ts
import { UpdateTripDbService } from './updateTripTransactions';

const { buildUpdateExpression, validateDaysArray } = new UpdateTripDbService();

describe('buildUpdateExpression', () => {

  test('handles simple string attributes', () => {
    const result = buildUpdateExpression('name', 'Test Trip');
    expect(result).toEqual({
      updateExpression: 'SET #name = :name',
      expressionAttributeValues: { ':name': 'Test Trip' },
      expressionAttributeNames: { '#name': 'name' }
    });
  });

  test('handles boolean attributes', () => {
    const result = buildUpdateExpression('isPublic', true);
    expect(result).toEqual({
      updateExpression: 'SET #isPublic = :isPublic',
      expressionAttributeValues: { ':isPublic': true },
      expressionAttributeNames: { '#isPublic': 'isPublic' }
    });
  });

  test('handles array attributes (tags)', () => {
    const tags = ['vacation', 'summer'];
    const result = buildUpdateExpression('tags', tags);
    expect(result).toEqual({
      updateExpression: 'SET #tags = :tags',
      expressionAttributeValues: { ':tags': tags },
      expressionAttributeNames: { '#tags': 'tags' }
    });
  });

  test('handles array attributes (sharedWith)', () => {
    const users = ['user1@example.com', 'user2@example.com'];
    const result = buildUpdateExpression('sharedWith', users);
    expect(result).toEqual({
      updateExpression: 'SET #sharedWith = :sharedWith',
      expressionAttributeValues: { ':sharedWith': users },
      expressionAttributeNames: { '#sharedWith': 'sharedWith' }
    });
  });

  test.skip('handles days array with valid structure', () => {
    const days = [{
      date: '2025-01-01',
      itinerary: 'Visit museum',
      reservations: 'Lunch at 12pm',
      lodging: 'Hotel ABC',
      travelTime: '30 mins',
      notes: 'Bring camera'
    }];
    const result = buildUpdateExpression('days', days);
    expect(result).toEqual({
      updateExpression: 'SET #days = :days',
      expressionAttributeValues: { ':days': days },
      expressionAttributeNames: { '#days': 'days' }
    });
  });

  test('throws error for invalid attribute key', () => {
    expect(() => {
      buildUpdateExpression('invalidKey', 'value');
    }).toThrow('Invalid attribute key: invalidKey');
  });

  test.skip('throws error for invalid days array structure', () => {
    const invalidDays = [{
      date: '2025-01-01',
      // Missing required fields
    }];
    expect(() => {
      buildUpdateExpression('days', invalidDays);
    }).toThrow('Invalid days array structure');
  });

  test('throws error for non-array tags', () => {
    expect(() => {
      buildUpdateExpression('tags', 'not-an-array');
    }).toThrow('tags must be an array');
  });

  test('throws error for non-array sharedWith', () => {
    expect(() => {
      buildUpdateExpression('sharedWith', 'not-an-array');
    }).toThrow('sharedWith must be an array');
  });
});

describe('validateDaysArray', () => {
  test('returns true for valid days array', () => {
    const days = [{
      date: '2025-01-01',
      itinerary: 'Visit museum',
      reservations: 'Lunch at 12pm',
      lodging: 'Hotel ABC',
      travelTime: '30 mins',
      notes: 'Bring camera'
    }];
    expect(validateDaysArray(days)).toBe(true);
  });

  test('returns false for days with missing fields', () => {
    const days = [{
      date: '2025-01-01',
      itinerary: 'Visit museum'
      // Missing other required fields
    }];
    expect(validateDaysArray(days)).toBe(false);
  });

  test('returns false for days with invalid field types', () => {
    const days = [{
      date: '2025-01-01',
      itinerary: 123, // Should be string
      reservations: 'Lunch at 12pm',
      lodging: 'Hotel ABC',
      travelTime: '30 mins',
      notes: 'Bring camera'
    }];
    expect(validateDaysArray(days)).toBe(false);
  });
});