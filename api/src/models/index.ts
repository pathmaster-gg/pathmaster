export enum SessionType {
  Onboarding = "onboarding",
  Normal = "normal",
}

export enum ImageType {
  AdventureCover = "adventure_cover",
}

export interface Session {
  type: SessionType;
  token: string;
}

export interface AccountInfo {
  username: string;
}

export interface AdventureMetadata {
  id: number;
  name: string;
  description: string | null;
  cover_image: number;
}

export interface Adventure extends AdventureMetadata {
  is_owner: boolean;
  background: string | null;
  quests: AdventureQuest[];
  npcs: AdventureNpc[];
  creatures: AdventureCreature[];
  items: AdventureItem[];
}

export interface GameSessionMetadata {
  id: number;
  name: string;
  adventure: AdventureMetadata;
}

export interface GameSession extends GameSessionMetadata {
  players: GameSessionPlayer[];
  notes: string | null;
  events: GameSessionEvent[];
  finished_quests: number[];
  npc_notes: GameSessionNpcNote[];
}

export interface NewImage {
  id: number;
}

export interface AdventureQuest {
  id: number;
  title: string;
  description: string;
}

export interface AdventureNpc {
  id: number;
  name: string;
}

export interface AdventureCreature {
  id: number;
  name: string;
}

export interface AdventureItem {
  id: number;
  name: string;
}

export interface AdventureHub {
  featured: AdventureMetadata[];
  popular: AdventureMetadata[];
  latest: AdventureMetadata[];
}

export interface GameSessionPlayer {
  id: number;
  name: string;
  ancestry: string;
  level: number;
  hp: number;
  hp_max: number;
}

export interface GameSessionEvent {
  id: number;
  name: string;
  timestamp: number;
}

export interface GameSessionNpcNote {
  npc_id: number;
  note: string;
}
