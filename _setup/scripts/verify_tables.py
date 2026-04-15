#!/usr/bin/env python3
"""Verify all tables exist in database"""

import psycopg2

conn = psycopg2.connect(
    host="localhost",
    port=3000,
    database="al_asly_middleware",
    user="postgres",
    password="0000"
)

cursor = conn.cursor()

# Get all tables
cursor.execute("""
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    ORDER BY table_name
""")

tables = cursor.fetchall()

print("\n" + "="*60)
print("TABLES IN al_asly_middleware DATABASE")
print("="*60)
print(f"\nTotal tables: {len(tables)}\n")

for table in tables:
    # Get row count
    cursor.execute(f"SELECT COUNT(*) FROM {table[0]}")
    count = cursor.fetchone()[0]
    print(f"✓ {table[0]:30} - {count:,} rows")

cursor.close()
conn.close()

print("\n" + "="*60)
