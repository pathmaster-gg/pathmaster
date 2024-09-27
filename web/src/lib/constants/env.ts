export const SERVER_URL: string =
  process.env.NEXT_PUBLIC_SERVER_URL ?? "http://localhost:8787";

export const OAUTH_GOOGLE_CLIENT_ID: string =
  process.env.NEXT_PUBLIC_OAUTH_GOOGLE_CLIENT_ID ??
  "456115587652-9o20ppfdr2fs6bgtcrg3d5g50j6o653c.apps.googleusercontent.com";

export const OAUTH_GOOGLE_CALLBACK: string =
  process.env.NEXT_PUBLIC_OAUTH_GOOGLE_CALLBACK ??
  "http://localhost:3000/login/google";

export function getServerUrl(path: string): string {
  return `${SERVER_URL}${path}`;
}
