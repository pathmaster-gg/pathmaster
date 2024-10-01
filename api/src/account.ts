import { IRequest } from "itty-router";

import { NORMAL_SESSION_DURATION } from "./constants";
import { SessionType as DbSessionType } from "./entities";
import { SessionType } from "./models";
import { AuthError, assertNormal, assertOnboarding } from "./utils/auth";

interface OnboardReqeust {
  username: string;
}

export async function handleOnboard(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let email: string;
  try {
    email = await assertOnboarding(request, env);
  } catch (ex) {
    return (ex as AuthError).response;
  }

  const body = (await request.json()) as OnboardReqeust;

  const newAccount = await env.DB.prepare(
    "INSERT INTO account (username, email) VALUES (?, ?) RETURNING account_id",
  )
    .bind(body.username, email)
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

  const currentTime = Math.floor(new Date().getTime() / 1000);

  await env.DB.prepare(
    "INSERT INTO session (type, token, create_time, expiration, account_id) VALUES (?, ?, ?, ?, ?)",
  )
    .bind(
      DbSessionType.Normal,
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

export async function handleGetInfo(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {
    return (ex as AuthError).response;
  }

  const account = await env.DB.prepare(
    "SELECT username FROM account WHERE account_id = ?",
  )
    .bind(accountId)
    .first();
  if (!account) {
    throw new Error("internal server error: account not found");
  }

  return new Response(
    JSON.stringify({
      username: account["username"],
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    },
  );
}
