import { IRequest } from "itty-router";

import {
  NORMAL_SESSION_DURATION,
  ONBOARDING_SESSION_DURATION,
} from "./constants";
import { SessionType as DbSessionType } from "./entities";
import { Session, SessionType } from "./models";

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
  mocked: boolean,
): Promise<Response> {
  const code = request.query.code! as string;

  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `code=${code}&client_id=${env.OAUTH_GOOGLE_CLIENT_ID}&client_secret=${env.OAUTH_GOOGLE_CLIENT_SECRET}&redirect_uri=${encodeURIComponent(env.OAUTH_GOOGLE_REDIRECT_URL)}&grant_type=authorization_code`,
  });
  let tokenBody = (
    mocked
      ? {
          access_token: "mocked",
        }
      : await tokenResponse.json()
  ) as GoogleOAuthTokenResponse;

  const userInfoResponse = await fetch(
    "https://www.googleapis.com/oauth2/v3/userinfo",
    {
      headers: {
        Authorization: `Bearer ${tokenBody.access_token}`,
      },
    },
  );
  const userInfoBody = (
    mocked
      ? {
          email: "info@pathmaster.gg",
          email_verified: true,
        }
      : await userInfoResponse.json()
  ) as GoogleUserInfo;

  const account = await env.DB.prepare(
    "SELECT account_id FROM account WHERE email = ?",
  )
    .bind(userInfoBody.email.toLowerCase())
    .first();

  const currentTime = Math.floor(new Date().getTime() / 1000);

  let session: Session;

  if (account) {
    // An account with this email already exists

    // Generate a normal session.
    session = {
      type: SessionType.Normal,
      token: crypto.randomUUID(),
    };

    await env.DB.prepare(
      "INSERT INTO session (type, token, create_time, expiration, account_id) VALUES (?, ?, ?, ?, ?)",
    )
      .bind(
        DbSessionType.Normal,
        session.token,
        currentTime,
        currentTime + NORMAL_SESSION_DURATION,
        account["account_id"],
      )
      .run();
  } else {
    // This account is not seen before. Instruct the client to start the onboarding process.

    // Generate an onboarding session.
    session = {
      type: SessionType.Onboarding,
      token: crypto.randomUUID(),
    };

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
  }

  return new Response(JSON.stringify(session), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
}
