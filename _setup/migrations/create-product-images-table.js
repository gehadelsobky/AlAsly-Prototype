const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:0000@localhost:3000/al_asly_middleware',
})

async function main() {
  try {
    // Create product_images table
    await pool.query(`
      CREATE TABLE IF NOT EXISTS product_images (
        id SERIAL PRIMARY KEY,
        product_id INTEGER NOT NULL REFERENCES custom_product_attributes(id) ON DELETE CASCADE,
        image_url TEXT NOT NULL,
        display_order INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
      CREATE INDEX IF NOT EXISTS idx_product_images_order ON product_images(product_id, display_order);
    `)
    console.log('✅ product_images table created!')
  } catch (err) {
    console.error('❌ Error creating table:', err)
  } finally {
    await pool.end()
  }
}

main()
