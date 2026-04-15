import { NextRequest, NextResponse } from 'next/server'
import { createToken } from '@/lib/auth'
import { Pool } from 'pg'
import { createHash } from 'crypto'

// PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

// Hash password with SHA256 (same as setup-test-users.js)
function hashPassword(password: string): string {
  return createHash('sha256').update(password).digest('hex')
}

const TOKEN_EXPIRY_7_DAYS = 7 * 24 * 60 * 60 * 1000 // in ms
const TOKEN_EXPIRY_24_HOURS = 24 * 60 * 60 * 1000 // in ms

export async function POST(request: NextRequest) {
  let client
  try {
    const body = await request.json()
    const { email, password, rememberMe } = body

    console.log('[Login] Attempting login for:', email)

    // Validate input
    if (!email || !password) {
      console.log('[Login] Missing email or password')
      return NextResponse.json(
        { error: 'البريد الإلكتروني وكلمة المرور مطلوبان' },
        { status: 400 }
      )
    }

    // Connect to database
    client = await pool.connect()
    
    // Query user from PostgreSQL (case-insensitive email match)
    const result = await client.query(
      'SELECT id, email, first_name, last_name, phone_number, encrypted_password, role FROM users WHERE LOWER(email) = LOWER($1)',
      [email]
    )

    if (result.rows.length === 0) {
      console.log('[Login] User not found:', email)
      client.release()
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    const user = result.rows[0]
    const hashedPassword = hashPassword(password)

    // Verify password
    if (user.encrypted_password !== hashedPassword) {
      console.log('[Login] Wrong password for:', email)
      client.release()
      return NextResponse.json(
        { error: 'البريد الإلكتروني أو كلمة المرور غير صحيحة' },
        { status: 401 }
      )
    }

    console.log('[Login] User authenticated:', email)

    const userName = `${user.first_name} ${user.last_name}`

    // Create token
    const token = createToken(
      {
        userId: user.id.toString(),
        email: user.email,
        name: userName,
        role: user.role,
        whatsapp_number: user.phone_number,
      },
      rememberMe === true
    )

    console.log('[Login] Token created:', token)

    client.release()

    // Create response with token
    const response = NextResponse.json(
      {
        success: true,
        message: 'تم تسجيل الدخول بنجاح',
        redirectUrl: '/dashboard',
        user: {
          id: user.id.toString(),
          email: user.email,
          name: userName,
          role: user.role,
          whatsapp_number: user.phone_number,
        },
      },
      { status: 200 }
    )

    // Set the cookie in the response
    const maxAge = rememberMe ? TOKEN_EXPIRY_7_DAYS / 1000 : TOKEN_EXPIRY_24_HOURS / 1000
    
    response.cookies.set({
      name: 'auth-token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Math.floor(maxAge),
      path: '/',
    })

    console.log('[Login] Cookie set in response')

    return response
  } catch (error) {
    console.error('[Login] Error:', error)
    if (client) {
      client.release()
    }
    return NextResponse.json(
      { error: 'حدث خطأ أثناء تسجيل الدخول' },
      { status: 500 }
    )
  }
}
