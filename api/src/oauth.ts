import { IRequest } from "itty-router";

interface GoogleOAuthTokenResponse {
  access_token: string;
}

interface GoogleUserInfo {
  email: string;
  email_verified: boolean;
}

export async function handleGoogle(
  request: IRequest,
  env: Env,
): Promise<Response> {
  const code = request.query.code! as string;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `code=${code}&client_id=${env.OAUTH_GOOGLE_CLIENT_ID}&client_secret=${env.OAUTH_GOOGLE_CLIENT_SECRET}&redirect_uri=${encodeURIComponent(env.OAUTH_GOOGLE_REDIRECT_URL)}&grant_type=authorization_code`,
  });
  const tokenBody = (await tokenResponse.json()) as GoogleOAuthTokenResponse;

  const userInfoResponse = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenBody.access_token}`,
      },
    },
  );
  const userInfoBody = (await userInfoResponse.json()) as GoogleUserInfo;

  // Show Google user email for testing.
  return new Response(userInfoBody.email);
}
