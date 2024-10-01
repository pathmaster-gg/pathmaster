import { IRequest } from "itty-router";

import { ONBOARDING_SESSION_DURATION } from "./constants";
import { SessionType as DbSessionType } from "./entities";
import { SessionType } from "./models";

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

  const account = await env.DB.prepare(
    "SELECT account_id FROM account WHERE email = ?",
  )
    .bind(userInfoBody.email.toLowerCase())
    .first();

  if (account) {
    // An account with this email already exists
    throw new Error("not yet implemented");
  } else {
    // This account is not seen before. Instruct the client to start the onboarding process.

    // Generate an onboarding session.
    const session = {
      type: SessionType.Onboarding,
      token: crypto.randomUUID(),
    };

    const currentTime = Math.floor(new Date().getTime() / 1000);

    await env.DB.prepare(
      "INSERT INTO session (type, token, create_time, expiration, email) VALUES (?, ?, ?, ?, ?)",
    )
      .bind(
        DbSessionType.Onboarding,
        session.token,
        currentTime,
        currentTime + ONBOARDING_SESSION_DURATION,
        userInfoBody.email.toLowerCase(),
      )
      .run();

    return new Response(JSON.stringify(session), {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    });
  }
}
