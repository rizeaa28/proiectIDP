DROP TABLE IF EXISTS banking_account;
DROP TABLE IF EXISTS bank_transaction;

CREATE TABLE banking_account (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  account_name TEXT NOT NULL,
  user_id INTEGER NOT NULL,  -- schimbat de la username
  balance INTEGER DEFAULT 0,
  is_frozen INTEGER DEFAULT 0,
  is_closed INTEGER DEFAULT 0,
  iban TEXT UNIQUE NOT NULL
);

CREATE TABLE bank_transaction (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  from_banking_account_id INTEGER NOT NULL,
  to_banking_account_id INTEGER NOT NULL,
  external_to_iban TEXT,
  amount INTEGER NOT NULL,
  reason TEXT,
  transaction_time TEXT DEFAULT CURRENT_TIMESTAMP
);

