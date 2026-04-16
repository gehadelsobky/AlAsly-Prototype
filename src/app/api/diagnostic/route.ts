import { NextResponse } from 'next/server'
import { getConnection } from '@/lib/db'

export async function GET() {
  try {
    console.log('[Diagnostic] Getting database information...')
    const pool = await getConnection()
    
    // Get all tables in the database
    const tablesResult = await pool.request().query(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_TYPE = 'BASE TABLE'
      ORDER BY TABLE_NAME
    `)
    
    console.log('[Diagnostic] Tables found:', tablesResult.recordset.length)
    
    // Try to get column information for inventroy_list
    const columnsResult = await pool.request().query(`
      SELECT COLUMN_NAME, DATA_TYPE, IS_NULLABLE
      FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'inventroy_list'
      ORDER BY ORDINAL_POSITION
    `)
    
    console.log('[Diagnostic] Columns in inventroy_list:', columnsResult.recordset.length)
    
    // Try to count rows in inventroy_list
    let rowCount = 0
    try {
      const countResult = await pool.request().query('SELECT COUNT(*) as count FROM dbo.inventroy_list')
      rowCount = countResult.recordset[0]?.count || 0
    } catch (e) {
      console.error('[Diagnostic] Error counting rows:', e)
    }

    return NextResponse.json({
      success: true,
      message: 'Database diagnostic successful',
      tables: tablesResult.recordset,
      aiInventoryColumns: columnsResult.recordset,
      aiInventoryRowCount: rowCount,
    })
  } catch (error) {
    console.error('[Diagnostic] Error:', error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Diagnostic failed',
      },
      { status: 500 }
    )
  }
}
