// app/api/trips/type/[type]/route.ts
import { NextResponse } from 'next/server';
import { CreateTripDbService } from '../../../../../server/service/createTripDbService';
import { InviteService } from '@/server/service/inviteService';
import { MinimumTripRecord } from '@/types/trip';
import { auth } from '@/auth'
import { TripListType } from '@/types/permissions';

const tripService = new CreateTripDbService();
const inviteService = new InviteService();

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

      const inviteSummaries = await Promise.all(
        createdTrips.map(t => inviteService.getTripInvites(t.tripId))
      );
      const createdWithSummary = createdTrips.map((t, i) => {
        const invites = inviteSummaries[i];
        return {
          ...t,
          inviteSummary: {
            total: invites.length,
            accepted: invites.filter(inv => inv.status === 'accepted').length,
          },
        };
      });

      const taggedInvited = invitedTrips.map(t => ({ ...t, isInvited: true }));
      const seen = new Set<string>();
      response = [...createdWithSummary, ...taggedInvited].filter(t => {
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