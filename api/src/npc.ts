import { IRequest } from "itty-router";

import { AuthError, assertNormal } from "./utils/auth";

interface CreateNpcRequest {
  adventure_id: number;
  name: string;
}

interface UpdateNpcRequest {
  name: string | null;
}

export async function handleCreateNpc(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {
    return (ex as AuthError).response;
  }

  const body = (await request.json()) as CreateNpcRequest;

  if (!body.adventure_id || !body.name) {
    return new Response("invalid request", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const adventureOwner = await env.DB.prepare(
    "SELECT creator FROM adventure WHERE adventure_id = ?",
  )
    .bind(body.adventure_id)
    .first();
  if (!adventureOwner) {
    return new Response("adventure not found", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 404,
    });
  }
  if (accountId !== adventureOwner["creator"]) {
    return new Response("not adventure owner", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 403,
    });
  }

  const currentTime = Math.floor(new Date().getTime() / 1000);

  const newNpc = await env.DB.prepare(
    "INSERT INTO npc (adventure_id, name, create_time, deleted) VALUES (?, ?, ?, FALSE) RETURNING npc_id",
  )
    .bind(body.adventure_id, body.name, currentTime)
    .first();
  if (!newNpc) {
    throw new Error("failed to insert npc");
  }

  return new Response(
    JSON.stringify({
      id: newNpc["npc_id"],
      name: body.name,
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}

export async function handleUpdateNpc(
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

  const body = (await request.json()) as UpdateNpcRequest;

  const updatingName = body.name !== undefined && body.name !== null;

  const adventureOwner = await env.DB.prepare(
    "SELECT adventure.creator FROM npc JOIN adventure ON (npc.adventure_id=adventure.adventure_id) WHERE npc_id = ?",
  )
    .bind(parseInt(request.params.id))
    .first();
  if (!adventureOwner) {
    return new Response("adventure not found", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 404,
    });
  }
  if (accountId !== adventureOwner["creator"]) {
    return new Response("not adventure owner", {
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
    `UPDATE npc SET ${setters.join(",")} WHERE npc_id=?`,
  )
    .bind(...params, parseInt(request.params.id))
    .run();
  if (!result.meta.rows_written) {
    throw new Error("failed to update npc");
  }

  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function handleDeleteNpc(
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

  const adventureOwner = await env.DB.prepare(
    "SELECT adventure.creator FROM npc JOIN adventure ON (npc.adventure_id=adventure.adventure_id) WHERE npc_id = ?",
  )
    .bind(parseInt(request.params.id))
    .first();
  if (!adventureOwner) {
    return new Response("adventure not found", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 404,
    });
  }
  if (accountId !== adventureOwner["creator"]) {
    return new Response("not adventure owner", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 403,
    });
  }
  const result = await env.DB.prepare(
    `UPDATE npc SET deleted=TRUE WHERE npc_id = ? AND deleted = FALSE`,
  )
    .bind(parseInt(request.params.id))
    .run();
  if (!result.meta.rows_written) {
    throw new Error("failed to delete npc");
  }

  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
