'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      console.log('[Login Page] Fake login - no credentials required')
      
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fake: true }),
      })

      if (!response.ok) {
        const data = await response.json()
        setError(data.error || 'حدث خطأ أثناء تسجيل الدخول')
        setLoading(false)
        return
      }

      const data = await response.json()
      
      if (data.success) {
        console.log('[Login Page] Login successful')
        setError(null)
        setLoading(false)
        
        // Redirect to dashboard
        router.push('/dashboard')
      } else {
        setError(data.error || 'حدث خطأ')
        setLoading(false)
      }
    } catch (err: any) {
      console.error('[Login Page] Error:', err.message)
      setError('حدث خطأ في الاتصال')
      setLoading(false)
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: '#F5F7FA' }}
      dir="rtl"
    >
      <div
        className="w-full max-w-md rounded-lg shadow-lg p-8"
        style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2" style={{ color: '#F4B400' }}>
            الأصلي
          </h1>
          <p className="text-lg" style={{ color: '#6B7280' }}>
            نظام إدارة المنتجات
          </p>
        </div>

        {/* Welcome Message */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold mb-2" style={{ color: '#1F2937' }}>
            أهلا وسهلا
          </h2>
          <p style={{ color: '#6B7280' }}>
            يرجى تسجيل الدخول للمتابعة
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div
            className="mb-6 p-4 rounded-lg flex items-center gap-3 border-2"
            style={{
              backgroundColor: '#FEF2F2',
              borderColor: '#DC2626',
              color: '#DC2626',
            }}
          >
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <span className="text-sm font-medium">{error}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email Field */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-bold"
              style={{ color: '#1F2937' }}
            >
              البريد الإلكتروني
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@email.com"
              className="w-full px-4 py-3 rounded-lg border-2 outline-none transition-colors text-sm"
              style={{
                borderColor: '#E5E7EB',
                backgroundColor: '#FFFFFF',
                color: '#1F2937',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#F4B400'
                e.target.style.boxShadow = 'inset 0 0 0 3px rgba(244, 180, 0, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Password Field */}
          <div className="space-y-2">
            <label
              htmlFor="password"
              className="block text-sm font-bold"
              style={{ color: '#1F2937' }}
            >
              كلمة المرور
            </label>
            <input
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border-2 outline-none transition-colors text-sm"
              style={{
                borderColor: '#E5E7EB',
                backgroundColor: '#FFFFFF',
                color: '#1F2937',
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#F4B400'
                e.target.style.boxShadow = 'inset 0 0 0 3px rgba(244, 180, 0, 0.1)'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#E5E7EB'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          {/* Remember Me */}
          <div className="flex items-center gap-3">
            <input
              id="remember"
              name="remember"
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-5 h-5 rounded cursor-pointer"
              style={{
                accentColor: '#F4B400',
              }}
            />
            <label
              htmlFor="remember"
              className="text-sm cursor-pointer"
              style={{ color: '#6B7280' }}
            >
              تذكرني لمدة 7 أيام
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 rounded-lg font-bold text-sm transition-all duration-200 flex items-center justify-center gap-2"
            style={{
              backgroundColor: '#F4B400',
              color: '#0B1C2C',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#DAA00F'
            }}
            onMouseLeave={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = '#F4B400'
            }}
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                جاري الدخول...
              </>
            ) : (
              'دخول'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
