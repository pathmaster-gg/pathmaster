import { IRequest } from "itty-router";

import { AuthError, assertNormal } from "./utils/auth";

interface CreateGameSessionEventRequest {
  name: string;
  session_id: number;
}

interface UpdateGameSessionEventRequest {
  name: string | null;
}

export async function handleCreateGameSessionEvent(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {
    return (ex as AuthError).response;
  }

  const body = (await request.json()) as CreateGameSessionEventRequest;

  if (!body.name || !body.session_id) {
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

  const newSessionEvent = await env.DB.prepare(
    "INSERT INTO game_session_event (name, create_time, session_id) VALUES (?, ?, ?) RETURNING event_id",
  )
    .bind(body.name, currentTime, body.session_id)
    .first();
  if (!newSessionEvent) {
    throw new Error("failed to insert game session event");
  }

  return new Response(
    JSON.stringify({
      id: newSessionEvent["event_id"],
      name: body.name,
      timestamp: currentTime,
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}

export async function handleUpdateGameSessionEvent(
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

  const body = (await request.json()) as UpdateGameSessionEventRequest;

  const updatingName = body.name !== undefined && body.name !== null;

  if (!updatingName) {
    return new Response("invalid request", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const sessionOwner = await env.DB.prepare(
    "SELECT creator FROM game_session_event JOIN game_session ON (game_session_event.session_id=game_session.session_id) WHERE event_id = ?",
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

  const result = await env.DB.prepare(
    `UPDATE game_session_event SET ${setters.join(",")} WHERE event_id=?`,
  )
    .bind(...params, parseInt(request.params.id))
    .run();
  if (!result.meta.rows_written) {
    throw new Error("failed to update session event");
  }

  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
