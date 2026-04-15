import { redirect } from 'next/navigation'

export default async function HomePage() {
  // Redirect directly to dashboard
  redirect('/dashboard')
}
