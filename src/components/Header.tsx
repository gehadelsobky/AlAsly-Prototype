'use client'

import { Search, Bell, MessageSquare, User, LogOut, ChevronDown } from 'lucide-react'
import { useState } from 'react'

export function Header() {
  const [showProfile, setShowProfile] = useState(false)

  return (
    <header
      className="fixed top-0 right-64 left-0 h-16 border-b shadow-sm z-40"
      style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
      dir="rtl"
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left Section - Search */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5" style={{ color: '#6B7280' }} />
            <input
              type="text"
              placeholder="ابحث عن منتج، طلب، عميل..."
              className="w-full pl-4 pr-10 py-2 rounded-lg border-2 outline-none text-sm transition-colors"
              style={{
                borderColor: '#E5E7EB',
                color: '#1F2937',
                backgroundColor: '#F5F7FA',
              }}
              onFocus={(e) => {
                e.currentTarget.style.borderColor = '#F4B400'
                e.currentTarget.style.boxShadow = 'inset 0 0 0 3px rgba(244, 180, 0, 0.1)'
              }}
              onBlur={(e) => {
                e.currentTarget.style.borderColor = '#E5E7EB'
                e.currentTarget.style.boxShadow = 'none'
              }}
            />
          </div>
        </div>

        {/* Right Section - Icons & Profile */}
        <div className="flex items-center gap-4 ml-6">
          {/* Notifications */}
          <button
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: '#6B7280' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F7FA'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <Bell className="h-5 w-5" />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: '#22C55E' }}
            ></span>
          </button>

          {/* Messages */}
          <button
            className="relative p-2 rounded-lg transition-colors"
            style={{ color: '#6B7280' }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F5F7FA'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'transparent'
            }}
          >
            <MessageSquare className="h-5 w-5" />
            <span
              className="absolute top-1 right-1 w-2 h-2 rounded-full"
              style={{ backgroundColor: '#22C55E' }}
            ></span>
          </button>

          {/* Divider */}
          <div className="w-px h-6" style={{ backgroundColor: '#E5E7EB' }}></div>

          {/* User Profile */}
          <div className="relative">
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-2 p-2 rounded-lg transition-colors"
              style={{ color: '#1F2937' }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F5F7FA'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'transparent'
              }}
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=admin"
                alt="User"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-right">
                <p className="text-sm font-bold" style={{ color: '#1F2937' }}>
                  محمد علي
                </p>
                <p className="text-xs" style={{ color: '#6B7280' }}>
                  مدير النظام
                </p>
              </div>
              <ChevronDown className="h-4 w-4" style={{ color: '#6B7280' }} />
            </button>

            {/* Profile Dropdown */}
            {showProfile && (
              <div
                className="absolute left-0 mt-2 w-48 rounded-lg shadow-xl border py-2 z-50"
                style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
              >
                <button
                  className="w-full px-4 py-2 text-right text-sm flex items-center justify-end gap-2 transition-colors"
                  style={{ color: '#1F2937' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F5F7FA'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <span>الملف الشخصي</span>
                  <User className="h-4 w-4" />
                </button>
                <hr style={{ borderColor: '#E5E7EB' }} className="my-2" />
                <button
                  className="w-full px-4 py-2 text-right text-sm flex items-center justify-end gap-2 transition-colors"
                  style={{ color: '#22C55E' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#F0FDF4'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = 'transparent'
                  }}
                >
                  <span>تسجيل الخروج</span>
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}
