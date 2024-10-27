import { IRequest } from "itty-router";

import { AuthError, assertNormal } from "./utils/auth";

interface CreateGameSessionRequest {
  name: string;
  adventure_id: number;
}

export async function handleCreateGameSession(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {
    return (ex as AuthError).response;
  }

  const body = (await request.json()) as CreateGameSessionRequest;

  if (!body.name || !body.adventure_id) {
    return new Response("invalid request", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const currentTime = Math.floor(new Date().getTime() / 1000);

  const newGameSession = await env.DB.prepare(
    "INSERT INTO game_session (name, create_time, creator, adventure) VALUES (?, ?, ?, ?) RETURNING session_id",
  )
    .bind(body.name, currentTime, accountId, body.adventure_id)
    .first();
  if (!newGameSession) {
    throw new Error("failed to insert game session");
  }

  return new Response(
    JSON.stringify({
      id: newGameSession["session_id"],
      name: body.name,
      adventure_id: body.adventure_id,
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}

export async function handleGetMyGameSessions(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {
    return (ex as AuthError).response;
  }

  const session = await env.DB.prepare(
    `SELECT session_id, game_session.name AS session_name, adventure, adventure.name AS adventure_name, cover, description FROM game_session JOIN adventure ON (game_session.adventure = adventure.adventure_id) WHERE game_session.creator = ?`,
  )
    .bind(accountId)
    .all();

  return new Response(
    JSON.stringify(
      session.results.map((row) => {
        return {
          id: row["session_id"],
          name: row["session_name"],
          adventure: {
            id: row["adventure"],
            name: row["adventure_name"],
            description: row["description"],
            cover_image: row["cover"],
          },
        };
      }),
    ),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
