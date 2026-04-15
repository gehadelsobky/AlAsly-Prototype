'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { AddProductFormNew } from '@/components/AddProductFormNew'

export default function AddProductPage() {
  return (
    <div dir="rtl" style={{ backgroundColor: '#F5F7FA', minHeight: '100vh', padding: '24px' }}>
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4 text-sm">
          <Link
            href="/products"
            className="font-medium flex items-center gap-1 transition-colors"
            style={{ color: '#F4B400' }}
            onMouseEnter={(e) => (e.currentTarget.style.color = '#DAA00F')}
            onMouseLeave={(e) => (e.currentTarget.style.color = '#F4B400')}
          >
            <ArrowRight className="h-4 w-4" />
            العودة للمنتجات
          </Link>
          <span style={{ color: '#E5E7EB' }}>/</span>
          <span style={{ color: '#6B7280' }}>إضافة منتج جديد</span>
        </div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1F2937' }}>
          إضافة منتج جديد
        </h1>
        <p style={{ color: '#6B7280' }}>
          أضف منتج جديد إلى المستودع الخاص بك
        </p>
      </div>

      {/* Form */}
      <AddProductFormNew />
    </div>
  )
}
