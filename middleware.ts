// middleware.ts
import { auth } from "@/auth"
 
export default auth((req) => {
  // Allow unauthenticated GET requests for these specific paths
  if (req.method === 'GET' && (
    req.nextUrl.pathname.startsWith('/trips/') || 
    req.nextUrl.pathname.startsWith('/api/trips/') || 
    req.nextUrl.pathname.startsWith('/api/trips/type/public')
  )) {
    return
  }
 
 // All other API requests require auth
 if (req.nextUrl.pathname.startsWith('/api/')) {
  if (!req.auth) {
    return new Response('Unauthorized', { status: 401 })
  }
  return
}
 
  // Redirect non-API unauthenticated requests
  if (!req.auth && req.nextUrl.pathname !== "/") {
    const newUrl = new URL("/", req.nextUrl.origin)
    newUrl.searchParams.set("callbackUrl", req.nextUrl.pathname)
    return Response.redirect(newUrl)
  }
 })

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

// export default auth((req) => {
//     // req.auth
//   })
// export const config = { matcher: ["/api/trips(.*)"] }
// import { auth } from "@/auth"
// import { NextResponse } from "next/server"
// import type { NextRequest } from "next/server"

// // This function handles routes that need custom protection
// async function customProtection(request: NextRequest) {
//   const path = request.nextUrl.pathname
  
//   // For public routes, we allow access without auth
//   if (path.startsWith('/api/trips/public')) {
//     return NextResponse.next()
//   }
  
//   // For protected routes, we check the session
//   const session = await auth()
//   console.log('session is ', JSON.stringify(session))
//   if (!session) {
//     return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
//   }
  
//   return NextResponse.next()
// }

// // This is our main middleware function that Next.js will call
// export async function middleware(request: NextRequest) {
//   const path = request.nextUrl.pathname
  
//   // For API routes that need custom protection
//   if (path.startsWith('/api/trips')) {
//     return customProtection(request)
//   }
  
//   // For all other authenticated routes, use NextAuth's built-in auth
//   const authMiddleware = auth as any
//   return authMiddleware(request)
// }

// // The matcher tells Next.js which routes should use this middleware
// export const config = {
//   matcher: [
//     // Routes that need custom protection
//     '/api/trips/:path*',
//     '/api/trips/new', 
    
//     // Routes that only need session management
//     // Add your authenticated routes here
//     // '/dashboard/:path*',
//     // '/profile/:path*',
    
//     // Important: Add other routes that should be protected
//     // but exclude API routes and public routes
//     '/((?!api|_next/static|_next/image|favicon.ico).*)'
//   ]
// }