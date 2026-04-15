import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q')?.toLowerCase() || ''

  try {
    // Check if database is configured
    if (!process.env.DATABASE_URL) {
      return NextResponse.json([])
    }

    // Import dynamically to avoid issues if pg is not installed
    const { Pool } = await import('pg')
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
    })

    const client = await pool.connect()
    try {
      let sql = 'SELECT id, product_id, price, quantity, factory FROM products_v2'
      const params: any[] = []

      if (query) {
        sql += ' WHERE LOWER(product_id) LIKE $1 OR LOWER(factory) LIKE $1'
        params.push(`%${query}%`)
      }

      sql += ' ORDER BY product_id ASC'

      const result = await client.query(sql, params)

      const products = result.rows.map(row => ({
        id: row.id,
        value: row.product_id,
        label: `${row.product_id} - ${row.factory}`,
        productNumber: row.product_id,
        price: parseFloat(row.price),
        quantity: row.quantity,
        manufacturer: row.factory,
      }))

      return NextResponse.json(products)
    } finally {
      client.release()
      await pool.end()
    }
  } catch (error) {
    console.error('Error fetching products:', error)
    return NextResponse.json([])
  }
}
