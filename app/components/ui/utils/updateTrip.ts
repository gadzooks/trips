// app/components/ui/utils/updateTrip.ts

interface TripUpdateResponse {
    success: boolean;
    error?: string;
  }
  
  export interface UpdateTripAttributeRequest {
    tripId: string;
    SK: string;
    attributeKey: string;
    attributeValue: string | boolean | number;
  }
  
  export const updateTripAttribute = async (
    { tripId, SK, attributeKey, attributeValue }: UpdateTripAttributeRequest
  ): Promise<TripUpdateResponse> => {
    try {
      // console.log('updatetripattribute tripId is : ', tripId)
      const response = await fetch(`/api/trips/${tripId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          'SK': SK,
          'attributeKey': attributeKey,
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