import { NextRequest, NextResponse } from 'next/server'
import { verifyToken } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname
  
  // Public routes - no authentication required
  const publicRoutes = ['/login', '/api/auth/login', '/api/auth/logout']
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }
  
  // Get auth token from cookies
  const token = request.cookies.get('auth-token')?.value
  
  // If no token and trying to access protected route, redirect to login
  if (!token && !pathname.startsWith('/api')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If token exists, verify it
  if (token) {
    const payload = verifyToken(token)
    if (!payload) {
      // Invalid token - redirect to login
      if (!pathname.startsWith('/api')) {
        return NextResponse.redirect(new URL('/login', request.url))
      }
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
