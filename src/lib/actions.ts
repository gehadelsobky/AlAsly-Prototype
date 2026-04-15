'use server'

import { getCurrentUser, JWTPayload } from '@/lib/auth'

export async function getCurrentUserAction(): Promise<JWTPayload | null> {
  return getCurrentUser()
}

export async function logoutAction() {
  const response = await fetch(process.env.NEXTAUTH_URL + '/api/auth/logout' || 'http://localhost:3001/api/auth/logout', {
    method: 'POST',
  })
  return response.json()
}
