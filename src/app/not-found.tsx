export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-yellow-50 text-yellow-900">
      <h2 className="text-2xl font-bold mb-4">الصفحة غير موجودة</h2>
      <p className="mb-6">عذراً، الصفحة التي تبحث عنها غير متوفرة.</p>
      <a href="/" className="px-4 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700">العودة للرئيسية</a>
    </div>
  )
}
