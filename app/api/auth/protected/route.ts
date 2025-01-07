// app/api/auth/protected/route.ts
import { getServerSession } from 'next-auth/next';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await getServerSession();

  if (!session) {
    return NextResponse.json(
      { error: 'You must be signed in to access this endpoint.' },
      { status: 401 }
    );
  }

  return NextResponse.json({
    content: 'This is protected content. You can access this content because you are signed in.',
  });
}
