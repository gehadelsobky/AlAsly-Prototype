const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:0000@localhost:3000/al_asly_middleware',
});

async function cleanup() {
  const client = await pool.connect();
  try {
    console.log('Starting cleanup of unused tables...\n');

    const dropStatements = [
      'DROP TABLE IF EXISTS product_embeddings CASCADE;',
      'DROP TABLE IF EXISTS product_colors CASCADE;',
      'DROP TABLE IF EXISTS product_categories CASCADE;',
      'DROP TABLE IF EXISTS product_sizes CASCADE;',
      'DROP TABLE IF EXISTS sync_log CASCADE;',
      'DROP TABLE IF EXISTS colors CASCADE;',
      'DROP TABLE IF EXISTS categories CASCADE;',
    ];

    for (const statement of dropStatements) {
      try {
        console.log(`Executing: ${statement}`);
        await client.query(statement);
        console.log('✓ Success\n');
      } catch (error) {
        console.error(`✗ Error: ${error.message}\n`);
      }
    }

    console.log('\n✅ Cleanup completed!');
    console.log('\nRemaining tables in use:');
    console.log('- users');
    console.log('- click_products');
    console.log('- products');
    console.log('- product_images');
    console.log('- custom_product_attributes');
    console.log('- products_v2');
  } finally {
    await client.release();
    await pool.end();
  }
}

cleanup().catch(console.error);
