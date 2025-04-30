-- Initialize the database.
-- Drop any existing data and create empty tables.

DROP TABLE IF EXISTS user;
DROP TABLE IF EXISTS token;
DROP TABLE IF EXISTS banking_account;
DROP TABLE IF EXISTS bank_transaction;

CREATE TABLE user (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  real_name TEXT NOT NULL,
  password TEXT NOT NULL,
  address TEXT DEFAULT NULL,
  city TEXT DEFAULT NULL,
  country TEXT DEFAULT NULL,
  is_admin INTEGER DEFAULT 0
);

CREATE TABLE token (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  jti TEXT UNIQUE NOT NULL,
  expired INTEGER DEFAULT 0,
  created_at TEXT DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE banking_account (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_name TEXT NOT NULL,
  user_id INTEGER NOT NULL,
  balance INTEGER DEFAULT 0,
  is_frozen INTEGER DEFAULT 0,
  is_closed INTEGER DEFAULT 0,
  iban TEXT UNIQUE NOT NULL,
  FOREIGN KEY(user_id) REFERENCES user(id)
);

CREATE TABLE bank_transaction (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_banking_account_id INTEGER NOT NULL,
  to_banking_account_id INTEGER NOT NULL,
  external_to_iban TEXT,
  amount INTEGER NOT NULL,
  reason TEXT,
  transaction_time TEXT DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(from_banking_account_id) REFERENCES banking_account(id),
  FOREIGN KEY(to_banking_account_id) REFERENCES banking_account(id)
);