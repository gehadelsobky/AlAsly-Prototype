import { NextResponse } from 'next/server'
import { getProducts } from '@/lib/db'

export async function GET() {
  try {
    console.log('[API] Fetching products from SQL Server...')
    const products = await getProducts()
    console.log('[API] Retrieved', products.length, 'products')

    return NextResponse.json({
      success: true,
      count: products.length,
      data: products,
    })
  } catch (error) {
    console.error('[API] Error fetching products:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Failed to fetch products',
      },
      { status: 500 }
    )
  }
}
