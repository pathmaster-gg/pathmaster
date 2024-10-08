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
