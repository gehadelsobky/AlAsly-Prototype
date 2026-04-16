import { NextRequest, NextResponse } from 'next/server'
import { createToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password } = body

    console.log('[Login] Login attempt for email:', email)

    // Validate credentials
    const ADMIN_EMAIL = 'admin@example.com'
    const ADMIN_PASSWORD = 'admin123'

    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      console.log('[Login] Invalid credentials')
      return NextResponse.json(
        { success: false, error: 'بيانات الدخول غير صحيحة' },
        { status: 401 }
      )
    }

    // Create user token
    const token = createToken(
      {
        userId: '1',
        email: 'admin@example.com',
        name: 'Admin User',
        role: 'admin',
      },
      false
    )

    console.log('[Login] Token created for admin')

    // Create response with token
    const response = NextResponse.json(
      {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        redirectUrl: '/dashboard',
        user: {
          id: '1',
          email: 'admin@example.com',
          name: 'Admin User',
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
      { success: false, error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    )
  }
}
