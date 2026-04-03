// server/db/invitationTransactions.ts

// Helper functions for query parameters
export function queryTripComments(tripId: string, limit: number = 50, before: string | null = null) {
  const params: {
    TableName: string | undefined;
    KeyConditionExpression: string;
    ExpressionAttributeValues: { ':pk': string; ':before'?: string };
    ScanIndexForward: boolean;
    Limit: number;
  } = {
    TableName: process.env.TRIP_PLANNER_TABLE_NAME,
    KeyConditionExpression: 'PK = :pk',
    ExpressionAttributeValues: {
      ':pk': `TRIP#${tripId}#COMMENTS`
    },
    ScanIndexForward: false, // Sort by most recent first
    Limit: limit
  };
  
  // If 'before' timestamp is provided, use it for pagination
  if (before) {
    params.KeyConditionExpression += ' AND SK < :before';
    params.ExpressionAttributeValues[':before'] = before;
  }
  
  return params;
}

export function queryTripCommentById(tripId: string, commentId: string) {
  return {
    TableName: process.env.TRIP_PLANNER_TABLE_NAME,
    KeyConditionExpression: 'PK = :pk',
    FilterExpression: 'commentId = :commentId',
    ExpressionAttributeValues: {
      ':pk': `TRIP#${tripId}#COMMENTS`,
      ':commentId': commentId
    }
  };
}