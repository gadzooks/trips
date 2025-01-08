// src/services/tripService.ts

import { CreateTripBody, ReorderDaysBody, InsertDaysBody, DeleteDaysBody } from '@/types/trip'
import { TripDbService } from './tripDbService'

export class TripService {
  constructor(private dbService: TripDbService) {}

  async createTrip(body: CreateTripBody, userId: string) {
    const tripId = await this.dbService.createTrip(body, userId)
    return { tripId }
  }

  // FIXME: revist this logic of reordering days
  // FIXME: a lot of this with PK and SK should go to the dbService
  async reorderDays(body: ReorderDaysBody, userId: string) {
    const { tripId, moves } = body

    const { allowed, reason } = await this.dbService.validateTripAccess(tripId, userId, true)
    if (!allowed) {
      throw new Error(reason)
    }

    const days = await this.dbService.getTripDays(tripId)
    
    // Create a map of current positions
    const currentPositions = new Map(
      days.map(day => [day.SK.replace('DAY#', ''), day.ordinal])
    )

    // Apply all moves
    moves.forEach(({ dayId, newPosition }) => {
      const currentPosition = currentPositions.get(dayId)
      if (currentPosition === undefined) return

      days.forEach(day => {
        const dayOrdinal = day.ordinal
        if (currentPosition < newPosition) {
          if (dayOrdinal > currentPosition && dayOrdinal <= newPosition) {
            day.ordinal--
            day.SK = `DAY#${String(day.ordinal).padStart(6, '0')}`
          }
        } else {
          if (dayOrdinal >= newPosition && dayOrdinal < currentPosition) {
            day.ordinal++
            day.SK = `DAY#${String(day.ordinal).padStart(6, '0')}`
          }
        }

        if (day.SK === `DAY#${dayId}`) {
          day.ordinal = newPosition
          day.SK = `DAY#${String(newPosition).padStart(6, '0')}`
        }
      })
    })

    const timestamp = new Date().toISOString()
    const transactItems = days.map(day => ({
      Put: {
        TableName: 'TripPlanner',
        Item: {
          ...day,
          updatedAt: timestamp
        }
      }
    }))

    await this.dbService.executeBatchWrite(transactItems)
  }

  async insertDays(body: InsertDaysBody, userId: string) {
    const { tripId, days } = body

    const { allowed, reason } = await this.dbService.validateTripAccess(tripId, userId, true)
    if (!allowed) {
      throw new Error(reason)
    }

    const existingDays = await this.dbService.getTripDays(tripId)
    existingDays.sort((a, b) => a.ordinal - b.ordinal)

    const timestamp = new Date().toISOString()
    const transactItems = []

    for (const newDay of days) {
      // Shift existing days to make room
      for (const day of existingDays) {
        if (day.ordinal >= newDay.position) {
          day.ordinal += 1
          day.SK = `DAY#${String(day.ordinal).padStart(6, '0')}`
          transactItems.push({
            Put: {
              TableName: 'TripPlanner',
              Item: {
                ...day,
                updatedAt: timestamp
              }
            }
          })
        }
      }

      // Insert new day
      transactItems.push({
        Put: {
          TableName: 'TripPlanner',
          Item: {
            PK: `TRIP#${tripId}`,
            SK: `DAY#${String(newDay.position).padStart(6, '0')}`,
            ordinal: newDay.position,
            date: newDay.date,
            activity: newDay.activity,
            bookings: newDay.bookings,
            stay: newDay.stay,
            travelTime: newDay.travelTime,
            createdAt: timestamp,
            updatedAt: timestamp
          }
        }
      })

      existingDays.push({
        ordinal: newDay.position,
        SK: `DAY#${String(newDay.position).padStart(6, '0')}`
      })
      existingDays.sort((a, b) => a.ordinal - b.ordinal)
    }

    await this.dbService.executeBatchWrite(transactItems)
  }

  async deleteDays(body: DeleteDaysBody, userId: string) {
    const { tripId, dayIds } = body

    const { allowed, reason } = await this.dbService.validateTripAccess(tripId, userId, true)
    if (!allowed) {
      throw new Error(reason)
    }

    const allDays = await this.dbService.getTripDays(tripId)
    const timestamp = new Date().toISOString()

    const deletedPositions = new Set(
      dayIds.map(id => {
        const day = allDays.find(d => d.SK === `DAY#${id}`)
        return day?.ordinal
      }).filter(pos => pos !== undefined)
    )

    const transactItems: any[] = []

    // Delete specified days
    dayIds.forEach(dayId => {
      transactItems.push({
        Delete: {
          TableName: 'TripPlanner',
          Key: {
            PK: `TRIP#${tripId}`,
            SK: `DAY#${dayId}`
          }
        }
      })
    })

    // Reorder remaining days
    allDays
      .filter(day => !dayIds.includes(day.SK.replace('DAY#', '')))
      .forEach(day => {
        let newOrdinal = day.ordinal
        deletedPositions.forEach(pos => {
          if (pos < day.ordinal) {
            newOrdinal--
          }
        })

        if (newOrdinal !== day.ordinal) {
          transactItems.push({
            Put: {
              TableName: 'TripPlanner',
              Item: {
                ...day,
                ordinal: newOrdinal,
                SK: `DAY#${String(newOrdinal).padStart(6, '0')}`,
                updatedAt: timestamp
              }
            }
          })
        }
      })

    await this.dbService.executeBatchWrite(transactItems)
  }
}