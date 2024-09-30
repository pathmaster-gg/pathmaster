-- Prunes everything on each run for development purposes only.
-- Switch to the migration model before production deployment:
-- https://developers.cloudflare.com/d1/reference/migrations/

DROP TABLE IF EXISTS account;

CREATE TABLE account (
  account_id SERIAL PRIMARY KEY
);
