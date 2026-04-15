import type { Metadata } from 'next'
import '../globals.css'
import { Sidebar } from '@/components/Sidebar'
import { Header } from '@/components/Header'

export const metadata: Metadata = {
  title: 'الأصلي - نظام إدارة المنتجات',
  description: 'منصة احترافية لإدارة المنتجات والمستودعات',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body style={{ backgroundColor: '#F5F7FA', color: '#1F2937', direction: 'rtl' }}>
        <Sidebar />
        <Header />
        <main className="mr-64 mt-16 min-h-screen p-6">
          {children}
        </main>
      </body>
    </html>
  )
}
