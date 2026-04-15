'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'

export default function LoginSuccessPage() {
  const router = useRouter()
  const [userEmail, setUserEmail] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [countdown, setCountdown] = useState(3)

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('pendingUserData')
    if (userData) {
      try {
        const data = JSON.parse(userData)
        setUserEmail(data.email)
        setUserName(data.name)
      } catch (e) {
        console.error('Error parsing user data:', e)
      }
    }

    // Redirect after 3 seconds
    const timeout = setTimeout(() => {
      console.log('[Login Success] Redirecting to dashboard')
      router.push('/dashboard')
    }, 3000)

    // Countdown timer
    const interval = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => {
      clearTimeout(timeout)
      clearInterval(interval)
    }
  }, [router])

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#F5F7FA' }}
      dir="rtl"
    >
      <div
        className="w-full max-w-md rounded-lg shadow-lg p-8 text-center"
        style={{ backgroundColor: '#FFFFFF' }}
      >
        {/* Success Icon */}
        <div className="mb-6 flex justify-center">
          <CheckCircle size={80} style={{ color: '#F4B400' }} />
        </div>

        {/* Success Message */}
        <h1 className="text-3xl font-bold mb-4" style={{ color: '#0B1C2C' }}>
          تم تسجيل الدخول بنجاح
        </h1>

        {/* User Info */}
        {userName && (
          <p className="text-lg mb-2" style={{ color: '#6B7280' }}>
            أهلا وسهلا <span style={{ color: '#0B1C2C', fontWeight: 'bold' }}>{userName}</span>
          </p>
        )}

        {userEmail && (
          <p className="text-sm mb-6" style={{ color: '#9CA3AF' }}>
            {userEmail}
          </p>
        )}

        {/* Redirect Message */}
        <div
          className="p-4 rounded-lg mb-6"
          style={{ backgroundColor: '#F0F9FF', borderLeft: `4px solid #F4B400` }}
        >
          <p style={{ color: '#0B1C2C' }}>
            جاري تحويلك إلى لوحة التحكم...
          </p>
          <p className="text-sm mt-2" style={{ color: '#6B7280' }}>
            سيتم التحويل خلال <span style={{ fontWeight: 'bold' }}>{countdown}</span> ثواني
          </p>
        </div>

        {/* Skip Button */}
        <button
          onClick={() => router.push('/dashboard')}
          className="px-6 py-2 rounded-lg font-medium transition-all duration-200"
          style={{
            backgroundColor: '#0B1C2C',
            color: '#FFFFFF',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.opacity = '0.8'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.opacity = '1'
          }}
        >
          الذهاب الآن
        </button>
      </div>
    </div>
  )
}
