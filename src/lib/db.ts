import sql from 'mssql'

const config: sql.config = {
  server: '161.97.108.159',
  database: 'asly2026',
  authentication: {
    type: 'default',
    options: {
      userName: 'asly_readonlyUser',
      password: 'asly_P@ssw0rd',
    },
  },
  options: {
    encrypt: true,
    trustServerCertificate: true,
    connectTimeout: 30000,
    requestTimeout: 30000,
  },
}

let connectionPool: sql.ConnectionPool | null = null

export async function getConnection(): Promise<sql.ConnectionPool> {
  if (connectionPool && connectionPool.connected) {
    return connectionPool
  }

  try {
    connectionPool = new sql.ConnectionPool(config)
    await connectionPool.connect()
    console.log('[DB] Connected to SQL Server database')
    return connectionPool
  } catch (error) {
    console.error('[DB] Connection error:', error)
    throw error
  }
}

export async function closeConnection(): Promise<void> {
  if (connectionPool) {
    await connectionPool.close()
    connectionPool = null
    console.log('[DB] Disconnected from SQL Server database')
  }
}

export async function executeQuery<T>(query: string, params?: Record<string, any>): Promise<T[]> {
  try {
    const pool = await getConnection()
    const request = pool.request()

    // Add parameters if provided
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        request.input(key, value)
      }
    }

    const result = await request.query(query)
    return result.recordset as T[]
  } catch (error) {
    console.error('[DB] Query error:', error)
    throw error
  }
}

export interface Product {
  id: number
  name: string
  price: number
  quantity: number
  [key: string]: any
}

export async function getProducts(): Promise<Product[]> {
  return executeQuery<Product>('SELECT * FROM dbo.inventroy_list')
}

export async function getProductById(id: number): Promise<Product | null> {
  const results = await executeQuery<Product>(
    'SELECT * FROM dbo.inventroy_list WHERE id = @id',
    { id }
  )
  return results[0] || null
}
