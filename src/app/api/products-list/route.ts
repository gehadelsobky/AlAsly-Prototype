import { NextRequest, NextResponse } from 'next/server'
import { queryPostgres } from '@/lib/pg'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase() || ''

  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      console.warn('[API] DATABASE_URL not configured')
      return NextResponse.json([])
    }

    let sql = 'SELECT id, product_id, price, quantity, factory FROM products_v2'
    const params: any[] = []

    if (query) {
      sql += ' WHERE LOWER(product_id) LIKE $1 OR LOWER(factory) LIKE $1'
      params.push(`%${query}%`)
    }

    sql += ' ORDER BY product_id ASC'

    const results = await queryPostgres(sql, params)

    const products = (results || []).map((row: any) => ({
      id: row.id,
      value: row.product_id,
      label: `${row.product_id} - ${row.factory}`,
      productNumber: row.product_id,
      price: parseFloat(row.price),
      quantity: row.quantity,
      manufacturer: row.factory,
    }))

    return NextResponse.json(products)
  } catch (error) {
    console.error('[API] Error fetching products:', error)
    return NextResponse.json([], { status: 500 })
  }
}
