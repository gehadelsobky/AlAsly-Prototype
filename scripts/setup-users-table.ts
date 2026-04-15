import { Pool } from 'pg'

const pool = new Pool({
  connectionString: 'postgresql://postgres:0000@localhost:3000/al_asly_middleware',
})

async function createUsersTable() {
  try {
    console.log('Connecting to PostgreSQL...')
    
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        phone_number VARCHAR(20),
        encrypted_password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    `

    console.log('Creating users table...')
    await pool.query(createTableQuery)
    
    console.log('✅ Users table created successfully!')
    
    // Verify the table exists
    const result = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      );
    `)
    
    if (result.rows[0].exists) {
      console.log('✅ Table verified in database')
    }
    
    await pool.end()
  } catch (error) {
    console.error('❌ Error creating users table:', error)
    process.exit(1)
  }
}

createUsersTable()
