import { NextRequest, NextResponse } from 'next/server'
import { getConnection } from '@/lib/db'

// @ts-ignore
import sql from 'mssql'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const query = searchParams.get('q') || ''

  try {
    const pool = await getConnection()
    
    let sqlQuery = 'SELECT * FROM dbo.inventroy_list'
    const request_obj = pool.request()

    if (query && query.length >= 2) {
      // Only search if query is at least 2 characters
      sqlQuery += ' WHERE Product_Name LIKE @query OR Inventory_Name LIKE @query'
      request_obj.input('query', sql.VarChar, `%${query}%`)
    } else if (!query) {
      // If no query, return empty to prevent loading all items on dropdown open
      return NextResponse.json([])
    }

    sqlQuery += ' ORDER BY Product_Name ASC'

    const result = await request_obj.query(sqlQuery)

    const items = result.recordset.map((row: any) => ({
      value: row.Product_Name,
      label: row.Product_Name,
      item_name: row.Product_Name,
      retail_price: row.Retail_Price,
      item_qty: row.Item_Qty,
      inventory_name: row.Inventory_Name,
    }))

    return NextResponse.json(items)
  } catch (error) {
    console.error('Error fetching inventory items:', error)
    return NextResponse.json([], { status: 500 })
  }
}
