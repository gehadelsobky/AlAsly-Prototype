import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  // This endpoint is used to redirect after successful login
  // The browser will follow this redirect with the cookie already set
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
