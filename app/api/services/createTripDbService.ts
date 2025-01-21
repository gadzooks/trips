// app/api/services/createTripDbService.ts

import { docClient } from "@/lib/dynamodb";
import { MinimumTripRecord, TripDayDTO, TripRecordDTO } from "@/types/trip";
import { QueryCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { createTripTransactions, queryByTag, queryByTripId, queryByTagPaginated, queryByCreatedBy } from "./createTrip/createTransactions";
import { PaginationParams } from "@/types/pagination";

export class CreateTripDbService {
    async createTrip(tripData: TripRecordDTO, userId: string): Promise<string> {
        const { tripId, transactItems } = createTripTransactions(tripData, userId);
        // console.log('transactItems', JSON.stringify(transactItems, null, 2));
        try {
            await docClient.send(new TransactWriteCommand({ TransactItems: transactItems }));
          } catch (error) {
            const dynamoError = error as { CancellationReasons?: Array<{ Code: string, Message: string, Item: any }> };
            if (dynamoError?.CancellationReasons) {
              console.log('Transaction Cancellation Details:');
              dynamoError.CancellationReasons.forEach((reason, index) => {
                console.log(`Item ${index}:`, {
                  Code: reason.Code,
                  Message: reason.Message,
                  Item: reason.Item
                });
              });
            }
            throw error;
          }
        return tripId;
    }

  async getByTag(tag: string, isPublic: boolean, limit = 10): Promise<MinimumTripRecord[]> {
    const params = queryByTag(tag, isPublic, limit)

    // console.log('params', JSON.stringify(params, null, 2));
    const response = await docClient.send(new QueryCommand(params))
    return (response.Items || []).map(this.mapToMinimumTripRecord);
  }

  async getByUser(userId: string, { limit }: PaginationParams): Promise<MinimumTripRecord[]> {
    if (!userId || userId === '') {
      return [];
    }
    const params = queryByCreatedBy(userId, limit)

    // console.log('params', JSON.stringify(params, null, 2));
    const response = await docClient.send(new QueryCommand(params))
    return (response.Items || []).map(this.mapToMinimumTripRecord);
  }

//   async getByTagPaginated(
//     tag: string, 
//     isPublic: boolean, 
//     { page, limit }: PaginationParams
// ): Promise<PaginatedResult<MinimumTripRecord>> {
//     const params = queryByTagPaginated(tag, isPublic, limit);
//     const response = await docClient.send(new QueryCommand(params));
    
//     return {
//         items: (response.Items || []).map(this.mapToTripRecordDTO),
//         lastEvaluatedKey: response.LastEvaluatedKey,
//         count: response.Count || 0,
//         scannedCount: response.ScannedCount || 0
//     };
// }

  //FIXME add return type
  async getTripById(tripId: string) {
    const params = queryByTripId(tripId)

    const result = await docClient.send(new QueryCommand(params))
    const item = result.Items?.[0]

    if (!item) {
      return null
    }

    return this.toTripRecordDTO(item);
  }

  toTripRecordDTO(item: Record<string, any>): TripRecordDTO {
    const days:TripDayDTO[] = [];
    (item.days || []).forEach((day: Record<string, any>) => {
      days.push(this.toTripDayDTO(day));
    });

    return {
      tripId: item.PK,
      timestamp: item.SK,
      name: item.name,
      description: item.description,
      tags: item.tags,
      days: days,
      isPublic: item.isPublic,
      sharedWith: item.sharedWith,
      fakeData: item.fakeData,
      createdAt: item.createdAt,
      createdBy: item.createdBy
    };
  }

  toTripDayDTO(item: Record<string, any>): TripDayDTO {
    return {
      date: item.date,
      itinerary: item.itinerary,
      reservations: item.reservations,
      lodging: item.lodging,
      travelTime: item.travelTime,
      notes: item.notes
    };
  }

  mapToMinimumTripRecord(item: Record<string, any>): MinimumTripRecord {
    return {
      name: item.name,
      isPublic: item.isPublic,
      tripId: item.tripId,
      createdAt: item.createdAt,
      createdBy: item.createdBy
    };
   };
}

