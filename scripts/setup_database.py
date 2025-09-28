#!/usr/bin/env python3
"""
Database setup script for Retailer Recommendation System
"""

import os
import sys
import psycopg2
from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
import argparse
from pathlib import Path

def create_database(host, port, user, password, db_name):
    """Create the database if it doesn't exist"""
    try:
        # Connect to PostgreSQL server
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database='postgres'
        )
        conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
        cursor = conn.cursor()
        
        # Check if database exists
        cursor.execute(f"SELECT 1 FROM pg_database WHERE datname = '{db_name}'")
        exists = cursor.fetchone()
        
        if not exists:
            cursor.execute(f'CREATE DATABASE "{db_name}"')
            print(f"Database '{db_name}' created successfully")
        else:
            print(f"Database '{db_name}' already exists")
        
        cursor.close()
        conn.close()
        return True
        
    except Exception as e:
        print(f"Error creating database: {e}")
        return False

def run_sql_file(host, port, user, password, db_name, sql_file):
    """Execute SQL file"""
    try:
        conn = psycopg2.connect(
            host=host,
            port=port,
            user=user,
            password=password,
            database=db_name
        )
        cursor = conn.cursor()
        
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        cursor.execute(sql_content)
        conn.commit()
        
        cursor.close()
        conn.close()
        
        print(f"Successfully executed {sql_file}")
        return True
        
    except Exception as e:
        print(f"Error executing {sql_file}: {e}")
        return False

def main():
    parser = argparse.ArgumentParser(description='Setup database for Retailer Recommendation System')
    parser.add_argument('--host', default='localhost', help='Database host')
    parser.add_argument('--port', default='5432', help='Database port')
    parser.add_argument('--user', default='postgres', help='Database user')
    parser.add_argument('--password', required=True, help='Database password')
    parser.add_argument('--database', default='retailer_recommendations', help='Database name')
    parser.add_argument('--skip-sample-data', action='store_true', help='Skip loading sample data')
    
    args = parser.parse_args()
    
    # Get project root directory
    project_root = Path(__file__).parent.parent
    schema_file = project_root / 'database' / 'schema.sql'
    sample_data_file = project_root / 'database' / 'sample_data.sql'
    
    print("Setting up Retailer Recommendation System database...")
    print(f"Host: {args.host}")
    print(f"Port: {args.port}")
    print(f"Database: {args.database}")
    print("-" * 50)
    
    # Create database
    if not create_database(args.host, args.port, args.user, args.password, args.database):
        sys.exit(1)
    
    # Run schema
    if not schema_file.exists():
        print(f"Schema file not found: {schema_file}")
        sys.exit(1)
    
    if not run_sql_file(args.host, args.port, args.user, args.password, args.database, schema_file):
        sys.exit(1)
    
    # Load sample data (optional)
    if not args.skip_sample_data:
        if sample_data_file.exists():
            if run_sql_file(args.host, args.port, args.user, args.password, args.database, sample_data_file):
                print("Sample data loaded successfully")
            else:
                print("Warning: Failed to load sample data")
        else:
            print(f"Sample data file not found: {sample_data_file}")
    
    print("-" * 50)
    print("Database setup completed successfully!")
    print(f"You can now connect to the database using:")
    print(f"postgresql://{args.user}:****@{args.host}:{args.port}/{args.database}")

if __name__ == '__main__':
    main()
