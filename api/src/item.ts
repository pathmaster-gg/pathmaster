import { IRequest } from "itty-router";

import { AuthError, assertNormal } from "./utils/auth";

interface CreateItemRequest {
  adventure_id: number;
  name: string;
}

interface UpdateItemRequest {
  name: string | null;
}

export async function handleCreateItem(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {
    return (ex as AuthError).response;
  }

  const body = (await request.json()) as CreateItemRequest;

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

  const newItem = await env.DB.prepare(
    "INSERT INTO item (adventure_id, name, create_time, deleted) VALUES (?, ?, ?, FALSE) RETURNING item_id",
  )
    .bind(body.adventure_id, body.name, currentTime)
    .first();
  if (!newItem) {
    throw new Error("failed to insert item");
  }

  return new Response(
    JSON.stringify({
      id: newItem["item_id"],
      name: body.name,
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}

export async function handleUpdateItem(
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

  const body = (await request.json()) as UpdateItemRequest;

  const updatingName = body.name !== undefined && body.name !== null;

  const adventureOwner = await env.DB.prepare(
    "SELECT adventure.creator FROM item JOIN adventure ON (item.adventure_id=adventure.adventure_id) WHERE item_id = ?",
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
    `UPDATE item SET ${setters.join(",")} WHERE item_id=?`,
  )
    .bind(...params, parseInt(request.params.id))
    .run();
  if (!result.meta.rows_written) {
    throw new Error("failed to update item");
  }

  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function handleDeleteItem(
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
    "SELECT adventure.creator FROM item JOIN adventure ON (item.adventure_id=adventure.adventure_id) WHERE item_id = ?",
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
    `UPDATE item SET deleted=TRUE WHERE item_id = ? AND deleted = FALSE`,
  )
    .bind(parseInt(request.params.id))
    .run();
  if (!result.meta.rows_written) {
    throw new Error("failed to delete item");
  }

  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
