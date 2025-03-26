import { withAuth } from "next-auth/middleware"
import { NextResponse } from 'next/server'

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const path = req.nextUrl.pathname
    
    // Role-based access control
// In middleware.js
if (path.startsWith('/authenticated/admin') && token?.role !== 'ADMIN') {
  return NextResponse.redirect(new URL('/dashboard', req.url))
}

if (path.startsWith('/authenticated/teacher') && 
    token?.role !== 'TEACHER' && token?.role !== 'ADMIN') {
  return NextResponse.redirect(new URL('/dashboard', req.url))
}

if (path.startsWith('/authenticated/staff') && 
    !['ADMIN', 'STAFF'].includes(token?.role)) {
  return NextResponse.redirect(new URL('/dashboard', req.url))
}
    
    // If authenticated and authorized, allow access
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/auth/signin",
      error: "/auth/error",
    },
  }
)

export const config = {
  matcher: [
    // Apply middleware to all authenticated routes under the route group
    "/(authenticated)/:path*",
  ],
}