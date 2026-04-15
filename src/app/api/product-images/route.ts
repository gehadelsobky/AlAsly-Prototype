import { NextRequest, NextResponse } from 'next/server'
import { queryPostgres } from '@/lib/pg'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get('productId')

    if (!productId) {
      return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 })
    }

    const query = `
      SELECT * FROM product_images
      WHERE product_id = $1
      ORDER BY display_order ASC, created_at ASC
    `
    const results = await queryPostgres(query, [productId])
    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('[API] Error fetching product images:', error)
    return NextResponse.json(
      { error: 'خطأ في جلب الصور: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { product_id, image_url, display_order } = body

    if (!product_id) {
      return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 })
    }
    if (!image_url) {
      return NextResponse.json({ error: 'رابط الصورة مطلوب' }, { status: 400 })
    }

    // Verify product exists
    const productCheck = await queryPostgres(
      'SELECT id FROM custom_product_attributes WHERE id = $1',
      [product_id]
    )

    if (productCheck.length === 0) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 })
    }

    const query = `
      INSERT INTO product_images (product_id, image_url, display_order, created_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `

    const result = await queryPostgres(query, [
      product_id,
      image_url,
      display_order || 0,
    ])

    console.log('[API] Product image added successfully:', product_id)
    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'تم إضافة الصورة بنجاح',
    })
  } catch (error) {
    console.error('[API] Error adding product image:', error)
    return NextResponse.json(
      { error: 'خطأ في إضافة الصورة: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const imageId = searchParams.get('imageId')

    if (!imageId) {
      return NextResponse.json({ error: 'معرف الصورة مطلوب' }, { status: 400 })
    }

    const query = `
      DELETE FROM product_images
      WHERE id = $1
      RETURNING *
    `

    const result = await queryPostgres(query, [imageId])

    if (result.length === 0) {
      return NextResponse.json({ error: 'الصورة غير موجودة' }, { status: 404 })
    }

    console.log('[API] Product image deleted successfully:', imageId)
    return NextResponse.json({
      success: true,
      message: 'تم حذف الصورة بنجاح',
    })
  } catch (error) {
    console.error('[API] Error deleting product image:', error)
    return NextResponse.json(
      { error: 'خطأ في حذف الصورة: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
