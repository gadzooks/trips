// app/api/services/updateTripDbService.ts
export class UpdateTripDbService {
// Helper function to build the update expression
    buildUpdateExpression(
        attributeKey: string,
        attributeValue: any
    ): {
        updateExpression: string;
        expressionAttributeValues: Record<string, any>;
        expressionAttributeNames: Record<string, string>;
    } {
        // Validate that attributeKey is a valid property of TripRecord
        const validTopLevelKeys = [
            'name', 'description', 'isPublic', 'sharedWith',
            'tags', 'days'
        ];

        if (!validTopLevelKeys.includes(attributeKey)) {
            throw new Error(`Invalid attribute key: ${attributeKey}`);
        }

        // Special handling for arrays and complex types
        if (attributeKey === 'days') {
            // Validate days array structure
            if (!Array.isArray(attributeValue) || !this.validateDaysArray(attributeValue)) {
                throw new Error('Invalid days array structure');
            }
        }

        if (attributeKey === 'sharedWith' || attributeKey === 'tags') {
            // Validate array input
            if (!Array.isArray(attributeValue)) {
                throw new Error(`${attributeKey} must be an array`);
            }

            attributeValue = attributeValue.filter((tag: string) => tag.trim().length > 0);
        }

        return {
            updateExpression: `SET #${attributeKey} = :${attributeKey}`,
            expressionAttributeValues: {
                [`:${attributeKey}`]: attributeValue
            },
            expressionAttributeNames: {
                [`#${attributeKey}`]: attributeKey
            }
        };
    }

  // Helper function to validate days array structure
  validateDaysArray(days: any[]): boolean {
    return days.every(day => {
        return (
            typeof day.date === 'string' &&
            typeof day.itinerary === 'string' &&
            typeof day.reservations === 'string' &&
            typeof day.lodging === 'string' &&
            typeof day.driveTimes === 'string' &&
            typeof day.notes === 'string'
        );
    });
}
}