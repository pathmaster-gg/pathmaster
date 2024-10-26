import { IRequest } from "itty-router";

import { AuthError, assertNormal } from "./utils/auth";

interface CreateAdventureRequest {
  name: string;
  cover_image_id: number;
}

interface UpdateAdventureRequest {
  description: string | null;
  background: string | null;
}

export async function handleCreateAdventure(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {
    return (ex as AuthError).response;
  }

  const body = (await request.json()) as CreateAdventureRequest;

  if (!body.name || !body.cover_image_id) {
    return new Response("invalid request", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const currentTime = Math.floor(new Date().getTime() / 1000);

  const newAdventure = await env.DB.prepare(
    "INSERT INTO adventure (name, create_time, creator, cover) VALUES (?, ?, ?, ?) RETURNING adventure_id",
  )
    .bind(body.name, currentTime, accountId, body.cover_image_id)
    .first();
  if (!newAdventure) {
    throw new Error("failed to insert adventure");
  }

  return new Response(
    JSON.stringify({
      id: newAdventure["adventure_id"],
      name: body.name,
      description: null,
      cover_image: body.cover_image_id,
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}

export async function handleUpdateAdventure(
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

  const body = (await request.json()) as UpdateAdventureRequest;

  const updatingDescription =
    body.description !== undefined && body.description !== null;
  const updatingBackground =
    body.background !== undefined && body.background !== null;

  if (!updatingDescription && !updatingBackground) {
    return new Response("invalid request", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const setters = [];
  const params = [];

  if (updatingDescription) {
    setters.push("description=?");
    params.push(body.description);
  }
  if (updatingBackground) {
    setters.push("background=?");
    params.push(body.background);
  }

  const result = await env.DB.prepare(
    `UPDATE adventure SET ${setters.join(",")} WHERE adventure_id=? AND creator=?`,
  )
    .bind(...params, parseInt(request.params.id), accountId)
    .run();
  if (!result.meta.rows_written) {
    throw new Error("failed to update adventure");
  }

  return new Response(null, {
    status: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function handleGetMyAdventures(
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
    `SELECT adventure_id, name, cover, description FROM adventure WHERE creator = ?`,
  )
    .bind(accountId)
    .all();

  return new Response(
    JSON.stringify(
      session.results.map((row) => {
        return {
          id: row["adventure_id"],
          name: row["name"],
          description: row["description"],
          cover_image: row["cover"],
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

export async function handleGetAdventureHub(
  _: IRequest,
  env: Env,
): Promise<Response> {
  // Temporary hard-coded featured adventures
  // TODO: add admin API for setting featured adventures
  const featured = await env.DB.prepare(
    "SELECT adventure_id, name, cover, description FROM adventure LIMIT 4",
  ).all();

  // Ranked by game session count
  const popular = await env.DB.prepare(
    "SELECT id, name, cover, description FROM (SELECT adventure_id AS id FROM adventure JOIN game_session ON (adventure_id = adventure) GROUP BY adventure_id ORDER BY COUNT(*) DESC, adventure_id ASC LIMIT 4) JOIN adventure ON (id=adventure_id)",
  ).all();

  const latest = await env.DB.prepare(
    "SELECT adventure_id, name, cover, description FROM adventure ORDER BY create_time DESC, adventure_id DESC LIMIT 4",
  ).all();

  return new Response(
    JSON.stringify({
      featured: featured.results.map((row) => {
        return {
          id: row["adventure_id"],
          name: row["name"],
          description: row["description"],
          cover_image: row["cover"],
        };
      }),
      popular: popular.results.map((row) => {
        return {
          id: row["id"],
          name: row["name"],
          description: row["description"],
          cover_image: row["cover"],
        };
      }),
      latest: latest.results.map((row) => {
        return {
          id: row["adventure_id"],
          name: row["name"],
          description: row["description"],
          cover_image: row["cover"],
        };
      }),
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
      },
    },
  );
}

export async function handleGetAdventure(
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

  const adventureId = parseInt(request.params.id);

  const adventure = await env.DB.prepare(
    `SELECT name, creator, cover, description, background FROM adventure WHERE adventure_id = ?`,
  )
    .bind(adventureId)
    .first();
  if (!adventure) {
    return new Response("adventure not found", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 404,
    });
  }

  const quests = await env.DB.prepare(
    `SELECT quest_id, title, description FROM quest WHERE adventure_id = ?`,
  )
    .bind(adventureId)
    .all();

  const npcs = await env.DB.prepare(
    `SELECT npc_id, name FROM npc WHERE adventure_id = ?`,
  )
    .bind(adventureId)
    .all();

  const creatures = await env.DB.prepare(
    `SELECT creature_id, name FROM creature WHERE adventure_id = ?`,
  )
    .bind(adventureId)
    .all();

  const items = await env.DB.prepare(
    `SELECT item_id, name FROM item WHERE adventure_id = ?`,
  )
    .bind(adventureId)
    .all();

  return new Response(
    JSON.stringify({
      id: adventureId,
      name: adventure["name"],
      description: adventure["description"],
      cover_image: adventure["cover"],
      is_owner: adventure["creator"] === accountId,
      background: adventure["background"],
      quests: quests.results.map((row) => {
        return {
          id: row["quest_id"],
          title: row["title"],
          description: row["description"],
        };
      }),
      npcs: npcs.results.map((row) => {
        return {
          id: row["npc_id"],
          name: row["name"],
        };
      }),
      creatures: creatures.results.map((row) => {
        return {
          id: row["creature_id"],
          name: row["name"],
        };
      }),
      items: items.results.map((row) => {
        return {
          id: row["item_id"],
          name: row["name"],
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
