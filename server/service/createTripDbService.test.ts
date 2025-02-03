// app/api/services/createTripDbService.test.ts
import { CreateTripDbService } from './createTripDbService';
import { TripRecordDTO, TripDayDTO } from '@/types/trip';
import { getTripIdPrefix } from '../db/queryTripTransactions';
import { ulid } from 'ulid';

describe('TripMapper', () => {
  let mapper: CreateTripDbService;
  let tripId: string;
  let SK: string;

  beforeEach(() => {
    mapper = new CreateTripDbService();
    tripId = ulid();
    SK = Date.now().toString();
  });

  describe('toTripId', () => {
    it('should extract trip ID from PK', () => {
      const input = { PK: `${getTripIdPrefix()}${tripId}` };
      expect(mapper.toTripId(input.PK)).toBe(tripId);
    });

    it('should handle empty PK', () => {
      const input = { PK: '' };
      expect(mapper.toTripId(input.PK)).toBe('');
    });
  });

  describe('toTripDayDTO', () => {
    it('should map all fields correctly', () => {
      const input = {
        date: '2024-01-20',
        itinerary: 'Visit museum',
        reservations: 'Hotel booking',
        lodging: 'Grand Hotel',
        travelTime: '2 hours',
        notes: 'Remember passport'
      };

      const expected: TripDayDTO = {
        date: '2024-01-20',
        itinerary: 'Visit museum',
        reservations: 'Hotel booking',
        lodging: 'Grand Hotel',
        travelTime: '2 hours',
        notes: 'Remember passport'
      };

      expect(mapper.toTripDayDTO(input)).toEqual(expected);
    });
  });

  describe('toTripRecordDTO', () => {
    it('should map all fields correctly including days', () => {
      const input = {
        PK: `${getTripIdPrefix()}${tripId}`,
        SK: '2024-01-20T12:00:00Z',
        name: 'Europe Trip',
        description: 'Summer vacation',
        tags: ['vacation', 'europe'],
        days: [
          {
            date: '2024-01-21',
            itinerary: 'Sightseeing',
            lodging: 'Hotel',
            reservations: 'reservations',
            travelTime: '2.5 hrs',
            notes: 'some notes'
          }
        ],
        isPublic: true,
        sharedWith: ['user1', 'user2'],
        fakeData: false,
        createdAt: '2024-01-19T00:00:00Z',
        createdBy: 'user123'
      };

      const expected: TripRecordDTO = {
        tripId: tripId,
        SK: '2024-01-20T12:00:00Z',
        name: 'Europe Trip',
        description: 'Summer vacation',
        tags: ['vacation', 'europe'],
        days: [
          {
            date: '2024-01-21',
            itinerary: 'Sightseeing',
            lodging: 'Hotel',
            reservations: 'reservations',
            travelTime: '2.5 hrs',
            notes: 'some notes'
          }
        ],
        isPublic: true,
        sharedWith: ['user1', 'user2'],
        fakeData: false,
        createdAt: '2024-01-19T00:00:00Z',
        createdBy: 'user123'
      };

      expect(mapper.toTripRecordDTO(input)).toEqual(expected);
    });

    it('should handle missing days array', () => {
      const input = {
        PK: `${getTripIdPrefix()}${tripId}`,
        SK: '2024-01-20T12:00:00Z',
        name: 'Europe Trip'
      };

      const result = mapper.toTripRecordDTO(input);
      expect(result.days).toEqual([]);
      expect(result.tripId).toBe(tripId);
      expect(result.name).toBe('Europe Trip');
    });

    it('should handle all missing optional fields', () => {
      const input = {
        PK: `${getTripIdPrefix()}${tripId}`,
        SK: '2024-01-20T12:00:00Z'
      };

      const result = mapper.toTripRecordDTO(input);
      expect(result).toEqual({
        tripId: tripId,
        SK: '2024-01-20T12:00:00Z',
        name: undefined,
        description: undefined,
        tags: undefined,
        days: [],
        isPublic: undefined,
        sharedWith: undefined,
        fakeData: undefined,
        createdAt: undefined,
        createdBy: undefined
      });
    });
  });
});