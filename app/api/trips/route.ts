import { PutCommand, QueryCommand, TransactWriteCommand, DeleteCommand } from '@aws-sdk/lib-dynamodb'
import { NextResponse } from 'next/server'
import { docClient } from '@/lib/dynamodb'

const TABLE_NAME = 'TripPlanner'

interface CreateTripBody {
  title: string
  description: string
  isPublic: boolean
  tags?: string[]
  days?: Array<{
    date: string
    activity: string
    bookings: string
    stay: string
    travelTime: string
  }>
}

interface ReorderDaysBody {
  tripId: string
  moves: Array<{
    dayId: string
    newPosition: number
  }>
}

interface InsertDaysBody {
  tripId: string
  days: Array<{
    position: number
    date: string
    activity: string
    bookings: string
    stay: string
    travelTime: string
  }>
}

interface DeleteDaysBody {
  tripId: string
  dayIds: string[]
}

async function validateTripAccess(tripId: string, userId: string, requireOwnership: boolean = false) {
  try {
    const result = await docClient.send(new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `TRIP#${tripId}`,
        ':sk': 'USER#'
      }
    }))

    const trip = result.Items?.[0]
    if (!trip) {
      return { allowed: false, reason: 'Trip not found' }
    }

    // Check if user is the owner
    const isOwner = trip.userId === userId
    
    if (requireOwnership && !isOwner) {
      return { allowed: false, reason: 'Operation requires trip ownership' }
    }

    // Allow access if:
    // 1. User is the owner
    // 2. Trip is public
    // 3. Trip is shared with the user
    const hasAccess = isOwner || 
      trip.isPublic || 
      (trip.sharedWith && trip.sharedWith[userId])

    return {
      allowed: hasAccess,
      reason: hasAccess ? 'Access granted' : 'Access denied'
    }
  } catch (error) {
    console.error('Failed to validate trip access:', error)
    return { allowed: false, reason: 'Error validating access' }
  }
}

export async function POST(request: Request) {
  const body: CreateTripBody = await request.json()
  const timestamp = new Date().toISOString()
  const tripId = crypto.randomUUID()
  const userId = 'test-user' // Replace with session.user.id
  
  try {
    const transactItems = [
      // Main trip record
      {
        Put: {
          TableName: TABLE_NAME,
          Item: {
            PK: `TRIP#${tripId}`,
            SK: `USER#${userId}`,
            tripId,
            userId,
            title: body.title,
            description: body.description,
            isPublic: body.isPublic,
            isDeleted: false,
            createdAt: timestamp,
            updatedAt: timestamp,
            ...(body.isPublic && {
              'GSI1-PK': 'STATUS#PUBLIC',
              'GSI1-SK': `TRIP#${timestamp}`
            })
          }
        }
      },
      
      // Tag records
      ...(body.tags?.map(tag => ({
        Put: {
          TableName: TABLE_NAME,
          Item: {
            PK: `TAG#${tag}`,
            SK: `TRIP#${tripId}`,
            tripId,
            'GSI1-PK': `TRIP#${tripId}`,
            'GSI1-SK': `TAG#${tag}`,
            createdAt: timestamp
          }
        }
      })) ?? []),

      // Day records with ordering structure
      ...(body.days?.map((day, index) => ({
        Put: {
          TableName: TABLE_NAME,
          Item: {
            PK: `TRIP#${tripId}`,
            SK: `DAY#${String(index + 1).padStart(6, '0')}`,
            ordinal: index + 1,
            ...day,
            createdAt: timestamp
          }
        }
      })) ?? [])
    ]

    await docClient.send(new TransactWriteCommand({
      TransactItems: transactItems
    }))

    return NextResponse.json({ tripId })
  } catch (error) {
    console.error('Failed to create trip:', error)
    return new Response('Failed to create trip', { status: 500 })
  }
}

