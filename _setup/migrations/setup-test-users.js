const { Pool } = require('pg')
const crypto = require('crypto')

const pool = new Pool({
  connectionString: 'postgresql://postgres:0000@localhost:3000/al_asly_middleware',
})

// Simple password hashing for demo (in production, use bcrypt)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

const testUsers = [
  {
    email: 'admin@example.com',
    first_name: 'مدير',
    last_name: 'النظام',
    phone_number: '+966501234567',
    password: 'admin123',
    role: 'admin'
  },
  {
    email: 'seller@example.com',
    first_name: 'بائع',
    last_name: 'رئيسي',
    phone_number: '+966502345678',
    password: 'seller123',
    role: 'seller'
  },
  {
    email: 'reseller@example.com',
    first_name: 'موزع',
    last_name: 'معتمد',
    phone_number: '+966503456789',
    password: 'reseller123',
    role: 'reseller'
  }
]

async function createTestUsers() {
  try {
    console.log('Connecting to PostgreSQL...')
    
    // Clear existing users
    console.log('Clearing existing test users...')
    await pool.query('DELETE FROM users WHERE email IN ($1, $2, $3)', 
      [testUsers[0].email, testUsers[1].email, testUsers[2].email]
    )
    console.log('✅ Cleared existing users')

    // Insert test users
    for (const user of testUsers) {
      const hashedPassword = hashPassword(user.password)
      
      await pool.query(
        'INSERT INTO users (email, first_name, last_name, phone_number, encrypted_password, role) VALUES ($1, $2, $3, $4, $5, $6)',
        [user.email, user.first_name, user.last_name, user.phone_number, hashedPassword, user.role]
      )
      
      console.log(`✅ Created user: ${user.email} (${user.role})`)
    }

    // Verify users were created
    const result = await pool.query('SELECT id, email, first_name, last_name, role FROM users')
    console.log('\n📋 Users in database:')
    result.rows.forEach(row => {
      console.log(`  - ${row.email} (${row.role}) - ${row.first_name} ${row.last_name}`)
    })

    await pool.end()
    console.log('\n✅ Test users created successfully!')
  } catch (error) {
    console.error('❌ Error creating test users:', error.message)
    process.exit(1)
  }
}

createTestUsers()
