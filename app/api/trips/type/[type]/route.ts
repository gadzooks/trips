// app/api/trips/type/[type]/route.ts
import { NextResponse } from 'next/server';
import { CreateTripDbService } from '../../../services/createTripDbService';
import { MinimumTripRecord, TripListType } from '@/types/trip';
// import { getServerSession } from "next-auth/next";
import { auth } from '@/auth'

const tripService = new CreateTripDbService();

export async function GET(
  request: Request,
  context: { params: { type: string } }
) {
  const params = await context.params;
  const { type } = params;
  
  try {
    const session = await auth()
    const limit = 2;
    
    let response: MinimumTripRecord[];
    
    if (type === TripListType.PUBLIC) {
      response = await tripService.getByTag('PUBLIC', true, limit);
    } else if (type === TripListType.MY_TRIPS) {
      if (!session?.user?.email) {
        return new Response('Unauthorized', { status: 401 });
      }
      response = await tripService.getByUser(session.user.email, { limit });
    } else {
      throw new Error('Invalid trip type : ' + type);
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error(`Failed to fetch ${type} trips:`, error);
    return new Response(`Failed to fetch ${type} trips`, { status: 500 });
  }
}