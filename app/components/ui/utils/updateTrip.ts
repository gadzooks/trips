// app/components/ui/utils/updateTrip.ts

import { extractTagsFromTripData } from "@/lib/tags";
import { TripDayDTO } from "@/types/trip";

interface TripUpdateResponse {
    success: boolean;
    error?: string;
  }
  
  export interface UpdateTripAttributeRequest {
    createdAt: string;
    createdBy: string;
    tripId: string;
    attributeKey: string;
    attributeValue: string | boolean | string[] | TripDayDTO[] | undefined;
    tags: string;
  }
  
  export const updateTripAttribute = async (
    { tripId, createdAt, createdBy, attributeKey, attributeValue, tags }: UpdateTripAttributeRequest
  ): Promise<TripUpdateResponse> => {
    try {
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tripId,
          'SK': createdAt,
          'createdAt': createdAt,
          'createdBy': createdBy,
          'attributeKey': attributeKey,
          // @ts-ignore
          'attributeValue': attributeKey === 'tags' ? extractTagsFromTripData(attributeValue) : attributeValue,
          'tags': tags
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