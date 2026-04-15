import { Pool } from 'pg'

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

pool.on('error', (err) => {
  console.error('[PG] Unexpected error on idle client', err)
})

export async function queryPostgres<T>(
  text: string,
  params?: any[]
): Promise<T[]> {
  try {
    const result = await pool.query(text, params)
    return result.rows as T[]
  } catch (error) {
    console.error('[PG] Query error:', error)
    throw error
  }
}

export async function queryPostgresSingle<T>(
  text: string,
  params?: any[]
): Promise<T | null> {
  const results = await queryPostgres<T>(text, params)
  return results[0] || null
}

export async function closePostgres(): Promise<void> {
  await pool.end()
  console.log('[PG] Disconnected from PostgreSQL database')
}
