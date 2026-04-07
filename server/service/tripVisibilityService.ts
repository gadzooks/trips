// app/api/services/tripVisibilityService.ts

import { UpdateCommand } from '@aws-sdk/lib-dynamodb'
import { docClient } from '@/lib/dynamodb';
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { createVisibilityTransactions } from '../db/tripVisibilityTransactions';
import { UpdateTripAttributeRequest } from '@/app/components/ui/utils/updateTrip';
import { UpdateTripDbService } from '../db/updateTripTransactions';
import { getTripIdPk, getOwnerWithDbPK } from '../db/dbKeys';
import { TripDayDTO } from '@/types/trip';

const updateTripDbService = new UpdateTripDbService()

export class TripVisibilityService {
  async updateTripAtributes(body: UpdateTripAttributeRequest, userId: string): Promise<void> {

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

      // Update the CREATEDBY index record so the list view reflects the latest updatedAt / dates
      const now = new Date().toISOString();
      let createdByUpdateExpr = 'SET updatedAt = :now';
      const createdByExprValues: Record<string, any> = { ':now': now };

      if (body.attributeKey === 'days') {
        const dateDays = (body.attributeValue as TripDayDTO[]).map(d => ({ date: d.date }));
        createdByUpdateExpr += ', days = :days';
        createdByExprValues[':days'] = dateDays;
      }

      await docClient.send(new UpdateCommand({
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
        Key: {
          PK: getOwnerWithDbPK(userId),
          SK: body.tripId
        },
        UpdateExpression: createdByUpdateExpr,
        ExpressionAttributeValues: createdByExprValues,
      }));

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
  }
}