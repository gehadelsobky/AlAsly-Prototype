'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Users, TrendingUp, AlertCircle, ShoppingCart, BarChart3, Eye } from 'lucide-react'

interface Product {
  id: string
  name: string
  productNumber: string
  price: number
  quantity: number
  createdAt: string
}

interface OrderItem {
  id: string
  orderNumber: string
  buyer: string
  date: string
  price: number
  status: 'completed' | 'pending' | 'shipped'
}

export function Dashboard() {
  const [stats, setStats] = useState({
    totalUsers: 1,
    growthRate: '15.2%',
    newOrders: 0,
    totalRevenue: 0,
    recentOrders: [] as OrderItem[],
    popularProducts: [] as Product[],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate loading dashboard data
    setTimeout(() => {
      setStats({
        totalUsers: 1,
        growthRate: '15.2%',
        newOrders: 0,
        totalRevenue: 0,
        recentOrders: [
          {
            id: '1',
            orderNumber: 'ORD-001',
            buyer: 'فاطمة أحمد',
            date: '2024-01-15',
            price: 2500,
            status: 'completed',
          },
          {
            id: '2',
            orderNumber: 'ORD-002',
            buyer: 'نورة السعيد',
            date: '2024-01-15',
            price: 4200,
            status: 'pending',
          },
          {
            id: '3',
            orderNumber: 'ORD-003',
            buyer: 'سارة محمد',
            date: '2024-01-14',
            price: 1800,
            status: 'shipped',
          },
        ],
        popularProducts: [
          {
            id: '1',
            name: 'عبايات كلاسيك سوداء',
            productNumber: '145',
            price: 43500,
            quantity: 1,
            createdAt: '12+',
          },
          {
            id: '2',
            name: 'عبايات مطرزة ذهبي',
            productNumber: '98',
            price: 39200,
            quantity: 1,
            createdAt: '8+',
          },
          {
            id: '3',
            name: 'عبايات فقع بيج',
            productNumber: '87',
            price: 26100,
            quantity: 1,
            createdAt: '15+',
          },
          {
            id: '4',
            name: 'عبايات دبر خجي',
            productNumber: '76',
            price: 30400,
            quantity: 1,
            createdAt: '5+',
          },
          {
            id: '5',
            name: 'عبايات كريب زهادي',
            productNumber: '65',
            price: 19500,
            quantity: 1,
            createdAt: '3+',
          },
        ],
      })
      setLoading(false)
    }, 500)
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen" dir="rtl">
        <div className="text-center">
          <div
            className="inline-block animate-spin rounded-full h-12 w-12 border-4"
            style={{ borderColor: '#E5E7EB', borderTopColor: '#F4B400' }}
          ></div>
          <p className="mt-4" style={{ color: '#6B7280' }}>
            جاري تحميل لوحة التحكم...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div dir="rtl" style={{ backgroundColor: '#F5F7FA', minHeight: '100vh', padding: '24px' }}>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2" style={{ color: '#1F2937' }}>
          لوحة التحكم
        </h1>
        <p style={{ color: '#6B7280' }}>
          مرحباً بك في نظام إدارة الاسلي
        </p>
      </div>

      {/* Welcome Card */}
      <div className="mb-8 p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold mb-1" style={{ color: '#1F2937' }}>
              مرحباً عمرو محمد 👋
            </h2>
            <p style={{ color: '#6B7280' }}>
              إليك ملخص نشاطات اليوم بالمتجر الخاص بك
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-6 gap-4 mb-8">
        {/* Total Users */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded" style={{ backgroundColor: '#F0F4F8' }}>
              <Users className="h-5 w-5" style={{ color: '#3B82F6' }} />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#1F2937' }}>
            {stats.totalUsers}/1
          </div>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            المستخدمين
          </p>
          <div className="mt-2 text-xs" style={{ color: '#6B7280' }}>
            3.1%+ من الأسبوع
          </div>
        </div>

        {/* Growth Rate */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded" style={{ backgroundColor: '#F0F4F8' }}>
              <TrendingUp className="h-5 w-5" style={{ color: '#10B981' }} />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#10B981' }}>
            {stats.growthRate}
          </div>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            معدل النمو
          </p>
          <div className="mt-2 text-xs" style={{ color: '#10B981' }}>
            +3.1% من الأسبوع
          </div>
        </div>

        {/* New Orders */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded" style={{ backgroundColor: '#FEF3C7' }}>
              <ShoppingCart className="h-5 w-5" style={{ color: '#F59E0B' }} />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#1F2937' }}>
            {stats.newOrders}
          </div>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            الطلبات الجديدة
          </p>
          <div className="mt-2 text-xs" style={{ color: '#6B7280' }}>
            منذ طلبات البوم
          </div>
        </div>

        {/* Revenue */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded" style={{ backgroundColor: '#DDD6FE' }}>
              <BarChart3 className="h-5 w-5" style={{ color: '#8B5CF6' }} />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#1F2937' }}>
            0
          </div>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            اجمالي الإيرادات
          </p>
          <div className="mt-2 text-xs" style={{ color: '#6B7280' }}>
            اجمالي العملاء
          </div>
        </div>

        {/* 5th Card - Placeholder*/}
        <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded" style={{ backgroundColor: '#ECFDF5' }}>
              <AlertCircle className="h-5 w-5" style={{ color: '#059669' }} />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#1F2937' }}>
            0
          </div>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            الطلبات الجديدة
          </p>
        </div>

        {/* 6th Card - Placeholder */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <div className="flex items-center justify-between mb-4">
            <div className="p-2 rounded" style={{ backgroundColor: '#F3E8FF' }}>
              <Eye className="h-5 w-5" style={{ color: '#7C3AED' }} />
            </div>
          </div>
          <div className="text-3xl font-bold mb-1" style={{ color: '#1F2937' }}>
            ر.م
          </div>
          <p className="text-sm" style={{ color: '#6B7280' }}>
            اجمالي الطلبات
          </p>
        </div>
      </div>

      {/* Bottom Section - Orders & Products */}
      <div className="grid grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#1F2937' }}>
            أحدث الطلبات
          </h3>
          <div className="space-y-3">
            {stats.recentOrders.map((order) => (
              <div key={order.id} className="p-4 rounded border" style={{ borderColor: '#E5E7EB', backgroundColor: '#F9FAFB' }}>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium" style={{ color: '#1F2937' }}>
                    {order.orderNumber}
                  </span>
                  <span
                    className="px-2 py-1 text-xs rounded"
                    style={{
                      backgroundColor:
                        order.status === 'completed'
                          ? '#DBEAFE'
                          : order.status === 'shipped'
                            ? '#DBEAFE'
                            : '#FEF3C7',
                      color:
                        order.status === 'completed'
                          ? '#1E40AF'
                          : order.status === 'shipped'
                            ? '#1E40AF'
                            : '#92400E',
                    }}
                  >
                    {order.status === 'completed'
                      ? 'مكتمل'
                      : order.status === 'shipped'
                        ? 'مشحون'
                        : 'قيد الانتظار'}
                  </span>
                </div>
                <p className="text-sm" style={{ color: '#6B7280' }}>
                  {order.buyer}
                </p>
                <p className="text-sm font-medium" style={{ color: '#F4B400' }}>
                  ر.م {order.price}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Products */}
        <div className="p-6 rounded-lg" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB' }}>
          <h3 className="text-lg font-bold mb-4" style={{ color: '#1F2937' }}>
            المنتجات الأكثر مبيعاً
          </h3>
          <div className="space-y-3">
            {stats.popularProducts.map((product, index) => (
              <div key={product.id} className="flex items-center justify-between p-3 rounded" style={{ backgroundColor: '#F9FAFB' }}>
                <div className="flex items-center gap-3 flex-1">
                  <span
                    className="w-6 h-6 rounded flex items-center justify-center text-xs font-bold text-white"
                    style={{ backgroundColor: '#F4B400', color: '#0B1C2C' }}
                  >
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-sm" style={{ color: '#1F2937' }}>
                      {product.name}
                    </p>
                    <p className="text-xs" style={{ color: '#6B7280' }}>
                      {product.productNumber}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium" style={{ color: '#1F2937' }}>
                    ر.م {product.price}
                  </p>
                  <p className="text-xs" style={{ color: '#10B981' }}>
                    {product.createdAt}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
