#!/usr/bin/env python3
"""
Local PostgreSQL Database Setup Script
Handles both database creation and schema initialization
"""

import os
import sys
import subprocess

def check_postgres_installed():
    """Check if PostgreSQL is installed"""
    try:
        result = subprocess.run(['pg_isready', '--version'], capture_output=True, text=True)
        return result.returncode == 0
    except FileNotFoundError:
        return False

def print_postgres_install_instructions():
    """Print PostgreSQL installation instructions"""
    print("\n❌ PostgreSQL is not installed or not in PATH")
    print("\n📥 Installation Instructions:")
    print("1. Download PostgreSQL for Windows:")
    print("   https://www.postgresql.org/download/windows/")
    print("\n2. Run the EnterpriseDB installer")
    print("\n3. During installation:")
    print("   - Choose default port: 5432")
    print("   - Remember the 'postgres' user password")
    print("   - Install pgAdmin (optional, helpful for GUI access)")
    print("\n4. After installation, add PostgreSQL to PATH:")
    print("   - C:\\Program Files\\PostgreSQL\\15\\bin (or your version)")
    print("\n5. Restart VS Code/PowerShell")
    print("\n6. Then run this script again")
    sys.exit(1)

def get_postgres_password():
    """Get postgres password from user"""
    print("\n🔐 PostgreSQL Connection Setup")
    print("=" * 50)
    password = input("Enter postgres user password (default is usually 'postgres'): ")
    if not password:
        password = "postgres"
    return password

def test_connection(password, port=5432):
    """Test PostgreSQL connection"""
    try:
        import psycopg2
        conn = psycopg2.connect(
            host="localhost",
            port=port,
            database="postgres",
            user="postgres",
            password=password
        )
        conn.close()
        return True
    except Exception as e:
        print(f"\n❌ Connection failed on port {port}: {e}")
        return False

def create_database(password, port=5432):
    """Create the database"""
    try:
        import psycopg2
        from psycopg2 import sql
        
        conn = psycopg2.connect(
            host="localhost",
            port=port,
            database="postgres",
            user="postgres",
            password=password
        )
        conn.autocommit = True
        
        with conn.cursor() as cur:
            # Drop if exists (for clean setup)
            cur.execute("DROP DATABASE IF EXISTS al_asly_middleware")
            # Create new database
            cur.execute("CREATE DATABASE al_asly_middleware")
            print("✅ Database 'al_asly_middleware' created successfully")
        
        conn.close()
        return True
    except Exception as e:
        print(f"❌ Failed to create database: {e}")
        return False

def run_setup_script():
    """Run the setup.py script"""
    try:
        print("\n📊 Running database initialization...")
        result = subprocess.run(
            [sys.executable, 'setup.py'],
            cwd=os.path.dirname(os.path.abspath(__file__)),
            capture_output=True,
            text=True,
            timeout=60
        )
        
        print(result.stdout)
        if result.stderr:
            print("⚠️  ", result.stderr)
        
        if result.returncode == 0:
            print("\n✅ Database setup complete!")
            return True
        else:
            print(f"\n❌ Setup script failed with exit code {result.returncode}")
            return False
    except subprocess.TimeoutExpired:
        print("❌ Setup script timed out")
        return False
    except Exception as e:
        print(f"❌ Error running setup script: {e}")
        return False

def main():
    print("\n" + "=" * 60)
    print("🗄️  AL ASLY LOCAL DATABASE SETUP")
    print("=" * 60)
    
    # Check if psycopg2 is installed
    try:
        import psycopg2
    except ImportError:
        print("\n⚠️  Installing psycopg2...")
        subprocess.run([sys.executable, '-m', 'pip', 'install', 'psycopg2-binary'], check=True)
        import psycopg2
    
    # Get password
    password = get_postgres_password()
    
    # Try both default port and port 3000
    print("\n🔗 Testing PostgreSQL connection...")
    port = 5432
    if not test_connection(password, port):
        print("\n⏳ Port 5432 failed, trying port 3000...")
        port = 3000
        if not test_connection(password, port):
            print("\n❌ Could not connect to PostgreSQL on any port")
            print("\nTroubleshooting:")
            print("1. Make sure PostgreSQL service is running (Services → postgresql-x64-17)")
            print("2. Check your username and password")
            print("3. Note the port PostgreSQL is running on")
            sys.exit(1)
    
    print(f"✅ Connected to PostgreSQL on port {port}!")
    
    # Create database
    print("\n📝 Creating database...")
    if not create_database(password, port):
        sys.exit(1)
    
    # Update .env.local
    print("\n⚙️  Updating .env.local...")
    env_content = f"""# Database Configuration
DATABASE_URL=postgresql://postgres:{password}@localhost:{port}/al_asly_middleware

# Click ERP Database (for sync)
CLICK_DB_HOST=localhost
CLICK_DB_PORT={port}
CLICK_DB_NAME=click_erp
CLICK_DB_USER=postgres
CLICK_DB_PASSWORD={password}

# Sync interval in hours
SYNC_INTERVAL_HOURS=6

# Cloudinary Configuration (for image uploads)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# JWT Configuration
JWT_SECRET=your_secret_key_here

# Node environment
NODE_ENV=development
"""
    
    env_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env.local')
    with open(env_path, 'w') as f:
        f.write(env_content)
    print(f"✅ Updated {env_path}")
    
    # Run setup script
    if not run_setup_script():
        sys.exit(1)
    
    print("\n" + "=" * 60)
    print("✅ ALL DONE!")
    print("=" * 60)
    print("\n📌 Next steps:")
    print("1. Restart your app (stop 'npm run dev' and start again)")
    print("2. Go to http://localhost:3000/add-product")
    print("3. Search for a product and submit the form")
    print("4. Data will now be saved to your local PostgreSQL database!")
    print("\n💡 Access the database with DBeaver:")
    print("   - Host: localhost")
    print("   - Port: 5432")
    print("   - Database: al_asly_middleware")
    print("   - User: postgres")
    print(f"   - Password: {password}")

if __name__ == "__main__":
    main()
