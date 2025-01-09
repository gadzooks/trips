import exp from "constants"

export const TABLE_NAME = 'TripPlanner'

// export function getDynamoDbKeyByUserId(userId: string, tripId: string) {
//   return `USER#${userId}#TRIP${tripId}`
// }

// export function getDynamoDbKeyByTripId(tripId: string) {
//   return `TRIP#${tripId}`
// }

// export function getDynamoDbKeyByTimestamp(timestamp: string) {
//   return `TRIP#${timestamp}`
// }

// export function getDynamoDbKeyForPublicStatusByTripId(tripId: string) {
//   return `STATUS#PUBLIC#${tripId}`
// }

// export function getDynamoDbKeyByTagAndTripId(tag: string, tripId: string) {
//   return `TAG#${tag}#${tripId}`
// }

export function timestampIsoFormat(date: Date) {
  return date.toISOString()
}