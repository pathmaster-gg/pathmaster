-- Prunes everything on each run for development purposes only.
-- Switch to the migration model before production deployment:
-- https://developers.cloudflare.com/d1/reference/migrations/

DROP TABLE IF EXISTS session;
DROP TABLE IF EXISTS chat_prompt;
DROP TABLE IF EXISTS game_session_finished_quest;
DROP TABLE IF EXISTS game_session_npc_note;
DROP TABLE IF EXISTS game_session_event;
DROP TABLE IF EXISTS game_session_used_npc;
DROP TABLE IF EXISTS player;
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
  avatar INTEGER,
  deleted INTEGER NOT NULL,
  FOREIGN KEY(adventure_id) REFERENCES adventure(adventure_id),
  FOREIGN KEY(avatar) REFERENCES image(image_id)
);

CREATE TABLE item (
  item_id INTEGER PRIMARY KEY,
  adventure_id INTEGER NOT NULL,
  name TEXT NOT NULL,
  create_time INTEGER NOT NULL,
  image INTEGER,
  deleted INTEGER NOT NULL,
  FOREIGN KEY(adventure_id) REFERENCES adventure(adventure_id),
  FOREIGN KEY(image) REFERENCES image(image_id)
);

CREATE TABLE game_session (
  session_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  create_time INTEGER NOT NULL,
  creator INTEGER NOT NULL,
  adventure INTEGER NOT NULL,
  notes TEXT,
  FOREIGN KEY(creator) REFERENCES account(account_id),
  FOREIGN KEY(adventure) REFERENCES adventure(adventure_id)
);

CREATE TABLE player (
  player_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  ancestry TEXT NOT NULL,
  level INTEGER NOT NULL,
  hp INTEGER NOT NULL,
  hp_max INTEGER NOT NULL,
  create_time INTEGER NOT NULL,
  session_id INTEGER NOT NULL,
  FOREIGN KEY(session_id) REFERENCES game_session(session_id)
);

CREATE TABLE game_session_event (
  event_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  create_time INTEGER NOT NULL,
  session_id INTEGER NOT NULL,
  FOREIGN KEY(session_id) REFERENCES game_session(session_id)
);

CREATE TABLE game_session_npc_note (
  session_id INTEGER NOT NULL,
  npc_id INTEGER NOT NULL,
  note TEXT NOT NULL,
  PRIMARY KEY (session_id, npc_id),
  FOREIGN KEY(session_id) REFERENCES game_session(session_id),
  FOREIGN KEY(npc_id) REFERENCES npc(npc_id)
);

CREATE TABLE game_session_finished_quest (
  session_id INTEGER NOT NULL,
  quest_id INTEGER NOT NULL,
  PRIMARY KEY (session_id, quest_id),
  FOREIGN KEY(session_id) REFERENCES game_session(session_id),
  FOREIGN KEY(quest_id) REFERENCES quest(quest_id)
);

CREATE TABLE chat_prompt (
  prompt_id INTEGER PRIMARY KEY,
  content TEXT NOT NULL
);
