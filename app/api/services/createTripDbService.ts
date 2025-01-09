
import { docClient } from "@/lib/dynamodb";
import { CreateTripBody } from "@/types/trip";
import { TransactWriteCommand } from "@aws-sdk/lib-dynamodb";
import { createTripTransactions } from "./createTrip/createTransactions";

export class CreateTripDbService {

    async createTrip(tripData: CreateTripBody, userId: string) {
        const { tripId, transactItems } = createTripTransactions(tripData, userId);
        await docClient.send(new TransactWriteCommand({ TransactItems: transactItems }));
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
