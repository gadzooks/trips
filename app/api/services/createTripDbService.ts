
import { docClient } from "@/lib/dynamodb";
import { TripRecordDTO } from "@/types/trip";
import { QueryCommand, TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { createTripTransactions, queryByTripId } from "./createTrip/createTransactions";

export class CreateTripDbService {
    async getTripByTripIdAndUser(tripId: string) {
      throw new Error('Method not implemented.');
    }

    async createTrip(tripData: TripRecordDTO, userId: string): Promise<string> {
        const { tripId, timestamp, transactItems } = createTripTransactions(tripData, userId);
        console.log('transactItems', JSON.stringify(transactItems, null, 2));
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

    async getTripById(tripId: string) {
        console.log("getTripByOwnerTripIdTimestamp with inputs tripId: ", tripId)
        const params = queryByTripId(tripId)
       
        const result = await docClient.send(new QueryCommand(params))
        console.log("getTripByTripIdAndUser result: ", result)
        const item = result.Items?.[0]
       
        if (!item) {
          return null
        }

        return item;
    }

    // async unShareWithUser(tripId: string, userId: string) {
    //     await dynamoDbClient.delete({
    //         TableName: tableName,
    //         Key: {
    //             PK: `USER#user1`,
    //             SK: `TRIP#${timestamp}#${tripId}`,
    //             GSI2PK: `USER#user3`  // Remove sharing for user3
    //         }
    //     });
    // }
    // FIXME delete all records
}
