// app/api/services/tripVisibilityService.ts

import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '@/lib/dynamodb';
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { createVisibilityTransactions } from '../db/tripVisibilityTransactions';
import { UpdateTripAttributeRequest } from '@/app/components/ui/utils/updateTrip';
import { UpdateTripDbService } from '../db/updateTripTransactions';
import { getTripIdPk } from '../db/dbKeys';

const updateTripDbService = new UpdateTripDbService()

export class TripVisibilityService {
  async updateTripAtributes(body: UpdateTripAttributeRequest): Promise<void> {

    if (body.attributeKey !== 'isPublic') {

      // Create the update expression and attribute values
      const { updateExpression, expressionAttributeValues, expressionAttributeNames } =
        updateTripDbService.buildUpdateExpression(body.attributeKey, body.attributeValue);

      const updateCommand = {
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
        Key: {
          PK: `${getTripIdPk(body.tripId)}`,
          SK: body.createdAt
        },
        UpdateExpression: updateExpression,
        ExpressionAttributeValues: expressionAttributeValues,
        ExpressionAttributeNames: expressionAttributeNames,
        ConditionExpression: "attribute_exists(PK)",
        ReturnValues: "ALL_NEW" as const
      };

      // console.log('Update command:', updateCommand);

      await docClient.send(new UpdateCommand(updateCommand));
    } else {
      await this.updateTripVisibility(body); 
    }
  }

  async updateTripVisibility(request: UpdateTripAttributeRequest): Promise<void> {
    
    const transactItems = createVisibilityTransactions(request);
    // console.log('tripData', JSON.stringify(request, null, 2));
    // console.log('transactItems : ', JSON.stringify(transactItems, null, 2));

    // If no updates needed (visibility hasn't changed), return early
    if (transactItems === undefined || transactItems.length === 0) {
      return;
    }

    try {
      await docClient.send(
        new TransactWriteCommand({
          TransactItems: transactItems
        })
      );
    } catch (error) {
      const dynamoError = error as {
        CancellationReasons?: Array<{
          Code: string;
          Message: string;
          Item: any;
        }>;
      };

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
  }
}