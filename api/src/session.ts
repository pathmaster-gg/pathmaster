import { IRequest } from "itty-router";

import { AuthError, assertNormal } from "./utils/auth";

interface CreateGameSessionRequest {
  name: string;
  adventure_id: number;
}

interface UpdateGameSessionRequest {
  notes: string | null;
}

interface SetNpcNoteRequest {
  note: string;
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

export async function handleGetGameSession(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number | undefined;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {}

  if (!request.params.id || !parseInt(request.params.id)) {
    return new Response("missing `id`", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const sessionId = parseInt(request.params.id);

  const session = await env.DB.prepare(
    `SELECT game_session.name, game_session.creator, adventure, notes, adventure.name AS adventure_name, description, cover FROM game_session JOIN adventure ON (adventure=adventure_id) WHERE session_id = ?`,
  )
    .bind(sessionId)
    .first();
  if (!session) {
    return new Response("adventure not found", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 404,
    });
  }
  if (session["creator"] !== accountId) {
    return new Response("not session owner", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 403,
    });
  }

  const players = await env.DB.prepare(
    `SELECT player_id, name, ancestry, level, hp, hp_max FROM player WHERE session_id = ?`,
  )
    .bind(sessionId)
    .all();

  const events = await env.DB.prepare(
    `SELECT event_id, name, create_time FROM game_session_event WHERE session_id = ?`,
  )
    .bind(sessionId)
    .all();

  const finishedQuests = await env.DB.prepare(
    `SELECT quest_id FROM game_session_finished_quest WHERE session_id = ?`,
  )
    .bind(sessionId)
    .all();

  const npcNotes = await env.DB.prepare(
    `SELECT npc_id, note FROM game_session_npc_note WHERE session_id = ?`,
  )
    .bind(sessionId)
    .all();

  return new Response(
    JSON.stringify({
      id: sessionId,
      name: session["name"],
      adventure: {
        id: session["adventure"],
        name: session["adventure_name"],
        description: session["description"],
        cover_image: session["cover"],
      },
      players: players.results.map((item) => {
        return {
          id: item["player_id"],
          name: item["name"],
          ancestry: item["ancestry"],
          level: item["level"],
          hp: item["hp"],
          hp_max: item["hp_max"],
        };
      }),
      notes: session["notes"],
      events: events.results.map((item) => {
        return {
          id: item["event_id"],
          name: item["name"],
          timestamp: item["create_time"],
        };
      }),
      finished_quests: finishedQuests.results.map((item) => {
        return item["quest_id"];
      }),
      npc_notes: npcNotes.results.map((item) => {
        return {
          npc_id: item["npc_id"],
          note: item["note"],
        };
      }),
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}

export async function handleUpdateGameSession(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number | undefined;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {}

  if (!request.params.id || !parseInt(request.params.id)) {
    return new Response("missing `id`", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const sessionId = parseInt(request.params.id);

  const body = (await request.json()) as UpdateGameSessionRequest;

  const updatingNotes = body.notes !== undefined && body.notes !== null;

  if (!updatingNotes) {
    return new Response("invalid request", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const setters = [];
  const params = [];

  if (updatingNotes) {
    setters.push("notes=?");
    params.push(body.notes);
  }

  const result = await env.DB.prepare(
    `UPDATE game_session SET ${setters.join(",")} WHERE session_id=? AND creator=?`,
  )
    .bind(...params, sessionId, accountId)
    .run();
  if (!result.meta.rows_written) {
    throw new Error("failed to update session");
  }

  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function handleFinishQuest(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number | undefined;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {}

  if (
    !request.params.id ||
    !parseInt(request.params.id) ||
    !request.params.quest_id ||
    !parseInt(request.params.quest_id)
  ) {
    return new Response("missing `id` or `quest_id`", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const sessionId = parseInt(request.params.id);
  const questId = parseInt(request.params.quest_id);

  const sessionInfo = await env.DB.prepare(
    "SELECT creator, adventure FROM game_session WHERE session_id = ?",
  )
    .bind(sessionId)
    .first();
  if (!sessionInfo) {
    return new Response("session not found", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 404,
    });
  }
  if (accountId !== sessionInfo["creator"]) {
    return new Response("not session owner", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 403,
    });
  }

  const questInfo = await env.DB.prepare(
    "SELECT adventure_id FROM quest WHERE quest_id = ?",
  )
    .bind(questId)
    .first();
  if (!questInfo) {
    return new Response("quest not found", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 404,
    });
  }
  if (questInfo["adventure_id"] !== sessionInfo["adventure"]) {
    return new Response("quest not from adventure", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const insert = await env.DB.prepare(
    "INSERT INTO game_session_finished_quest (session_id, quest_id) VALUES (?, ?)",
  )
    .bind(sessionId, questId)
    .run();
  if (!insert.meta.rows_written) {
    throw new Error("failed to insert finished quest");
  }

  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function handleUnfinishQuest(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number | undefined;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {}

  if (
    !request.params.id ||
    !parseInt(request.params.id) ||
    !request.params.quest_id ||
    !parseInt(request.params.quest_id)
  ) {
    return new Response("missing `id` or `quest_id`", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const sessionId = parseInt(request.params.id);
  const questId = parseInt(request.params.quest_id);

  const sessionInfo = await env.DB.prepare(
    "SELECT creator, adventure FROM game_session WHERE session_id = ?",
  )
    .bind(sessionId)
    .first();
  if (!sessionInfo) {
    return new Response("session not found", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 404,
    });
  }
  if (accountId !== sessionInfo["creator"]) {
    return new Response("not session owner", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 403,
    });
  }

  const deleted = await env.DB.prepare(
    "DELETE FROM game_session_finished_quest WHERE session_id = ? AND quest_id = ?",
  )
    .bind(sessionId, questId)
    .run();
  if (!deleted.meta.rows_written) {
    throw new Error("failed to delete finished quest");
  }

  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function handleSetNpcNote(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number | undefined;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {}

  const body = (await request.json()) as SetNpcNoteRequest;

  if (
    !request.params.id ||
    !parseInt(request.params.id) ||
    !request.params.npc_id ||
    !parseInt(request.params.npc_id) ||
    body.note === undefined ||
    body.note === null
  ) {
    return new Response("invalid request", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const sessionId = parseInt(request.params.id);
  const npcId = parseInt(request.params.npc_id);

  const sessionInfo = await env.DB.prepare(
    "SELECT creator, adventure FROM game_session WHERE session_id = ?",
  )
    .bind(sessionId)
    .first();
  if (!sessionInfo) {
    return new Response("session not found", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 404,
    });
  }
  if (accountId !== sessionInfo["creator"]) {
    return new Response("not session owner", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 403,
    });
  }

  const npcInfo = await env.DB.prepare(
    "SELECT adventure_id FROM npc WHERE npc_id = ?",
  )
    .bind(npcId)
    .first();
  if (!npcInfo) {
    return new Response("npc not found", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 404,
    });
  }
  if (npcInfo["adventure_id"] !== sessionInfo["adventure"]) {
    return new Response("npc not from adventure", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const command = await (
    body.note
      ? env.DB.prepare(
          "INSERT OR REPLACE INTO game_session_npc_note (session_id, npc_id, note) VALUES (?, ?, ?)",
        ).bind(sessionId, npcId, body.note)
      : env.DB.prepare(
          "DELETE FROM game_session_npc_note WHERE session_id = ? AND npc_id = ?",
        ).bind(sessionId, npcId)
  ).run();
  if (!command.success) {
    throw new Error("failed to set npc note");
  }

  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
