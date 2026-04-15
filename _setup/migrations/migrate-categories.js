const { Pool } = require('pg')

const pool = new Pool({
  connectionString: 'postgresql://postgres:0000@localhost:3000/al_asly_middleware',
})

const categoryMap = {
  'black-plain': 'أسود سادة',
  'thoob-pants': 'تونك بنطلون بدلة',
  'mens-thobe': 'جلابية رجالي',
  'jeans': 'جينز',
  'silk-colors': 'حرير ألوان',
  'winter': 'شتوي',
  'chiffon': 'شيفون',
  'kids-abayas': 'عبايات اطفال',
  'velvet': 'قطيفة'
}

async function main() {
  try {
    for (const [englishId, arabicLabel] of Object.entries(categoryMap)) {
      const result = await pool.query(
        'UPDATE custom_product_attributes SET category = $1 WHERE category = $2',
        [arabicLabel, englishId]
      )
      if (result.rowCount > 0) {
        console.log(`✓ Updated ${result.rowCount} product(s) from "${englishId}" to "${arabicLabel}"`)
      }
    }
    console.log('✅ Category migration completed!')
  } catch (err) {
    console.error('❌ Error:', err)
  } finally {
    await pool.end()
  }
}

main()
