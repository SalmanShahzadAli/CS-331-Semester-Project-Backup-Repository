"""Database initialization script."""

import psycopg2
from psycopg2 import sql
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import os
import sys

# Add parent directory to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from config.database_config import DatabaseConfig


def create_database():
    """Create the database if it doesn't exist."""
    try:
        # Connect to PostgreSQL server (default database)
        conn = psycopg2.connect(
            dbname='postgres',
            user=DatabaseConfig.DB_USER,
            password=DatabaseConfig.DB_PASSWORD,
            host=DatabaseConfig.DB_HOST,
            port=DatabaseConfig.DB_PORT
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(
            "SELECT 1 FROM pg_database WHERE datname = %s",
            (DatabaseConfig.DB_NAME,)
        )
        exists = cursor.fetchone()
        
        if not exists:
            cursor.execute(
                sql.SQL("CREATE DATABASE {}").format(
                    sql.Identifier(DatabaseConfig.DB_NAME)
                )
            )
            print(f"✅ Database '{DatabaseConfig.DB_NAME}' created successfully!")
        else:
            print(f"ℹ️  Database '{DatabaseConfig.DB_NAME}' already exists.")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating database: {e}")
        return False


def create_tables():
    """Create all tables using schema.sql file."""
    try:
        conn = psycopg2.connect(**DatabaseConfig.get_config_dict())
        cursor = conn.cursor()
        
        # Read SQL schema file
        schema_path = os.path.join(
            os.path.dirname(__file__),
            'schema.sql'
        )
        
        with open(schema_path, 'r') as f:
            schema_sql = f.read()
        
        # Execute schema
        cursor.execute(schema_sql)
        conn.commit()
        
        print("✅ All tables created successfully!")
        print("   - patients")
        print("   - appointments")
        print("   - chat_history")
        print("   - medical_conditions")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"❌ Error creating tables: {e}")
        return False


def initialize_database():
    """Main initialization function."""
    print("="*60)
    print("DATABASE INITIALIZATION")
    print("="*60)
    
    print("\nStep 1: Creating database...")
    if not create_database():
        return False
    
    print("\nStep 2: Creating tables...")
    if not create_tables():
        return False
    
    print("\n" + "="*60)
    print("✅ DATABASE INITIALIZED SUCCESSFULLY!")
    print("="*60)
    return True


if __name__ == '__main__':
    initialize_database()