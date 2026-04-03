// app/api/trips/type/[type]/route.ts
import { NextResponse } from 'next/server';
import { CreateTripDbService } from '../../../../../server/service/createTripDbService';
import { MinimumTripRecord } from '@/types/trip';
import { auth } from '@/auth'
import { TripListType } from '@/types/permissions';

const tripService = new CreateTripDbService();

export async function GET(
  request: Request,
  { params }: { params: Promise<{ type: string }> }
) {
  const type = (await params).type
  
  try {
    const session = await auth()
    const limit = 20;
    
    let response: MinimumTripRecord[];
    
    if (type === TripListType.PUBLIC) {
      response = await tripService.getByTag('PUBLIC', true, limit);
    } else if (type === TripListType.MY_TRIPS) {
      if (!session?.user?.email) {
        return new Response('Unauthorized', { status: 401 });
      }
      const [createdTrips, invitedTrips] = await Promise.all([
        tripService.getByUser(session.user.email, { limit }),
        tripService.getByInvitee(session.user.email, { limit }),
      ]);
      const taggedInvited = invitedTrips.map(t => ({ ...t, isInvited: true }));
      const seen = new Set<string>();
      response = [...createdTrips, ...taggedInvited].filter(t => {
        if (seen.has(t.tripId)) return false;
        seen.add(t.tripId);
        return true;
      });
    } else {
      throw new Error('Invalid trip type : ' + type);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error(`Failed to fetch ${type} trips:`, error);
    return new Response(`Failed to fetch ${type} trips`, { status: 500 });
  }
}