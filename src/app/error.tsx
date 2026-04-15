"use client"

import { useEffect } from "react"

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    // Optionally log error to an error reporting service
    // console.error(error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-red-50 text-red-900">
      <h2 className="text-2xl font-bold mb-4">حدث خطأ غير متوقع</h2>
      <p className="mb-6">{error.message}</p>
      <button
        className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        onClick={() => reset()}
      >
        إعادة المحاولة
      </button>
    </div>
  )
}
