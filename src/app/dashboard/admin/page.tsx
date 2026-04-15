import { ProtectedRoute } from '@/components/ProtectedRoute'
import Link from 'next/link'

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRoles={['admin']}>
      <div className="p-8 min-h-screen" style={{ backgroundColor: '#F5F7FA' }} dir="rtl">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-4" style={{ color: '#1F2937' }}>
            لوحة التحكم الإدارية
          </h1>
          <p className="mb-8" style={{ color: '#6B7280' }}>
            هذه الصفحة متاحة فقط لمديري النظام
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Admin Card 1 */}
            <div
              className="p-6 rounded-lg border"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
            >
              <h2 className="text-xl font-bold mb-2" style={{ color: '#F4B400' }}>
                إدارة المستخدمين
              </h2>
              <p style={{ color: '#6B7280' }}>
                إضافة وتعديل وحذف المستخدمين وإدارة صلاحياتهم
              </p>
            </div>

            {/* Admin Card 2 */}
            <div
              className="p-6 rounded-lg border"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
            >
              <h2 className="text-xl font-bold mb-2" style={{ color: '#F4B400' }}>
                التقارير
              </h2>
              <p style={{ color: '#6B7280' }}>
                عرض التقارير المفصلة والإحصائيات الشاملة
              </p>
            </div>

            {/* Admin Card 3 */}
            <div
              className="p-6 rounded-lg border"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
            >
              <h2 className="text-xl font-bold mb-2" style={{ color: '#F4B400' }}>
                إعدادات النظام
              </h2>
              <p style={{ color: '#6B7280' }}>
                تخصيص إعدادات النظام والتكوينات
              </p>
            </div>

            {/* Admin Card 4 */}
            <div
              className="p-6 rounded-lg border"
              style={{ backgroundColor: '#FFFFFF', borderColor: '#E5E7EB' }}
            >
              <h2 className="text-xl font-bold mb-2" style={{ color: '#F4B400' }}>
                سجل الأنشطة
              </h2>
              <p style={{ color: '#6B7280' }}>
                عرض سجل جميع الأنشطة والعمليات
              </p>
            </div>
          </div>

          {/* Back Link */}
          <Link
            href="/dashboard"
            className="inline-block mt-8 px-6 py-3 rounded-lg font-bold transition-all"
            style={{ backgroundColor: '#F4B400', color: '#0B1C2C' }}
            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#DAA00F')}
            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#F4B400')}
          >
            العودة إلى لوحة التحكم
          </Link>
        </div>
      </div>
    </ProtectedRoute>
  )
}
