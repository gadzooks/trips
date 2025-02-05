// middleware.ts
import { auth } from "@/auth"
import { NextResponse } from 'next/server'

export default auth((req) => {
  const isApiRoute = req.nextUrl.pathname.startsWith('/api/')
  const path = req.nextUrl.pathname
  
  // Debug logging for headers test
  // console.log('Headers:', Object.fromEntries(req.headers.entries()))

  // Skip middleware for auth routes
  if (path.startsWith('/api/auth/')) {
    return
  }

  // Handle public GET requests
  if (req.method === 'GET') {
    if (
      // path.startsWith('/api/auth/') || 
      path.startsWith('/trips/') || 
      path.startsWith('/api/trips/') || 
      path.startsWith('/api/trips/type/public')
    ) {
      return NextResponse.next()
    }
  }

  // Handle API routes that require auth
  if (isApiRoute) {
    if (!req.auth) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }), 
        { 
          status: 401,
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
    } 
    return NextResponse.next()
  }

  // Handle non-API routes without auth
  if (!req.auth && path !== "/") {
    // Use NextResponse.redirect for proper redirect type
    return NextResponse.redirect(
      new URL("/api/auth/signin", req.nextUrl.origin)
    )
  }

  // if (req.auth && req.method === 'GET') {
  //   return new Response(
  //     JSON.stringify({ message: 'Page could not be found' }),
  //     { 
  //       status: 404,
  //       headers: {
  //         'Content-Type': 'application/json'
  //       }
  //     }
  //   )
  // }

  return NextResponse.next()
})

// Export config for middleware matcher
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     * - auth paths
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.css$|.*\\.js$).*)",
  ],
}