import { IRequest } from "itty-router";

import {
  NORMAL_SESSION_DURATION,
  ONBOARDING_SESSION_DURATION,
} from "./constants";
import { SessionType as DbSessionType } from "./entities";
import { SessionType } from "./models";

interface OnboardReqeust {
  username: string;
}

export async function handleOnboard(
  request: IRequest,
  env: Env,
): Promise<Response> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return new Response("missing/invalid auth header", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 401,
    });
  }

  const token = authHeader.substring("Bearer ".length);
  const session = await env.DB.prepare(
    "SELECT type, expiration, email FROM session WHERE token = ?",
  )
    .bind(token)
    .first();
  if (!session) {
    return new Response("session expired", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 401,
    });
  }

  const expiration = session["expiration"] as number;
  const currentTime = Math.floor(new Date().getTime() / 1000);

  if (currentTime > expiration) {
    return new Response("session expired", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 401,
    });
  }

  const sessionType = session["type"] as number;
  if (sessionType !== DbSessionType.Onboarding) {
    return new Response("unexpected session type", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 403,
    });
  }

  const body = (await request.json()) as OnboardReqeust;

  const newAccount = await env.DB.prepare(
    "INSERT INTO account (username, email) VALUES (?, ?) RETURNING account_id",
  )
    .bind(body.username, session["email"])
    .first();
  if (!newAccount) {
    // TODO: add error handling here: this is likely caused by duplicate email/username.
    throw new Error("failed to insert account");
  }

  // Swap onboarding session to normal.
  const newSession = {
    type: SessionType.Normal,
    token: crypto.randomUUID(),
  };

  await env.DB.prepare(
    "INSERT INTO session (type, token, create_time, expiration, account_id) VALUES (?, ?, ?, ?, ?)",
  )
    .bind(
      DbSessionType.Onboarding,
      newSession.token,
      currentTime,
      currentTime + NORMAL_SESSION_DURATION,
      newAccount["account_id"],
    )
    .run();

  return new Response(JSON.stringify(newSession), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    },
  });
}
