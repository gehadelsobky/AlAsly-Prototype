'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Package,
  DollarSign,
  Truck,
  CreditCard,
  Zap,
  Settings,
  ChevronRight,
  LogOut,
  Shield,
} from 'lucide-react'
import { JWTPayload } from '@/lib/auth'

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: 'لوحة التحكم',
    icon: LayoutDashboard,
    roles: ['admin', 'seller', 'reseller'],
  },
  {
    href: '/products',
    label: 'المنتجات',
    icon: Package,
    roles: ['admin', 'seller'],
  },
  {
    href: '/dashboard/customers',
    label: 'العملاء',
    icon: Users,
    roles: ['admin', 'seller'],
  },
  {
    href: '/dashboard/orders',
    label: 'الطلبات',
    icon: ShoppingCart,
    roles: ['admin', 'seller', 'reseller'],
  },
  {
    href: '/dashboard/exchange-rates',
    label: 'أسعار الصرف',
    icon: DollarSign,
    roles: ['admin'],
  },
  {
    href: '/dashboard/shipping',
    label: 'الشحن',
    icon: Truck,
    roles: ['admin', 'seller'],
  },
  {
    href: '/dashboard/payment-methods',
    label: 'طرق الدفع',
    icon: CreditCard,
    roles: ['admin'],
  },
  {
    href: '/dashboard/ai-assistant',
    label: 'مساعد الذكاء',
    icon: Zap,
    roles: ['admin', 'seller'],
  },
  {
    href: '/dashboard/admin',
    label: 'الإدارة',
    icon: Shield,
    roles: ['admin'],
  },
  {
    href: '/dashboard/settings',
    label: 'الإعدادات',
    icon: Settings,
    roles: ['admin', 'seller', 'reseller'],
  },
]

// Separate component for nav link to handle hover
function NavLink({
  href,
  label,
  icon: Icon,
  isActive,
}: {
  href: string
  label: string
  icon: any
  isActive: boolean
}) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <Link
      href={href}
      className="flex items-center justify-between gap-3 px-4 py-3 rounded-lg transition-all duration-200 w-full"
      style={{
        backgroundColor: isActive ? '#F4B400' : isHovered ? '#12283D' : 'transparent',
        color: isActive ? '#0B1C2C' : '#FFFFFF',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-3 flex-1">
        <Icon className="h-5 w-5 flex-shrink-0" />
        <span className="text-sm font-medium">{label}</span>
      </div>
      {isActive && <ChevronRight className="h-4 w-4" />}
    </Link>
  )
}

export function Sidebar() {
  const pathname = usePathname()
  const [user, setUser] = useState<JWTPayload | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUser({ userId: '1', email: 'admin@test.com', name: 'Admin', role: 'admin' })
    setLoading(false)
  }, [])

  const handleLogout = async () => {
    // Logout disabled - no authentication needed
  }

  const filteredNavItems = NAV_ITEMS


  return (
    <aside
      className="fixed right-0 top-0 h-screen w-64 bg-primary text-white shadow-xl z-50 overflow-y-auto flex flex-col"
      style={{ backgroundColor: '#0B1C2C', direction: 'ltr' }}
    >
      {/* Logo */}
      <div className="p-6 border-b" style={{ borderColor: '#12283D' }}>
        <div className="flex items-center justify-center gap-4">
          <Image
            src="/images/logo.jpeg"
            alt="الأصلي"
            width={50}
            height={50}
            className="rounded-xl"
          />
          <div className="text-right">
            <h1 className="text-2xl font-bold" style={{ color: '#F4B400' }}>
              الأصلي
            </h1>
            <p className="text-xs mt-1" style={{ color: '#FFFFFF' }}>
              نظام إدارة المنتجات
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          const Icon = item.icon

          return (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              icon={Icon}
              isActive={isActive}
            />
          )
        })}
      </nav>

      {/* User Info & Logout */}
      {!loading && user && (
        <div
          className="p-4 border-t"
          style={{ borderColor: '#12283D' }}
        >
          <div className="mb-4 pb-4" style={{ borderColor: '#12283D', borderBottomWidth: '1px' }}>
            <p className="text-sm font-bold text-white mb-1">{user.name}</p>
            <p className="text-xs" style={{ color: '#F4B400' }}>
              {user.role === 'admin' ? 'مدير النظام' : user.role === 'seller' ? 'بائع' : 'موزع'}
            </p>
            <p className="text-xs mt-2" style={{ color: '#FFFFFF' }}>
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-medium text-sm transition-colors"
            style={{
              backgroundColor: '#12283D',
              color: '#FFFFFF',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#1a3a52'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#12283D'
            }}
          >
            <LogOut className="h-4 w-4" />
            تسجيل الخروج
          </button>
        </div>
      )}
    </aside>
  )
}
