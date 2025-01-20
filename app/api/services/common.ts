// app/api/services/common.ts
export const TABLE_NAME = 'TripPlanner'

export function timestampIsoFormat(date: Date) {
  return date.toISOString()
}