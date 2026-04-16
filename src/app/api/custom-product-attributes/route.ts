import { NextRequest, NextResponse } from 'next/server'
import { queryPostgres } from '@/lib/pg'

export async function GET() {
  try {
    const query = `
      SELECT * FROM custom_product_attributes
      ORDER BY created_at DESC
    `
    const results = await queryPostgres(query)
    return NextResponse.json({ success: true, data: results })
  } catch (error) {
    console.error('[API] Error fetching products:', error)
    return NextResponse.json(
      { error: 'خطأ في جلب المنتجات: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      item_code,
      category,
      description,
      size,
      color,
      image_url,
      status,
    } = body

    // Validate required fields
    if (!item_code) {
      return NextResponse.json({ error: 'اسم المنتج مطلوب' }, { status: 400 })
    }
    if (!category) {
      return NextResponse.json({ error: 'التصنيف مطلوب' }, { status: 400 })
    }
    if (!description) {
      return NextResponse.json({ error: 'الوصف مطلوب' }, { status: 400 })
    }
    if (!size) {
      return NextResponse.json({ error: 'المقاس مطلوب' }, { status: 400 })
    }
    if (!color) {
      return NextResponse.json({ error: 'اللون مطلوب' }, { status: 400 })
    }

    console.log('[API] Processing product creation:', { item_code, category })

    const query = `
      INSERT INTO custom_product_attributes 
      (item_code, category, description, size, color, image_url, status, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `

    // Build parameters array safely
    const params = []
    params.push(item_code)
    params.push(category)
    params.push(description)
    params.push(size)
    params.push(color)
    params.push(image_url || null)
    params.push(status || 'active')

    console.log('[API] Query parameters count:', params.length)

    const result = await queryPostgres(
      query,
      params
    )

    if (!result || !Array.isArray(result) || result.length === 0) {
      console.error('[API] Invalid result from database:', result)
      throw new Error('فشل في حفظ المنتج - لم يتم تلقي استجابة صحيحة من قاعدة البيانات')
    }

    const savedData = result[0]
    console.log('[API] Product attributes saved successfully:', item_code, 'ID:', savedData?.id)
    
    return NextResponse.json({ 
      success: true, 
      data: savedData,
      message: 'تم حفظ المنتج بنجاح'
    })
  } catch (error) {
    console.error('[API] Error saving custom product attributes:', error)
    const errorMessage = error instanceof Error ? error.message : 'خطأ غير معروف'
    return NextResponse.json(
      { error: 'خطأ في حفظ البيانات: ' + errorMessage },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      id,
      item_code,
      category,
      description,
      size,
      color,
      image_url,
      status,
    } = body

    if (!id) {
      return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 })
    }

    const query = `
      UPDATE custom_product_attributes
      SET 
        item_code = COALESCE($1, item_code),
        category = COALESCE($2, category),
        description = COALESCE($3, description),
        size = COALESCE($4, size),
        color = COALESCE($5, color),
        image_url = COALESCE($6, image_url),
        status = COALESCE($7, status),
        updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `

    const result = await queryPostgres(query, [
      item_code || null,
      category || null,
      description || null,
      size || null,
      color || null,
      image_url || null,
      status || null,
      id,
    ])

    if (result.length === 0) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 })
    }

    console.log('[API] Product updated successfully:', id)
    return NextResponse.json({
      success: true,
      data: result[0],
      message: 'تم تحديث المنتج بنجاح',
    })
  } catch (error) {
    console.error('[API] Error updating product:', error)
    return NextResponse.json(
      { error: 'خطأ في تحديث المنتج: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json({ error: 'معرف المنتج مطلوب' }, { status: 400 })
    }

    const query = `
      DELETE FROM custom_product_attributes
      WHERE id = $1
      RETURNING *
    `

    const result = await queryPostgres(query, [id])

    if (result.length === 0) {
      return NextResponse.json({ error: 'المنتج غير موجود' }, { status: 404 })
    }

    console.log('[API] Product deleted successfully:', id)
    return NextResponse.json({
      success: true,
      message: 'تم حذف المنتج بنجاح',
    })
  } catch (error) {
    console.error('[API] Error deleting product:', error)
    return NextResponse.json(
      { error: 'خطأ في حذف المنتج: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
