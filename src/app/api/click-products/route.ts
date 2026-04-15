import { NextRequest, NextResponse } from 'next/server'

// Fallback to mock data
const MOCK_PRODUCTS = [
  { id: '1', name: 'قميص أحمر', productNumber: 'SHIRT-001', price: 50, quantity: 100, manufacturer: 'العلامة الأولى' },
  { id: '2', name: 'قميص أزرق', productNumber: 'SHIRT-002', price: 50, quantity: 150, manufacturer: 'العلامة الأولى' },
  { id: '3', name: 'بنطال أسود', productNumber: 'PANTS-001', price: 80, quantity: 80, manufacturer: 'الصانع الثاني' },
  { id: '4', name: 'حذاء رياضي', productNumber: 'SHOE-001', price: 120, quantity: 60, manufacturer: 'صانع الأحذية' },
  { id: '5', name: 'جاكيت جلدي', productNumber: 'JACKET-001', price: 200, quantity: 40, manufacturer: 'صانع المعاطف' },
  ...Array.from({ length: 7995 }, (_, i) => ({
    id: String(i + 6),
    name: `منتج ${i + 6}`,
    productNumber: `PROD-${String(i + 6).padStart(5, '0')}`,
    price: Math.floor(Math.random() * 500) + 10,
    quantity: Math.floor(Math.random() * 200) + 5,
    manufacturer: `الصانع ${Math.floor(Math.random() * 50) + 1}`,
  }))
]

// Simple fuzzy search function
function fuzzySearch(query: string, items: typeof MOCK_PRODUCTS) {
  if (!query.trim()) return items.slice(0, 20)
  
  const lowerQuery = query.toLowerCase()
  
  return items
    .filter(item => 
      item.name.toLowerCase().includes(lowerQuery) ||
      item.productNumber.toLowerCase().includes(lowerQuery)
    )
    .slice(0, 50)
}

async function queryDatabase(q: string) {
  try {
    // Import dynamically to avoid issues if pg is not installed
    const { Pool } = await import('pg')
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })

    const client = await pool.connect()
    try {
      const query_text = `
        SELECT id, name, name_ar, price, stock_quantity, factory, click_id
        FROM click_products
        WHERE name ILIKE $1 OR name_ar ILIKE $1 OR click_id::text = $1
        LIMIT 50
      `
      const results = await client.query(query_text, [`%${q}%`])
      
      return results.rows.map((product: any) => ({
        value: product.id,
        label: `${product.name} (${product.click_id})`,
        productNumber: product.click_id,
        name: product.name,
        price: product.price,
        quantity: product.stock_quantity,
        manufacturer: product.factory,
      }))
    } finally {
      client.release()
    }
  } catch (error) {
    console.warn('Database query failed:', error)
    return null
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const q = searchParams.get('q') || ''

    // Try database first if configured
    if (process.env.DATABASE_URL) {
      const dbResults = await queryDatabase(q)
      if (dbResults) {
        return NextResponse.json(dbResults, { status: 200 })
      }
    }

    // Fall back to mock data
    const results = fuzzySearch(q, MOCK_PRODUCTS)

    return NextResponse.json(
      results.map(product => ({
        value: product.id,
        label: `${product.name} (${product.productNumber})`,
        ...product,
      })),
      { status: 200 }
    )
  } catch (error) {
    console.error('Product search error:', error)
    return NextResponse.json(
      { error: 'حدث خطأ في البحث' },
      { status: 500 }
    )
  }
}
