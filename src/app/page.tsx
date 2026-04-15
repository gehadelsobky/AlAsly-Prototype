import { redirect } from 'next/navigation'
import { getCurrentUser } from '@/lib/auth'

export default async function HomePage() {
  const user = await getCurrentUser()

  if (user) {
    // If user is logged in, redirect to dashboard
    redirect('/dashboard')
  }

  // If not logged in, redirect to login
  redirect('/login')
}
