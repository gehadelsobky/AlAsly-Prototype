const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:0000@localhost:3000/al_asly_middleware',
})

async function main() {
  try {
    // Drop existing table if it has issues
    await pool.query(`DROP TABLE IF EXISTS custom_product_attributes;`)
    
    // Create fresh table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS custom_product_attributes (
        id SERIAL PRIMARY KEY,
        item_code VARCHAR(100) NOT NULL,
        category VARCHAR(100),
        description TEXT,
        size VARCHAR(50),
        color VARCHAR(50),
        image_url TEXT,
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_custom_product_item_code ON custom_product_attributes(item_code);
    `)
    console.log('✅ custom_product_attributes table created!')
  } catch (err) {
    console.error('❌ Error creating table:', err)
  } finally {
    await pool.end()
  }
}

main()
