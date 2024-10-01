export enum SessionType {
  Onboarding = "onboarding",
}

export interface Session {
  type: SessionType;
  token: string;
}