export async function PATCH(request: Request) {
  const { searchParams } = new URL(request.url)
  const action = searchParams.get('action')
  const userId = 'test-user' // Replace with session.user.id

  if (action === 'reorder-days') {
    const body: ReorderDaysBody = await request.json()
    const { tripId, moves } = body

    try {
      // Verify access
      const { allowed, reason } = await validateTripAccess(tripId, userId, true)
      if (!allowed) {
        return new Response(reason, { status: 403 })
      }

      // Get all days for the trip
      const daysResult = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `TRIP#${tripId}`,
          ':sk': 'DAY#'
        }
      }))

      const days = daysResult.Items ?? []
      
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
            // Moving down
            if (dayOrdinal > currentPosition && dayOrdinal <= newPosition) {
              day.ordinal--
              day.SK = `DAY#${String(day.ordinal).padStart(6, '0')}`
            }
          } else {
            // Moving up
            if (dayOrdinal >= newPosition && dayOrdinal < currentPosition) {
              day.ordinal++
              day.SK = `DAY#${String(day.ordinal).padStart(6, '0')}`
            }
          }

          // Update the moved day
          if (day.SK === `DAY#${dayId}`) {
            day.ordinal = newPosition
            day.SK = `DAY#${String(newPosition).padStart(6, '0')}`
          }
        })
      })

      // Update all affected days in a single transaction
      const transactItems = days.map(day => ({
        Put: {
          TableName: TABLE_NAME,
          Item: {
            ...day,
            updatedAt: new Date().toISOString()
          }
        }
      }))

      await docClient.send(new TransactWriteCommand({
        TransactItems: transactItems
      }))

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Failed to reorder days:', error)
      return new Response('Failed to reorder days', { status: 500 })
    }
  }
  else if (action === 'insert-days') {
    const body: InsertDaysBody = await request.json()
    const { tripId, days } = body

    try {
      // Verify access
      const { allowed, reason } = await validateTripAccess(tripId, userId, true)
      if (!allowed) {
        return new Response(reason, { status: 403 })
      }

      // Get existing days
      const daysResult = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `TRIP#${tripId}`,
          ':sk': 'DAY#'
        }
      }))

      const existingDays = daysResult.Items ?? []
      const timestamp = new Date().toISOString()

      // Sort days by ordinal
      existingDays.sort((a, b) => a.ordinal - b.ordinal)

      // Process each new day
      const transactItems = []

      for (const newDay of days) {
        // Shift existing days to make room
        for (const day of existingDays) {
          if (day.ordinal >= newDay.position) {
            day.ordinal += 1
            day.SK = `DAY#${String(day.ordinal).padStart(6, '0')}`
            transactItems.push({
              Put: {
                TableName: TABLE_NAME,
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
            TableName: TABLE_NAME,
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

        // Update existingDays array for subsequent iterations
        existingDays.push({
          ordinal: newDay.position,
          SK: `DAY#${String(newDay.position).padStart(6, '0')}`
        })
        existingDays.sort((a, b) => a.ordinal - b.ordinal)
      }

      await docClient.send(new TransactWriteCommand({
        TransactItems: transactItems
      }))

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Failed to insert days:', error)
      return new Response('Failed to insert days', { status: 500 })
    }
  }
  else if (action === 'delete-days') {
    const body: DeleteDaysBody = await request.json()
    const { tripId, dayIds } = body

    try {
      // Verify access
      const { allowed, reason } = await validateTripAccess(tripId, userId, true)
      if (!allowed) {
        return new Response(reason, { status: 403 })
      }

      // Get all days
      const daysResult = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
        ExpressionAttributeValues: {
          ':pk': `TRIP#${tripId}`,
          ':sk': 'DAY#'
        }
      }))

      const allDays = daysResult.Items ?? []
      const timestamp = new Date().toISOString()

      // Find days to delete and their positions
      const deletedPositions = new Set(
        dayIds.map(id => {
          const day = allDays.find(d => d.SK === `DAY#${id}`)
          return day?.ordinal
        }).filter(pos => pos !== undefined)
      )

      const transactItems = []

      // Delete specified days
      dayIds.forEach(dayId => {
        transactItems.push({
          Delete: {
            TableName: TABLE_NAME,
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
          // Count how many deleted days were before this one
          deletedPositions.forEach(pos => {
            if (pos < day.ordinal) {
              newOrdinal--
            }
          })

          if (newOrdinal !== day.ordinal) {
            transactItems.push({
              Put: {
                TableName: TABLE_NAME,
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

      await docClient.send(new TransactWriteCommand({
        TransactItems: transactItems
      }))

      return NextResponse.json({ success: true })
    } catch (error) {
      console.error('Failed to delete days:', error)
      return new Response('Failed to delete days', { status: 500 })
    }
  }

  return new Response('Invalid action', { status: 400 })
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const tripId = searchParams.get('tripId')
  const tag = searchParams.get('tag')
  const userId = 'test-user' // Replace with session.user.id
  const includePublic = searchParams.get('includePublic') === 'true'
  const publicOnly = searchParams.get('publicOnly') === 'true'

  try {
    // Case 1: Get specific trip
    if (tripId) {
      const result = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `TRIP#${tripId}`
        }
      }))
      return NextResponse.json(result.Items)
    }

    // Case 2: Get trips by tag (with visibility check)
    if (tag) {
      // First, get all trips with this tag
      const tagResult = await docClient.send(new QueryCommand({
        TableName: TABLE_NAME,
        KeyConditionExpression: 'PK = :pk',
        ExpressionAttributeValues: {
          ':pk': `TAG#${tag}`
        }
      }))

      const tripIds = tagResult.Items?.map(item => item.tripId) ?? []
      
      // Then, get full trip details and filter based on visibility
      const tripPromises = tripIds.map(id =>
        docClient.send(new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'PK = :pk',
          ExpressionAttributeValues: {
            ':pk': `TRIP#${id}`
          }
        }))
      )
      
      const trips = await Promise.all(tripPromises)
      const allTrips = trips
        .flatMap(result => result.Items ?? [])
        .filter(item => item.SK.startsWith('USER#'))

      // Filter trips based on visibility
      const visibleTrips = allTrips.filter(trip => 
        trip.isPublic || 
        trip.userId === userId ||
        (trip.sharedWith && trip.sharedWith[userId])
      )

      return NextResponse.json(visibleTrips)
    }

    // Case 3: Get user's trips and/or public trips
    const queries = []

    // Get user's own trips
    if (!publicOnly) {
      queries.push(
        docClient.send(new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'begins_with(PK, :pk) AND SK = :sk',
          ExpressionAttributeValues: {
            ':pk': 'TRIP#',
            ':sk': `USER#${userId}`
          }
        }))
      )

      // Get shared trips
      queries.push(
        docClient.send(new QueryCommand({
          TableName: TABLE_NAME,
          KeyConditionExpression: 'begins_with(PK, :pk) AND SK = :sk',
          ExpressionAttributeValues: {
            ':pk': 'TRIP#',
            ':sk': `SHARE#${userId}`
          }
        }))
      )
    }

    // Get public trips if requested
    if (includePublic || publicOnly) {
      queries.push(
        docClient.send(new QueryCommand({
          TableName: TABLE_NAME,
          IndexName: 'GSI1',
          KeyConditionExpression: 'GSI1-PK = :pk',
          ExpressionAttributeValues: {
            ':pk': 'STATUS#PUBLIC'
          }
        }))
      )
    }

    const results = await Promise.all(queries)
    
    // Combine and deduplicate results
    const allTrips = results
      .flatMap(result => result.Items ?? [])
      .reduce((unique, trip) => {
        const exists = unique.find(t => t.tripId === trip.tripId)
        if (!exists) {
          unique.push(trip)
        }
        return unique
      }, [])

    return NextResponse.json(allTrips)
  } catch (error) {
    console.error('Failed to fetch trips:', error)
    return new Response('Failed to fetch trips', { status: 500 })
  }
}