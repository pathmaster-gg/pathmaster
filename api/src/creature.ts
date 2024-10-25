import { IRequest } from "itty-router";

import { AuthError, assertNormal } from "./utils/auth";

interface CreateCreatureRequest {
  adventure_id: number;
  name: string;
}

export async function handleCreateCreature(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {
    return (ex as AuthError).response;
  }

  const body = (await request.json()) as CreateCreatureRequest;

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

  const newCreature = await env.DB.prepare(
    "INSERT INTO creature (adventure_id, name, create_time) VALUES (?, ?, ?) RETURNING creature_id",
  )
    .bind(body.adventure_id, body.name, currentTime)
    .first();
  if (!newCreature) {
    throw new Error("failed to insert creature");
  }

  return new Response(
    JSON.stringify({
      id: newCreature["creature_id"],
      name: body.name,
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
