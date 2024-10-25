export enum SessionType {
  Onboarding = "onboarding",
  Normal = "normal",
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
  cover_image: number;
}

export interface GameSessionMetadata {
  id: number;
  name: string;
  adventure: AdventureMetadata;
}

export interface NewImage {
  id: number;
}
