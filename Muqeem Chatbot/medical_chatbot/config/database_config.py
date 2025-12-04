"""Database configuration management."""

import os
from dotenv import load_dotenv

load_dotenv()


class DatabaseConfig:
    """PostgreSQL database configuration."""
    
    DB_NAME = os.getenv('DB_NAME', 'medical_chatbot')
    DB_USER = os.getenv('DB_USER', 'postgres')
    DB_PASSWORD = os.getenv('DB_PASSWORD', 'postgres')
    DB_HOST = os.getenv('DB_HOST', 'localhost')
    DB_PORT = os.getenv('DB_PORT', '5432')
    
    @classmethod
    def get_connection_string(cls):
        """Get PostgreSQL connection string."""
        return f"postgresql://{cls.DB_USER}:{cls.DB_PASSWORD}@{cls.DB_HOST}:{cls.DB_PORT}/{cls.DB_NAME}"
    
    @classmethod
    def get_config_dict(cls):
        """Get configuration as dictionary."""
        return {
            'dbname': cls.DB_NAME,
            'user': cls.DB_USER,
            'password': cls.DB_PASSWORD,
            'host': cls.DB_HOST,
            'port': cls.DB_PORT
        }


if __name__ == '__main__':
    print("Database Configuration:")
    print(f"  Host: {DatabaseConfig.DB_HOST}")
    print(f"  Port: {DatabaseConfig.DB_PORT}")
    print(f"  Database: {DatabaseConfig.DB_NAME}")
    print(f"  User: {DatabaseConfig.DB_USER}")