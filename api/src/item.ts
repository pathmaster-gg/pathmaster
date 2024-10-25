import { IRequest } from "itty-router";

import { AuthError, assertNormal } from "./utils/auth";

interface CreateItemRequest {
  adventure_id: number;
  name: string;
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
    "INSERT INTO item (adventure_id, name, create_time) VALUES (?, ?, ?) RETURNING item_id",
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
