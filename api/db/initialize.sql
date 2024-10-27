-- Prunes everything on each run for development purposes only.
-- Switch to the migration model before production deployment:
-- https://developers.cloudflare.com/d1/reference/migrations/

DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS game_session;
DROP TABLE IF EXISTS quest;
DROP TABLE IF EXISTS npc;
DROP TABLE IF EXISTS creature;
DROP TABLE IF EXISTS item;
DROP TABLE IF EXISTS adventure;
DROP TABLE IF EXISTS image;
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

CREATE TABLE image (
  image_id INTEGER PRIMARY KEY,
  owner INTEGER NOT NULL,
  type INTEGER NOT NULL,
  data BLOB NOT NULL,
  FOREIGN KEY(owner) REFERENCES account(account_id)
);

CREATE TABLE adventure (
  adventure_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  create_time INTEGER NOT NULL,
  creator INTEGER NOT NULL,
  cover INTEGER NOT NULL,
  description TEXT,
  background TEXT,
  FOREIGN KEY(creator) REFERENCES account(account_id),
  FOREIGN KEY(cover) REFERENCES image(image_id)
);

CREATE TABLE quest (
  quest_id INTEGER PRIMARY KEY,
  adventure_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  create_time INTEGER NOT NULL,
  description TEXT NOT NULL,
  deleted INTEGER NOT NULL,
  FOREIGN KEY(adventure_id) REFERENCES adventure(adventure_id)
);

CREATE TABLE npc (
  npc_id INTEGER PRIMARY KEY,
  adventure_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  create_time INTEGER NOT NULL,
  deleted INTEGER NOT NULL,
  FOREIGN KEY(adventure_id) REFERENCES adventure(adventure_id)
);

CREATE TABLE creature (
  creature_id INTEGER PRIMARY KEY,
  adventure_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  create_time INTEGER NOT NULL,
  deleted INTEGER NOT NULL,
  FOREIGN KEY(adventure_id) REFERENCES adventure(adventure_id)
);

CREATE TABLE item (
  item_id INTEGER PRIMARY KEY,
  adventure_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  create_time INTEGER NOT NULL,
  deleted INTEGER NOT NULL,
  FOREIGN KEY(adventure_id) REFERENCES adventure(adventure_id)
);

CREATE TABLE game_session (
  session_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  create_time INTEGER NOT NULL,
  creator INTEGER NOT NULL,
  adventure INTEGER NOT NULL,
  FOREIGN KEY(creator) REFERENCES account(account_id),
  FOREIGN KEY(adventure) REFERENCES adventure(adventure_id)
);
