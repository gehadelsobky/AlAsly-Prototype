const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:0000@localhost:3000/al_asly_middleware',
})

const colorMap = {
  'red': 'أحمر',
  'blue': 'أزرق',
  'black': 'أسود',
  'white': 'أبيض',
  'green': 'أخضر',
  'yellow': 'أصفر',
  'gray': 'رمادي',
  'brown': 'بني'
}

async function main() {
  try {
    // Get all existing colors in the database
    const result = await pool.query('SELECT DISTINCT color FROM custom_product_attributes WHERE color IS NOT NULL AND color != \'\'')
    
    console.log('Current colors in database:')
    result.rows.forEach(row => console.log(`  - ${row.color}`))
    
    // For each product, convert color IDs to Arabic labels
    const products = await pool.query('SELECT id, color FROM custom_product_attributes WHERE color IS NOT NULL AND color != \'\'')
    
    for (const product of products.rows) {
      const colorIds = product.color.split(', ').map(c => c.trim())
      const arabicColors = colorIds.map(id => {
        // Check if it's already Arabic (contains Arabic characters)
        if (/[\u0600-\u06FF]/.test(id)) {
          return id
        }
        // Convert English ID to Arabic
        return colorMap[id] || id
      })
      const arabicColorString = arabicColors.join(', ')
      
      if (product.color !== arabicColorString) {
        await pool.query(
          'UPDATE custom_product_attributes SET color = $1 WHERE id = $2',
          [arabicColorString, product.id]
        )
        console.log(`✓ Updated product ${product.id}: "${product.color}" → "${arabicColorString}"`)
      }
    }
    
    console.log('✅ Color migration completed!')
  } catch (err) {
    console.error('❌ Error:', err)
  } finally {
    await pool.end()
  }
}

main()
