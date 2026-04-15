const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:0000@localhost:3000/al_asly_middleware',
});

async function exportDatabase() {
  const client = await pool.connect();
  try {
    console.log('Exporting database...\n');

    // Get all table names
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    const tables = tablesResult.rows.map(row => row.table_name);
    console.log(`Found ${tables.length} tables:\n`);
    tables.forEach(table => console.log(`  - ${table}`));

    let sqlContent = '-- Database Export\n';
    sqlContent += `-- Exported: ${new Date().toISOString()}\n\n`;

    // Export each table
    for (const table of tables) {
      console.log(`\nExporting table: ${table}`);

      // Get table structure
      const structureResult = await client.query(`
        SELECT column_name, data_type, is_nullable, column_default
        FROM information_schema.columns 
        WHERE table_name = $1
        ORDER BY ordinal_position
      `, [table]);

      // Get table data
      const dataResult = await client.query(`SELECT * FROM "${table}"`);

      // Build CREATE TABLE statement
      let createTableSQL = `\nCREATE TABLE IF NOT EXISTS "${table}" (\n`;
      const columns = structureResult.rows.map(col => {
        let colDef = `  "${col.column_name}" ${col.data_type}`;
        if (col.column_default) colDef += ` DEFAULT ${col.column_default}`;
        if (col.is_nullable === 'NO') colDef += ' NOT NULL';
        return colDef;
      });
      createTableSQL += columns.join(',\n') + '\n);\n';
      sqlContent += createTableSQL;

      // Add INSERT statements
      if (dataResult.rows.length > 0) {
        const columnNames = Object.keys(dataResult.rows[0]);
        sqlContent += `\nINSERT INTO "${table}" (${columnNames.map(c => `"${c}"`).join(', ')}) VALUES\n`;

        const insertValues = dataResult.rows.map(row => {
          const values = columnNames.map(col => {
            const val = row[col];
            if (val === null) return 'NULL';
            if (typeof val === 'string') return `'${val.replace(/'/g, "''")}'`;
            if (val instanceof Date) return `'${val.toISOString()}'`;
            return val;
          });
          return `(${values.join(', ')})`;
        });
        
        sqlContent += insertValues.join(',\n') + ';\n';
        console.log(`  ✓ Exported ${dataResult.rows.length} rows`);
      }
    }

    // Save to file
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = `database_export_${timestamp}.sql`;
    const filepath = path.join(process.cwd(), filename);

    fs.writeFileSync(filepath, sqlContent);
    console.log(`\n✅ Export completed!`);
    console.log(`📁 Saved to: ${filepath}`);
    console.log(`📊 File size: ${(fs.statSync(filepath).size / 1024).toFixed(2)} KB`);

  } catch (error) {
    console.error('❌ Export failed:', error.message);
  } finally {
    await client.release();
    await pool.end();
  }
}

exportDatabase();
