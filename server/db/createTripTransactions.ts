import { MinimumTripRecord, TripDayDTO, TripRecordDTO } from "@/types/trip";
import { timestampIsoFormat } from "@/lib/time";
import { ulid } from 'ulid'
import { getOwnerWithDbPK, getInviteesDbPK, getTagDbPK, getTripIdPk } from "./dbKeys";
import { extractTagsFromTripData } from "@/lib/tags";

export interface CreateTripTransactionsResult {
  tripId: string;
  userId: string;
  timestamp: string;
  transactItems: any[]; //FIXME add type
}

export function extractTripDates(days?: TripDayDTO[]): { startDate: string; endDate: string } {
  if (!days || days.length === 0) return { startDate: '', endDate: '' };
  const validDates = days.map(d => d.date).filter(Boolean);
  if (validDates.length === 0) return { startDate: '', endDate: '' };
  const parseDate = (s: string): number => {
    const parts = s.split('/');
    if (parts.length === 3) return new Date(parseInt(parts[2]), parseInt(parts[0]) - 1, parseInt(parts[1])).getTime();
    return new Date(s).getTime();
  };
  const sorted = [...validDates].sort((a, b) => parseDate(a) - parseDate(b));
  return { startDate: sorted[0], endDate: sorted[sorted.length - 1] };
}

export function createTripTransactions(tripData: TripRecordDTO, userId: string): CreateTripTransactionsResult {
    // lexically sortable UUID
    const tripId = ulid()
    const timestamp = timestampIsoFormat(new Date()); //.toISOString();

    const records = [];
    const allTags: string[] = extractTagsFromTripData(tripData.tags);
    // console.log('allTags : ', JSON.stringify(allTags, null, 2));

    // We want to store : 
    // 1. The main record : PK = TRIP#{tripId} - store all attributes here
    // 2. Trip for owner : PK = CREATEDBY#{userId} SK = TRIP#{tripId} -- store PK, SK, name, maybe desc
    // 3. For each tag : PK = TAG#{tag} SK = TRIP#{tripId} -- store PK, SK, name, maybe desc
    // 4. For each shared user : PK = INVITEES#{userId} SK = TRIP#{tripId} -- store PK, SK, name, maybe desc
    // 5. For public trips : PK = PUBLIC#TRIP#{tripId} -- store PK, SK, name, maybe desc

    // When showing trips for each user or each tag or public trips or shared with a user,
    // we will only show titile, maybe desc. User will need to click to pull the full trip details by tripId

    // Main record with all the details
    records.push(
        {
            //PK is ulid so its unique and lexically sortable
            PK: getTripIdPk(tripId),
            //SK is timestamp and can be used in range queries
            SK: timestamp,
            createdAt: timestamp,
            createdBy: userId,
            ...tripData,
            tags: allTags,
        }
    );
 
    const { startDate, endDate } = extractTripDates(tripData.days);
    const partialTripDetails: MinimumTripRecord = {
        tripId,
        name: tripData.name,
        // description: tripData.description, // will be too huge to store in shared records
        createdAt: timestamp,
        updatedAt: timestamp,
        startDate,
        endDate,
        createdBy: userId,
    };
 
    // Owner record
    records.push({
        PK: getOwnerWithDbPK(userId),
        SK: tripId,
        ...partialTripDetails
    });
 
    // Shared records
    // Search for shared users using eq('INVITEES#{userId}') 
    // to delete shared users, search for PK eq('USER#{userId}') and SK eq(tripId)
    (tripData.invitees || []).forEach(sharedUserId => {
        records.push({
            // Add these for each shared user
            PK: getInviteesDbPK(sharedUserId),
            SK: tripId,
            ...partialTripDetails
        });
    });
 

    // Search for tags using eq('TAG#{tag}') and SK begins_with('TIMESTAMP#')
    // to delete tags, search for PK eq('TAG#{tag}') and SK eq('TIMESTAMP#{timestamp}#{tripId}')
    (allTags).forEach(tag => {
        records.push({
            PK: getTagDbPK(tag, tripData.isPublic),
            SK: tripId,
            ...partialTripDetails,
        });
    });
    if (tripData.isPublic) {
        records.push({
            PK: getTagDbPK('PUBLIC', true),
            SK: tripId,
            ...partialTripDetails,
        });
    }

    const transactItems = records.map(record => ({
        Put: {
            TableName: process.env.TRIP_PLANNER_TABLE_NAME,
            Item: record
        }
    }));

    return { tripId, userId, timestamp, transactItems };
}

