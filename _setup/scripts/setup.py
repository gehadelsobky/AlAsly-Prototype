#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
================================================================================
FILE: setup.py
PURPOSE: Bootstrap Al Asly database schema and seed data on Neon PostgreSQL
RUN ORDER: Fourth, after 001, 002, 003 SQL files exist
USAGE: python setup.py
================================================================================
"""

import os
import sys
import psycopg2
import psycopg2.errors
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
        print(f"ERROR: {filename} not found in current directory")
        sys.exit(1)

def run_sql_script(connection, script_content, script_name):
    """Execute a SQL script safely"""
    cursor = connection.cursor()
    try:
        cursor.execute(script_content)
        connection.commit()
        print(f"[OK] {script_name} executed successfully")
        return True
    except psycopg2.Error as e:
        connection.rollback()
        print(f"[ERROR] {script_name} failed: {e.pgerror}")
        return False
    finally:
        cursor.close()

def get_row_counts(connection):
    """Query table row counts to verify seed data"""
    cursor = connection.cursor()
    tables = [
        'users', 'categories', 'colors', 'click_products', 'products',
        'product_sizes', 'product_colors', 'product_categories',
        'product_images', 'product_embeddings', 'sync_log'
    ]
    
    print("\n" + "="*60)
    print("TABLE ROW COUNTS (Seed Data Verification)")
    print("="*60)
    
    for table in tables:
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {table};")
            count = cursor.fetchone()[0]
            print(f"{table:25} : {count:,} rows")
        except psycopg2.Error as e:
            print(f"{table:25} : ERROR ({e.pgerror})")
    
    cursor.close()
    print("="*60 + "\n")

def main():
    # ========================================================================
    # STEP 1: Read database connection string from environment
    # ========================================================================
    database_url = os.getenv('DATABASE_URL')
    if not database_url:
        print("ERROR: DATABASE_URL environment variable not set")
        print("Set it from .env: export DATABASE_URL='postgresql://...'")
        sys.exit(1)
    
    # ========================================================================
    # STEP 2: Connect to database
    # ========================================================================
    print("Connecting to Al Asly database...")
    try:
        connection = psycopg2.connect(database_url)
        print("[OK] Connected successfully\n")
    except psycopg2.Error as e:
        print(f"[ERROR] Connection failed: {e}")
        sys.exit(1)
    
    # ========================================================================
    # STEP 3: Load all SQL files
    # ========================================================================
    print("Loading SQL scripts...")
    extensions_sql = load_sql_file('001_extensions.sql')
    schema_sql = load_sql_file('002_schema.sql')
    seed_sql = load_sql_file('003_seed.sql')
    print("[OK] All SQL files loaded\n")
    
    # ========================================================================
    # STEP 4: Execute SQL scripts in order
    # ========================================================================
    print("="*60)
    print("EXECUTING SETUP SCRIPTS")
    print("="*60 + "\n")
    
    success = True
    
    # Extensions first
    if not run_sql_script(connection, extensions_sql, "001_extensions.sql"):
        success = False
    
    # Schema second
    if success and not run_sql_script(connection, schema_sql, "002_schema.sql"):
        success = False
    
    # Seed data third
    if success and not run_sql_script(connection, seed_sql, "003_seed.sql"):
        success = False
    
    # ========================================================================
    # STEP 5: Verify results
    # ========================================================================
    if success:
        print("\n[OK] All scripts executed successfully!")
        get_row_counts(connection)
        
        # Print dev credentials
        print("="*60)
        print("DEV CREDENTIALS (all password: Test1234!)")
        print("="*60)
        print("Admin:       admin@alasly.com")
        print("Seller 1:    ahmed@alasly.com    (+201001234567)")
        print("Seller 2:    fatima@alasly.com   (+201001234568)")
        print("Seller 3:    karim@alasly.com    (+201001234569)")
        print("Seller 4:    aisha@alasly.com    (+201001234570)")
        print("Seller 5:    hassan@alasly.com   (+201001234571)")
        print("Seller 6:    layla@alasly.com    (+201001234572)")
        print("Reseller:    reseller@alasly.com")
        print("="*60 + "\n")
    else:
        print("\n[ERROR] Setup failed. Please check errors above.")
        connection.close()
        sys.exit(1)
    
    # ========================================================================
    # STEP 6: Cleanup and close connection
    # ========================================================================
    connection.close()
    print("[OK] Database connection closed")
    print("[OK] Al Asly database is ready for Phase 1 portal!\n")

if __name__ == '__main__':
    main()
