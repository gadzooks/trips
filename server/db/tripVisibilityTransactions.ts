// app/api/services/createTrip/tripVisibilityTransactions.ts
import { TransactWriteCommandInput } from '@aws-sdk/lib-dynamodb';
import { UpdateTripAttributeRequest } from '@/app/components/ui/utils/updateTrip';
import { extractTagsFromTripData } from '@/lib/tags';

export function createVisibilityTransactions(request: UpdateTripAttributeRequest):
  NonNullable<TransactWriteCommandInput['TransactItems']> {
  const transactItems: TransactWriteCommandInput['TransactItems'] = [];

  // Update main trip record
  transactItems.push({
    Update: {
      TableName: process.env.TRIP_PLANNER_TABLE_NAME!,
      Key: {
        PK: `TRIP#${request.tripId}`,
        SK: request.createdAt
      },
      UpdateExpression: 'SET isPublic = :isPublic',
      ExpressionAttributeValues: {
        ':isPublic': request.attributeValue
      }
    }
  });

  // console.log('transactItems here : ', JSON.stringify(transactItems, null, 2));

  // Handle tag records if they exist

  const allTags: string[] = extractTagsFromTripData(request.tags);
  if (allTags.length > 0) {
    allTags.forEach(tag => {
      // Delete old tag records
      transactItems.push({
        Delete: {
          TableName: process.env.TRIP_PLANNER_TABLE_NAME!,
          Key: {
            PK: `TAG#${request.attributeValue ? 'PRIVATE' : 'PUBLIC'}#${tag}`,
            SK: request.tripId
          }
        }
      });

      // Create new tag records
      transactItems.push({
        Put: {
          TableName: process.env.TRIP_PLANNER_TABLE_NAME!,
          Item: {
            PK: `TAG#${request.attributeValue ? 'PUBLIC' : 'PRIVATE'}#${tag}`,
            SK: request.tripId,
            createdAt: request.createdAt,
            createdBy: request.createdBy,
            tripId: request.tripId
          }
        }
      });
    });
  }

  if (!request.attributeValue) {
    // Delete old public tag record
    transactItems.push({
      Delete: {
        TableName: process.env.TRIP_PLANNER_TABLE_NAME!,
        Key: {
          PK: `TAG#PUBLIC`,
          SK: request.tripId
        }
      }
    });
  } else {
    // Create new public tag record
    transactItems.push({
      Put: {
        TableName: process.env.TRIP_PLANNER_TABLE_NAME!,
        Item: {
          PK: `TAG#PUBLIC`,
          SK: request.tripId,
          createdAt: request.createdAt,
          createdBy: request.createdBy,
          tripId: request.tripId
        }
      }
    });
  }


  return transactItems;
}