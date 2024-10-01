import { IRequest } from "itty-router";

import { SessionType as DbSessionType } from "../entities";

export class AuthError {
  response: Response;

  constructor(response: Response) {
    this.response = response;
  }
}

// Validates that the request has a valid onboarding session. Returns the associated email address
// if successful.
export async function assertOnboarding(
  request: IRequest,
  env: Env,
): Promise<string> {
  const session = await validateSession(
    request,
    env,
    "email",
    DbSessionType.Onboarding,
  );
  return session["email"] as string;
}

// Validates that the request has a valid normal session. Returns the associated account ID if
// successful.
export async function assertNormal(
  request: IRequest,
  env: Env,
): Promise<number> {
  const session = await validateSession(
    request,
    env,
    "account_id",
    DbSessionType.Normal,
  );
  return session["account_id"] as number;
}

async function validateSession(
  request: IRequest,
  env: Env,
  extraField: string,
  type: DbSessionType,
): Promise<Record<string, unknown>> {
  const authHeader = request.headers.get("Authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new AuthError(
      new Response("missing/invalid auth header", {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        status: 401,
      }),
    );
  }

  const token = authHeader.substring("Bearer ".length);
  const session = await env.DB.prepare(
    `SELECT type, expiration, ${extraField} FROM session WHERE token = ?`,
  )
    .bind(token)
    .first();
  if (!session) {
    throw new AuthError(
      new Response("session expired", {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        status: 401,
      }),
    );
  }

  const expiration = session["expiration"] as number;
  const currentTime = Math.floor(new Date().getTime() / 1000);

  if (currentTime > expiration) {
    throw new AuthError(
      new Response("session expired", {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        status: 401,
      }),
    );
  }

  const sessionType = session["type"] as number;
  if (sessionType !== type) {
    throw new AuthError(
      new Response("unexpected session type", {
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        status: 403,
      }),
    );
  }

  return session;
}
