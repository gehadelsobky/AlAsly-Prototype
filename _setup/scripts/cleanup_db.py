#!/usr/bin/env python3
"""Delete all tables except the production products schema"""

import psycopg2

conn = psycopg2.connect(
    host="localhost",
    port=3000,
    database="al_asly_middleware",
    user="postgres",
    password="0000"
)

cursor = conn.cursor()

print("\n" + "="*60)
print("CLEANING UP DATABASE - KEEPING ONLY PRODUCTS_V2 SCHEMA")
print("="*60)

# Tables to delete
tables_to_delete = [
    'users',
    'categories',
    'colors',
    'click_products',
    'products',
    'product_sizes',
    'product_colors',
    'product_categories',
    'product_images',
    'product_embeddings',
    'sync_log'
]

try:
    for table in tables_to_delete:
        cursor.execute(f"DROP TABLE IF EXISTS {table} CASCADE")
        print(f"✓ Deleted: {table}")
    
    conn.commit()
    print("\n" + "="*60)
    print("CLEANUP COMPLETE - REMAINING TABLES:")
    print("="*60)
    
    # Show remaining tables
    cursor.execute("""
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name
    """)
    
    tables = cursor.fetchall()
    for table in tables:
        cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
        count = cursor.fetchone()[0]
        print(f"✓ {table[0]:30} - {count:,} rows")
    
    cursor.close()
    conn.close()
    
    print("\n" + "="*60)
    print("SUCCESS! Now only products_v2 schema remains")
    print("="*60 + "\n")
    
except Exception as e:
    print(f"\n[ERROR] {e}")
    conn.rollback()
