#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""Insert production products schema into database"""

import psycopg2
from dotenv import load_dotenv
import os

load_dotenv('.env.local')

def insert_schema():
    """Insert the production schema"""
    password = "0000"
    port = 3000
    
    print("\n" + "="*60)
    print("INSERTING PRODUCTION PRODUCTS SCHEMA")
    print("="*60)
    
    try:
        conn = psycopg2.connect(
            host="localhost",
            port=port,
            database="al_asly_middleware",
            user="postgres",
            password=password
        )
        
        with open('004_products_schema.sql', 'r', encoding='utf-8') as f:
            sql = f.read()
        
        cursor = conn.cursor()
        cursor.execute(sql)
        conn.commit()
        
        print("[OK] Schema created successfully!")
        
        # Verify tables exist
        cursor.execute("""
            SELECT table_name 
            FROM information_schema.tables 
            WHERE table_schema = 'public' 
            AND table_name LIKE '%_v2' 
            OR table_name LIKE '%_enum'
            OR table_name = 'product_full_details'
        """)
        
        tables = cursor.fetchall()
        print(f"\n[OK] Created {len(tables)} tables/views:")
        for table in tables:
            print(f"     - {table[0]}")
        
        cursor.close()
        conn.close()
        
        print("\n" + "="*60)
        print("SUCCESS! You can now use products_v2 table")
        print("="*60)
        print("\nExample insert:")
        print("""
INSERT INTO products_v2 (
  product_id, product_price, product_quantity, 
  product_factory, product_details, product_status
) VALUES (
  'PROD-001', 150.00, 100, 
  'Delta Textiles', 'Premium white cotton shirt with comfortable fit', true
);
        """)
        
        return True
        
    except Exception as e:
        print(f"[ERROR] {e}")
        return False

if __name__ == '__main__':
    insert_schema()
