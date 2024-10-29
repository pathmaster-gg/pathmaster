import { IRequest } from "itty-router";

import { AuthError, assertNormal } from "./utils/auth";

interface CreatePlayerRequest {
  name: string;
  ancestry: string;
  level: number;
  hp: number;
  hp_max: number;
  session_id: number;
}

export async function handleCreatePlayer(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {
    return (ex as AuthError).response;
  }

  const body = (await request.json()) as CreatePlayerRequest;

  if (
    !body.name ||
    !body.ancestry ||
    !body.level ||
    !body.hp ||
    !body.hp_max ||
    !body.session_id
  ) {
    return new Response("invalid request", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const sessionOwner = await env.DB.prepare(
    "SELECT creator FROM game_session WHERE session_id = ?",
  )
    .bind(body.session_id)
    .first();
  if (!sessionOwner) {
    return new Response("session not found", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 404,
    });
  }
  if (accountId !== sessionOwner["creator"]) {
    return new Response("not session owner", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 403,
    });
  }

  const currentTime = Math.floor(new Date().getTime() / 1000);

  const newPlayer = await env.DB.prepare(
    "INSERT INTO player (name, ancestry, level, hp, hp_max, create_time, session_id) VALUES (?, ?, ?, ?, ?, ?, ?) RETURNING player_id",
  )
    .bind(
      body.name,
      body.ancestry,
      body.level,
      body.hp,
      body.hp_max,
      currentTime,
      body.session_id,
    )
    .first();
  if (!newPlayer) {
    throw new Error("failed to insert player");
  }

  return new Response(
    JSON.stringify({
      id: newPlayer["player_id"],
      name: body.name,
      ancestry: body.ancestry,
      level: body.level,
      hp: body.hp,
      hp_max: body.hp_max,
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
