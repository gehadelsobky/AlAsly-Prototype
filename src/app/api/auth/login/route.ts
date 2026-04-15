import { NextRequest, NextResponse } from 'next/server'
import { createToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { fake } = body

    console.log('[Login] Fake login request')

    // Create a fake user token
    const token = createToken(
      {
        userId: '1',
        email: 'demo@example.com',
        name: 'Demo User',
        role: 'admin',
      },
      false
    )

    console.log('[Login] Token created:', token)

    // Create response with token
    const response = NextResponse.json(
      {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        redirectUrl: '/dashboard',
        user: {
          id: '1',
          email: 'demo@example.com',
          name: 'Demo User',
          role: 'admin',
        },
      },
      { status: 200 }
    )

    // Set the cookie in the response
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 24 * 60 * 60, // 24 hours
      path: '/',
    })

    console.log('[Login] Cookie set in response')

    return response
  } catch (error) {
    console.error('[Login] Error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    )
  }
}
