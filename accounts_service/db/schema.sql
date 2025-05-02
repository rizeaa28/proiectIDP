-- Drop any existing data and create empty tables.

DROP TABLE IF EXISTS banking_account;

CREATE TABLE banking_account (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_name TEXT NOT NULL,
  username TEXT NOT NULL,
  balance INTEGER DEFAULT 0,
  is_frozen INTEGER DEFAULT 0,
  is_closed INTEGER DEFAULT 0,
  iban TEXT UNIQUE NOT NULL
);

