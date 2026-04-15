'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { getCurrentUserAction } from '@/lib/actions'
import { JWTPayload } from '@/lib/auth'

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRoles?: string[]
}

export function ProtectedRoute({
  children,
  requiredRoles = ['admin', 'seller', 'reseller'],
}: ProtectedRouteProps) {
  const router = useRouter()
  const pathname = usePathname()
  const [user, setUser] = useState<JWTPayload | null>(null)
  const [loading, setLoading] = useState(true)
  const [authorized, setAuthorized] = useState(false)

  useEffect(() => {
    async function checkAuth() {
      try {
        const currentUser = await getCurrentUserAction()

        if (!currentUser) {
          router.push('/login')
          return
        }

        setUser(currentUser)

        // Check if user has required role
        if (requiredRoles.includes(currentUser.role)) {
          setAuthorized(true)
        } else {
          setAuthorized(false)
        }
      } catch (error) {
        console.error('Auth check error:', error)
        router.push('/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [pathname, requiredRoles, router])

  if (loading) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: '#F5F7FA' }}
      >
        <div className="text-center">
          <div
            className="inline-block animate-spin rounded-full h-12 w-12 border-4"
            style={{ borderColor: '#E5E7EB', borderTopColor: '#F4B400' }}
          ></div>
          <p className="mt-4" style={{ color: '#6B7280' }}>
            جاري التحقق...
          </p>
        </div>
      </div>
    )
  }

  if (!authorized) {
    return (
      <div
        className="flex items-center justify-center h-screen"
        style={{ backgroundColor: '#F5F7FA' }}
        dir="rtl"
      >
        <div
          className="text-center p-8 rounded-lg"
          style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB', border: '1px solid' }}
        >
          <h1 className="text-3xl font-bold mb-4" style={{ color: '#1F2937' }}>
            403
          </h1>
          <p className="text-lg mb-2" style={{ color: '#6B7280' }}>
            غير مصرح بالوصول
          </p>
          <p style={{ color: '#6B7280' }}>
            ليس لديك الصلاحيات المطلوبة للوصول لهذه الصفحة
          </p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
