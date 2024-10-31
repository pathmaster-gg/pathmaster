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

interface UpdatePlayerRequest {
  name: string | null;
  ancestry: string | null;
  level: number | null;
  hp: number | null;
  hp_max: number | null;
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

export async function handleUpdatePlayer(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {
    return (ex as AuthError).response;
  }

  if (!request.params.id || !parseInt(request.params.id)) {
    return new Response("missing `id`", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const body = (await request.json()) as UpdatePlayerRequest;

  const updatingName = body.name !== undefined && body.name !== null;
  const updatingAncestry =
    body.ancestry !== undefined && body.ancestry !== null;
  const updatingLevel = body.level !== undefined && body.level !== null;
  const updatingHp = body.hp !== undefined && body.hp !== null;
  const updatingHpMax = body.hp_max !== undefined && body.hp_max !== null;

  if (
    !updatingName &&
    !updatingAncestry &&
    !updatingLevel &&
    !updatingHp &&
    !updatingHpMax
  ) {
    return new Response("invalid request", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const sessionOwner = await env.DB.prepare(
    "SELECT creator FROM player JOIN game_session ON (player.session_id=game_session.session_id) WHERE player_id = ?",
  )
    .bind(parseInt(request.params.id))
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

  const setters = [];
  const params = [];

  if (updatingName) {
    setters.push("name=?");
    params.push(body.name);
  }
  if (updatingAncestry) {
    setters.push("ancestry=?");
    params.push(body.ancestry);
  }
  if (updatingLevel) {
    setters.push("level=?");
    params.push(body.level);
  }
  if (updatingHp) {
    setters.push("hp=?");
    params.push(body.hp);
  }
  if (updatingHpMax) {
    setters.push("hp_max=?");
    params.push(body.hp_max);
  }

  const result = await env.DB.prepare(
    `UPDATE player SET ${setters.join(",")} WHERE player_id=?`,
  )
    .bind(...params, parseInt(request.params.id))
    .run();
  if (!result.meta.rows_written) {
    throw new Error("failed to update player");
  }

  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
