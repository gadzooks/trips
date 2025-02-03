// app/api/services/tripVisibilityService.ts

import { docClient } from '@/lib/dynamodb';
import { TripRecord } from '@/types/trip';
import { TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { createVisibilityTransactions } from './createTrip/tripVisibilityTransactions';
import { UpdateTripAttributeRequest } from '@/app/components/ui/utils/updateTrip';

export class TripVisibilityService {
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