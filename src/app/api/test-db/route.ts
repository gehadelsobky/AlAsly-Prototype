import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/db'

export async function GET() {
  try {
    console.log('[Test DB] Fetching inventory items...')
    const pool = await getConnection()
    
    // First, try to get basic columns that definitely exist
    let result
    try {
      const result2 = await pool.request().query(`
        SELECT 
          Item_Name as Inventory_code,
          Item_Name,
          Inventory_Name,
          Retail_Price,
          Item_Qty
        FROM dbo.AI_Inventory
        ORDER BY Item_Name ASC
      `)
      result = result2
    } catch (queryError) {
      console.log('[Test DB] Primary query failed, trying fallback...')
      // If the above fails, try with just basic columns
      result = await pool.request().query(`
        SELECT 
          Item_Name as Inventory_code,
          Inventory_Name
        FROM dbo.AI_Inventory
        ORDER BY Item_Name ASC
      `)
    }
    
    console.log('[Test DB] Inventory fetch successful!')
    console.log('[Test DB] Total items:', result.recordset.length)
    if (result.recordset.length > 0) {
      console.log('[Test DB] Sample item:', result.recordset[0])
    }

    return NextResponse.json({
      success: true,
      message: 'Inventory items fetched successfully',
      data: result.recordset,
      count: result.recordset.length,
    })
  } catch (error) {
    console.error('[Test DB] Query error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Query failed',
        data: [],
      },
      { status: 500 }
    )
  }
}
