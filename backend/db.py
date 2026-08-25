import sqlite3
from datetime import datetime
import os

DB_PATH = os.path.join(os.path.dirname(__file__), "contractsense.db")

def get_db():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def init_db():
    conn = get_db()
    c = conn.cursor()
    # Create users table
    c.execute('''
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    ''')
    # Create otps table
    c.execute('''
        CREATE TABLE IF NOT EXISTS otps (
            email TEXT NOT NULL,
            otp TEXT NOT NULL,
            expires_at TIMESTAMP NOT NULL
        )
    ''')
    conn.commit()
    conn.close()
