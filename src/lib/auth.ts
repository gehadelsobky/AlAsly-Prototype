import { cookies } from 'next/headers'
import crypto from 'crypto'

export interface JWTPayload {
  userId: string
  email: string
  name: string
  role: 'admin' | 'seller' | 'reseller'
  whatsapp_number?: string
  iat?: number
  exp?: number
}

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const TOKEN_EXPIRY_7_DAYS = 7 * 24 * 60 * 60 * 1000 // in ms
const TOKEN_EXPIRY_24_HOURS = 24 * 60 * 60 * 1000 // in ms

// Simple JWT implementation without external library
function base64UrlEncode(str: string): string {
  return Buffer.from(str).toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '')
}

function base64UrlDecode(str: string): string {
  str += '=='.slice(0, (4 - (str.length % 4)) % 4)
  return Buffer.from(str.replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString()
}

function createHmacSignature(message: string, secret: string): string {
  return base64UrlEncode(crypto.createHmac('sha256', secret).update(message).digest().toString())
}

export function createToken(
  payload: JWTPayload,
  rememberMe: boolean = false
): string {
  const now = Math.floor(Date.now() / 1000)
  const expiresIn = rememberMe ? TOKEN_EXPIRY_7_DAYS / 1000 : TOKEN_EXPIRY_24_HOURS / 1000
  
  const header = { alg: 'HS256', typ: 'JWT' }
  const tokenPayload = {
    ...payload,
    iat: now,
    exp: now + expiresIn,
  }
  
  const encodedHeader = base64UrlEncode(JSON.stringify(header))
  const encodedPayload = base64UrlEncode(JSON.stringify(tokenPayload))
  const signature = createHmacSignature(`${encodedHeader}.${encodedPayload}`, JWT_SECRET)
  
  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export function verifyToken(token: string): JWTPayload | null {
  try {
    const parts = token.split('.')
    if (parts.length !== 3) return null
    
    const [encodedHeader, encodedPayload, signature] = parts
    
    // Verify signature
    const expectedSignature = createHmacSignature(`${encodedHeader}.${encodedPayload}`, JWT_SECRET)
    if (signature !== expectedSignature) return null
    
    // Decode payload
    const payload = JSON.parse(base64UrlDecode(encodedPayload)) as JWTPayload
    
    // Check expiration
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    
    return payload
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string, rememberMe: boolean = false) {
  try {
    const cookieStore = await cookies()
    const maxAge = rememberMe ? TOKEN_EXPIRY_7_DAYS / 1000 : TOKEN_EXPIRY_24_HOURS / 1000
    
    cookieStore.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: Math.floor(maxAge),
      path: '/',
    })
    
    return true
  } catch (error) {
    console.error('Error setting auth cookie:', error)
    throw error
  }
}

export async function getAuthCookie(): Promise<string | undefined> {
  const cookieStore = await cookies()
  const token = cookieStore.get('auth-token')?.value
  return token
}

export async function clearAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('auth-token')
}

export async function getCurrentUser(): Promise<JWTPayload | null> {
  const token = await getAuthCookie()
  if (!token) return null
  
  return verifyToken(token)
}

export function isAdmin(user: JWTPayload | null): boolean {
  return user?.role === 'admin'
}

export function isSeller(user: JWTPayload | null): boolean {
  return user?.role === 'seller'
}

export function isReseller(user: JWTPayload | null): boolean {
  return user?.role === 'reseller'
}

export function hasPermission(user: JWTPayload | null, requiredRoles: string[]): boolean {
  return user ? requiredRoles.includes(user.role) : false
}
