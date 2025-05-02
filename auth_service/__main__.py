import os
import sqlite3
from __init__ import create_app

DB_PATH = "instance/armma.sqlite"
SCHEMA_PATH = "db/schema.sql"  # FIX: cale relativă corectă

if not os.path.exists(DB_PATH):
    print("Initializing auth_service DB...")
    os.makedirs("instance", exist_ok=True)
    with open(SCHEMA_PATH, "r") as f:
        schema = f.read()
    conn = sqlite3.connect(DB_PATH)
    conn.executescript(schema)
    conn.close()
    print("auth_service DB initialized.")

app = create_app()

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
