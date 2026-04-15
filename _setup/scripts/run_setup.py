#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
Auto setup script - runs database setup without prompts
"""

import os
import sys
import psycopg2
from psycopg2 import sql
from dotenv import load_dotenv

# Load .env.local file
load_dotenv('.env.local')

def load_sql_file(filename):
    """Load SQL file contents from disk"""
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            return f.read()
    except FileNotFoundError:
        print(f"ERROR: {filename} not found")
        return None

def run_setup():
    """Run the complete setup"""
    password = "0000"
    port = 3000
    
    print("\n" + "="*60)
    print("AL ASLY LOCAL DATABASE SETUP")
    print("="*60)
    
    # Step 1: Create database
    print("\n[1/4] Creating database...")
    try:
        conn = psycopg2.connect(
            host="localhost",
            port=port,
            database="postgres",
            user="postgres",
            password=password
        )
        conn.autocommit = True
        
        with conn.cursor() as cur:
            cur.execute("DROP DATABASE IF EXISTS al_asly_middleware")
            cur.execute("CREATE DATABASE al_asly_middleware")
            print("[OK] Database created")
        
        conn.close()
    except Exception as e:
        print(f"[ERROR] {e}")
        return False
    
    # Step 2: Connect to new database
    print("[2/4] Connecting to database...")
    try:
        conn = psycopg2.connect(
            host="localhost",
            port=port,
            database="al_asly_middleware",
            user="postgres",
            password=password
        )
        print("[OK] Connected")
    except Exception as e:
        print(f"[ERROR] {e}")
        return False
    
    # Step 3: Load SQL files
    print("[3/4] Loading SQL scripts...")
    ext_sql = load_sql_file('001_extensions.sql')
    schema_sql = load_sql_file('002_schema.sql')
    seed_sql = load_sql_file('003_seed.sql')
    
    if not all([ext_sql, schema_sql, seed_sql]):
        print("[ERROR] Could not load SQL files")
        return False
    
    print("[OK] SQL files loaded")
    
    # Step 4: Execute scripts
    print("[4/4] Executing scripts...")
    cursor = conn.cursor()
    
    try:
        cursor.execute(ext_sql)
        conn.commit()
        print("[OK] Extensions created")
    except Exception as e:
        print(f"[ERROR] Extensions: {e}")
        conn.rollback()
    
    try:
        cursor.execute(schema_sql)
        conn.commit()
        print("[OK] Schema created")
    except Exception as e:
        print(f"[ERROR] Schema: {e}")
        conn.rollback()
    
    try:
        cursor.execute(seed_sql)
        conn.commit()
        print("[OK] Seed data inserted")
    except Exception as e:
        print(f"[ERROR] Seed data: {e}")
        conn.rollback()
    
    # Verify
    print("\n" + "="*60)
    print("VERIFICATION")
    print("="*60)
    
    tables = ['users', 'categories', 'colors', 'click_products', 'products',
              'product_sizes', 'product_colors', 'product_categories',
              'product_images', 'product_embeddings', 'sync_log']
    
    for table in tables:
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            count = cursor.fetchone()[0]
            print(f"{table:25} : {count:,} rows")
        except:
            print(f"{table:25} : ERROR")
    
    cursor.close()
    conn.close()
    
    print("\n" + "="*60)
    print("SUCCESS! Database is ready")
    print("="*60)
    print("\nDev Credentials:")
    print("Admin:     admin@alasly.com")
    print("Seller 1:  ahmed@alasly.com")
    print("Seller 2:  fatima@alasly.com")
    print("Password:  Test1234!")
    
    return True

if __name__ == '__main__':
    if run_setup():
        sys.exit(0)
    else:
        sys.exit(1)
