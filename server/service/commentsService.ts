// server/service/commentsService.ts

import { queryTripCommentById, queryTripComments } from "../db/invitationTransactions";
import { docClient } from "@/lib/dynamodb";
import { DeleteCommand, PutCommand, QueryCommand, TransactWriteCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { ulid } from "ulid";

export const CommentsService = {
  // Get all comments for a trip
  async getTripComments(
    tripId: string, 
    options: { limit?: number; before?: string | null } = {}
  ) {
    const { limit = 50, before = null } = options;
    
    const params = queryTripComments(tripId, limit, before);
    const response = await docClient.send(new QueryCommand(params));
    return response.Items || [];
  },
  
  // Get a specific comment
  async getTripComment(tripId: string, commentId: string) {
    const params = queryTripCommentById(tripId, commentId);
    const response = await docClient.send(new QueryCommand(params));
    return response.Items?.[0] || null;
  },
  
  // Create a new comment
  async createTripComment({
    tripId,
    userId,
    userName,
    content,
    parentCommentId = null,
    isSystem = false
  }: {
    tripId: string
    userId: string
    userName: string
    content: string
    parentCommentId?: string | null
    isSystem?: boolean
  }) {
    const timestamp = new Date().toISOString();
    const commentId = ulid(); // lexicographically sortable ID
    
    const comment = {
      PK: `TRIP#${tripId}#COMMENTS`,
      SK: `#${timestamp}#${userId}`,
      commentId,
      userId,
      userName,
      content,
      timestamp,
      isSystem,
      // GSI1PK: `TRIP#${tripId}`,
      // GSI1SK: `ACTIVITY#${timestamp}`
    };
    
    // if (parentCommentId) {
    //   comment.parentCommentId = parentCommentId;
    // }
    
    const params = {
      TableName: process.env.TRIP_PLANNER_TABLE_NAME,
      Item: comment
    };
    
    await docClient.send(new PutCommand(params));
    return comment;
  },
  
  // Update a comment
  async updateTripComment(
    tripId: string, 
    commentId: string, 
    updates: { content: string }
  ) {
    // First get the comment to know its SK
    const comment = await this.getTripComment(tripId, commentId);
    
    if (!comment) {
      throw new Error('Comment not found');
    }
    
    const params = {
      TableName: process.env.TRIP_PLANNER_TABLE_NAME,
      Key: {
        PK: `TRIP#${tripId}#COMMENTS`,
        SK: comment.SK
      },
      UpdateExpression: 'SET content = :content, updatedAt = :updatedAt',
      ExpressionAttributeValues: {
        ':content': updates.content,
        ':updatedAt': new Date().toISOString()
      },
      ReturnValues: 'ALL_NEW' as const
    };
    
    const result = await docClient.send(new UpdateCommand(params));
    return result.Attributes;
  },
  
  // Delete a comment
  async deleteTripComment(tripId: string, commentId: string) {
    // First get the comment to know its SK
    const comment = await this.getTripComment(tripId, commentId);
    
    if (!comment) {
      throw new Error('Comment not found');
    }
    
    const params = {
      TableName: process.env.TRIP_PLANNER_TABLE_NAME,
      Key: {
        PK: `TRIP#${tripId}#COMMENTS`,
        SK: comment.SK
      }
    };
    
    await docClient.send(new DeleteCommand(params));
    return true;
  },
  
  // Create a system comment (e.g., for invite status updates)
  async createSystemComment({
    tripId,
    content
  }: {
    tripId: string
    content: string
  }) {
    return this.createTripComment({
      tripId,
      userId: 'system',
      userName: 'System',
      content,
      isSystem: true
    });
  }
};