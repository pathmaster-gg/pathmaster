-- Prunes everything on each run for development purposes only.
-- Switch to the migration model before production deployment:
-- https://developers.cloudflare.com/d1/reference/migrations/

DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS account;

CREATE TABLE account (
  account_id INTEGER PRIMARY KEY,
  username TEXT UNIQUE NOT NULL,
  email TEXT UNIQUE NOT NULL
);

CREATE TABLE session (
  session_id INTEGER PRIMARY KEY,
  type INTEGER NOT NULL,
  token TEXT UNIQUE NOT NULL,
  create_time INTEGER NOT NULL,
  expiration INTEGER NOT NULL,
  -- For onboarding sessions only
  email TEXT,
  -- For normal sessions only
  account_id INTEGER,
  FOREIGN KEY(account_id) REFERENCES account(account_id)
);
