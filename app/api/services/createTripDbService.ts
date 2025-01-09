
import { docClient } from "@/lib/dynamodb";
import { CreateTripBody } from "@/types/trip";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { createTripTransactions } from "./createTrip/createTransactions";

export class CreateTripDbService {

    async createTrip(tripData: CreateTripBody, userId: string) {
        const { tripId, transactItems } = createTripTransactions(tripData, userId);
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
