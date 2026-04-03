// server/service/createTripDbService.ts

import { docClient } from "@/lib/dynamodb";
import { MinimumTripRecord, TripDayDTO, TripRecordDTO } from "@/types/trip";
import { QueryCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { queryByTag, queryByTripId, queryByTagPaginated, queryByCreatedBy, queryByInvitee } from "../db/queryTripTransactions";
import { PaginationParams } from "@/types/pagination";
import { createTripTransactions } from "../db/createTripTransactions";
import { getTripIdPrefix } from "../db/dbKeys";

export class CreateTripDbService {
    async createTrip(tripData: TripRecordDTO, userId: string): Promise<string> {
        const { tripId, transactItems } = createTripTransactions(tripData, userId);
        // console.log('transactItems', JSON.stringify(transactItems, null, 2));
        try {
            await docClient.send(new TransactWriteCommand({ TransactItems: transactItems }));
          } catch (error) {
            const dynamoError = error as { CancellationReasons?: Array<{ Code: string, Message: string, Item: any }> };
            if (dynamoError?.CancellationReasons) {
              console.error('Transaction Cancellation Details:');
              dynamoError.CancellationReasons.forEach((reason, index) => {
                console.error(`Item ${index}:`, {
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
    // console.log('response', JSON.stringify(response, null, 2));
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

  async getByInvitee(email: string, { limit }: PaginationParams): Promise<MinimumTripRecord[]> {
    if (!email) return [];
    const params = queryByInvitee(email, limit);
    const response = await docClient.send(new QueryCommand(params));
    return (response.Items || []).map(this.mapToMinimumTripRecord);
  }

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
      tripId: this.toTripId(item.PK.toString()),
      SK: item.SK,
      name: item.name,
      description: item.description,
      tags: item.tags,
      days: days,
      isPublic: item.isPublic,
      invitees: item.invitees,
      fakeData: item.fakeData,
      createdAt: item.createdAt,
      createdBy: item.createdBy
    };
  }

  toTripId(pk: string): string {
    // remove the prefix along with # separator from PK
    return (pk || '').slice(getTripIdPrefix().length);
  }

  toTripDayDTO(item: Record<string, any>): TripDayDTO {
    return {
      date: item.date,
      itinerary: item.itinerary,
      reservations: item.reservations,
      lodging: item.lodging,
      travelTime: item.travelTime,
      notes: item.notes,
      cost: item.cost || '',
      cancelBy: item.cancelBy || '',
    };
  }

  mapToMinimumTripRecord(item: Record<string, any>): MinimumTripRecord {
    return {
      name: item.name,
      tripId: item.tripId,
      createdAt: item.createdAt,
      updatedAt: item.updatedAt,
      startDate: item.startDate,
      endDate: item.endDate,
      createdBy: item.createdBy
    };
   };
}

