import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  console.log('Request path:', request.nextUrl.pathname)
  console.log('Request headers:', Object.fromEntries(request.headers))
  return NextResponse.next()
}

export const config = {
  matcher: '/api/auth/:path*'
}