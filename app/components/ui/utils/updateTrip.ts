// app/components/ui/utils/updateTrip.ts

import { TripDayDTO } from "@/types/trip";

interface TripUpdateResponse {
    success: boolean;
    error?: string;
  }
  
  export interface UpdateTripAttributeRequest {
    tripId: string;
    SK: string;
    attributeKey: string;
    attributeValue: string | boolean | string[] | TripDayDTO[] | undefined;
  }
  
  export const updateTripAttribute = async (
    { tripId, SK, attributeKey, attributeValue }: UpdateTripAttributeRequest
  ): Promise<TripUpdateResponse> => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'SK': SK,
          'attributeKey': attributeKey,
          // @ts-ignore
          'attributeValue': attributeKey === 'tags' ? attributeValue.split(' ') : attributeValue
        })
      });
  
      if (!response.ok) {
        throw new Error('Failed to update field');
      }
  
      return { success: true };
    } catch (error) {
      console.error(`Failed to update ${attributeKey}:`, error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }