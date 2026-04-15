import { Pool, QueryResult } from 'pg'

let pool: Pool | null = null

function getPool(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL
    
    if (!connectionString) {
      throw new Error('DATABASE_URL environment variable is not set')
    }
    
    pool = new Pool({
      connectionString: connectionString,
    })

    pool.on('error', (err) => {
      console.error('[PG] Unexpected error on idle client', err)
    })
  }
  
  return pool
}

export async function queryPostgres<T = any>(
  text: string,
  params?: any[]
): Promise<T[]> {
  try {
    const pg_pool = getPool()
    
    // Ensure params is always an array to avoid undefined issues
    const queryParams = params && Array.isArray(params) ? params : []
    
    if (queryParams.length > 0) {
      console.log(`[PG] Executing query with ${queryParams.length} parameters`)
    }
    
    const result: QueryResult<T> = await pg_pool.query(text, queryParams)
    
    // Safely extract rows - ensure we always return an array
    const rows = result.rows as T[]
    
    if (rows.length > 0) {
      console.log(`[PG] Query returned ${rows.length} row(s)`)
    }
    
    return Array.isArray(rows) ? rows : []
  } catch (error) {
    console.error('[PG] Query error:', error)
    throw error
  }
}

export async function queryPostgresSingle<T = any>(
  text: string,
  params?: any[]
): Promise<T | null> {
  try {
    const results = await queryPostgres<T>(text, params)
    
    if (!results || !Array.isArray(results)) {
      return null
    }
    
    if (results.length === 0) {
      return null
    }
    
    return results[0]
  } catch (error) {
    console.error('[PG] Single query error:', error)
    throw error
  }
}

export async function closePostgres(): Promise<void> {
  try {
    if (pool) {
      await pool.end()
      pool = null
      console.log('[PG] Disconnected from PostgreSQL database')
    }
  } catch (error) {
    console.error('[PG] Error closing pool:', error)
    throw error
  }
}
