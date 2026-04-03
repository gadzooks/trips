// server/service/inviteService.ts
import { docClient } from '@/lib/dynamodb'

import { 
  UpdateCommand, 
  DeleteCommand, 
  QueryCommand,
  GetCommand,
  PutCommand,
} from "@aws-sdk/lib-dynamodb";
import { ConditionalCheckFailedException } from "@aws-sdk/client-dynamodb";
import { TripServiceError, TripErrorCodes } from '@/types/errors';
import { InviteStatus, Invite } from '@/types/invitation';


export class InviteService {
  // private readonly docClient: DynamoDBDocumentClient;
  // private readonly tableName: string;

  // constructor(docClient: DynamoDBDocumentClient, tableName: string) {
  //   // docClient = docClient;
  //   // process.env.TRIP_PLANNER_TABLE_NAME = tableName;
  // }

  private getInviteKeys(tripId: string, email: string) {
    return {
      PK: `TRIP#${tripId}#INVITES`,
      SK: `#${email}`
    };
  }

  private getGSIKeys(tripId: string, email: string) {
    return {
      GSI1PK: `USER#${email}`,
      GSI1SK: `TRIP#${tripId}`
    };
  }

  private validateEmail(email: string): void {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('Invalid email format:', email);
      throw new TripServiceError(
        'Invalid email format',
        TripErrorCodes.VALIDATION_ERROR,
        400
      );
    }
  }

  private validateStatus(status: string): void {
    if (!Object.values(InviteStatus).includes(status as InviteStatus)) {
      throw new TripServiceError(
        'Invalid invite status',
        TripErrorCodes.INVALID_STATUS,
        400
      );
    }
  }

  async createTripInvite(
    tripId: string,
    email: string,
    invitedBy: string,
    tripMetadata: { name: string; createdAt: string; createdBy: string }
  ): Promise<Invite> {
    try {
      // Validate inputs
      // this.validateEmail(email);
      
      // if (!name?.trim()) {
      //   throw new TripServiceError(
      //     'Name is required',
      //     TripErrorCodes.VALIDATION_ERROR,
      //     400
      //   );
      // }

      const now = new Date().toISOString();
      const keys = this.getInviteKeys(tripId, email);
      const gsiKeys = this.getGSIKeys(tripId, email);

      // Check if invite already exists
      try {
        await this.getInvite(tripId, email);
        throw new TripServiceError(
          'Invite already exists',
          TripErrorCodes.DUPLICATE_INVITE,
          409
        );
      } catch (error) {
        // Only proceed if error is INVITE_NOT_FOUND
        if (!(error instanceof TripServiceError) || 
            error.code !== TripErrorCodes.INVITE_NOT_FOUND) {
          throw error;
        }
      }

      const newInvite: Invite = {
        ...keys,
        ...gsiKeys,
        tripId,
        email,
        // name,
        status: InviteStatus.PENDING,
        invitedAt: now,
        invitedBy
      };

      console.log('Creating new invite:', newInvite);

      const command = new PutCommand({
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
        Item: newInvite,
        ConditionExpression: "attribute_not_exists(PK)", // Ensure no overwrite
      });

      await docClient.send(command);

      // Write INVITEES#{email} item so invited trips appear in the user's MY_TRIPS view
      await docClient.send(new PutCommand({
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
        Item: {
          PK: `INVITEES#${email}`,
          SK: tripId,
          tripId,
          name: tripMetadata.name,
          createdAt: tripMetadata.createdAt,
          createdBy: tripMetadata.createdBy,
        }
      }));

      return newInvite;
    } catch (error) {
      if (error instanceof TripServiceError) {
        throw error;
      }
      if (error instanceof ConditionalCheckFailedException) {
        throw new TripServiceError(
          'Invite already exists',
          TripErrorCodes.DUPLICATE_INVITE,
          409,
          error
        );
      }
      throw new TripServiceError(
        'Failed to create invite',
        TripErrorCodes.DATABASE_ERROR,
        500,
        error
      );
    }
  }

  async getInvite(tripId: string, email: string): Promise<Invite> {
    try {
      const command = new GetCommand({
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
        Key: this.getInviteKeys(tripId, email)
      });

      const response = await docClient.send(command);
      
      if (!response.Item) {
        throw new TripServiceError(
          'Invite not found',
          TripErrorCodes.INVITE_NOT_FOUND,
          404
        );
      }

      return response.Item as Invite;
    } catch (error) {
      if (error instanceof TripServiceError) {
        throw error;
      }
      throw new TripServiceError(
        'Failed to get invite',
        TripErrorCodes.DATABASE_ERROR,
        500,
        error
      );
    }
  }

  async updateTripInvite(
    tripId: string,
    email: string,
    status: InviteStatus,
    updatedBy: string
  ): Promise<Invite> {
    try {
      // Validate inputs
      this.validateEmail(email);
      this.validateStatus(status);

      // Check if invite exists
      await this.getInvite(tripId, email);

      const now = new Date().toISOString();
      const keys = this.getInviteKeys(tripId, email);
      const gsiKeys = this.getGSIKeys(tripId, email);

      const command = new UpdateCommand({
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
        Key: keys,
        UpdateExpression: "SET #status = :status, #respondedAt = :respondedAt, #gsi1pk = :gsi1pk, #gsi1sk = :gsi1sk",
        ExpressionAttributeNames: {
          "#status": "status",
          "#respondedAt": "respondedAt",
          "#gsi1pk": "GSI1PK",
          "#gsi1sk": "GSI1SK"
        },
        ExpressionAttributeValues: {
          ":status": status,
          ":respondedAt": now,
          ":gsi1pk": gsiKeys.GSI1PK,
          ":gsi1sk": gsiKeys.GSI1SK
        },
        ReturnValues: "ALL_NEW",
        ConditionExpression: "attribute_exists(PK)" // Ensure item exists
      });

      const response = await docClient.send(command);
      return response.Attributes as Invite;
    } catch (error) {
      if (error instanceof TripServiceError) {
        throw error;
      }
      if (error instanceof ConditionalCheckFailedException) {
      // if (error instanceof ConditionalCheckFailedException) {
        throw new TripServiceError(
          'Invite not found',
          TripErrorCodes.INVITE_NOT_FOUND,
          404,
          error
        );
      }
      throw new TripServiceError(
        'Failed to update invite',
        TripErrorCodes.DATABASE_ERROR,
        500,
        error
      );
    }
  }

  async deleteTripInvite(tripId: string, email: string): Promise<void> {
    try {
      this.validateEmail(email);

      // Check if invite exists first
      await this.getInvite(tripId, email);

      const command = new DeleteCommand({
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
        Key: this.getInviteKeys(tripId, email),
        ConditionExpression: "attribute_exists(PK)" // Ensure item exists
      });

      await docClient.send(command);
    } catch (error) {
      if (error instanceof TripServiceError) {
        throw error;
      }
      if (error instanceof ConditionalCheckFailedException) {
        throw new TripServiceError(
          'Invite not found',
          TripErrorCodes.INVITE_NOT_FOUND,
          404,
          error
        );
      }
      throw new TripServiceError(
        'Failed to delete invite',
        TripErrorCodes.DATABASE_ERROR,
        500,
        error
      );
    }
  }

  async getTripInvites(tripId: string): Promise<Invite[]> {
    try {
      const command = new QueryCommand({
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
        KeyConditionExpression: "PK = :pk",
        ExpressionAttributeValues: {
          ":pk": `TRIP#${tripId}#INVITES`
        }
      });

      const response = await docClient.send(command);
      return response.Items as Invite[];
    } catch (error) {
      throw new TripServiceError(
        'Failed to get trip invites',
        TripErrorCodes.DATABASE_ERROR,
        500,
        error
      );
    }
  }

  async getUserInvites(email: string): Promise<Invite[]> {
    try {
      this.validateEmail(email);

      const command = new QueryCommand({
        TableName: process.env.TRIP_PLANNER_TABLE_NAME,
        IndexName: "GSI1",
        KeyConditionExpression: "GSI1PK = :pk",
        ExpressionAttributeValues: {
          ":pk": `USER#${email}`
        }
      });

      const response = await docClient.send(command);
      return response.Items as Invite[];
    } catch (error) {
      if (error instanceof TripServiceError) {
        throw error;
      }
      throw new TripServiceError(
        'Failed to get user invites',
        TripErrorCodes.DATABASE_ERROR,
        500,
        error
      );
    }
  }
}