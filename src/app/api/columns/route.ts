import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/db'

export async function GET() {
  try {
    const pool = await getConnection()
    
    // Get column information for inventroy_list using proper schema reference
    const result = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_SCHEMA = 'dbo' AND TABLE_NAME = 'inventroy_list'
      ORDER BY ORDINAL_POSITION
    `)

    const columns = result.recordset.map((r: any) => ({
      name: r.COLUMN_NAME,
      type: r.DATA_TYPE
    }))

    return NextResponse.json({
      success: true,
      count: columns.length,
      columns: columns
    })
  } catch (error) {
    console.error('[Columns] Error:', error)
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Error',
        details: error
      },
      { status: 500 }
    )
  }
}
