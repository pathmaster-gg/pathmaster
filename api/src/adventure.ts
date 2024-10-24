import { IRequest } from "itty-router";

import { AuthError, assertNormal } from "./utils/auth";

interface CreateAdventureRequest {
  name: string;
  cover_image_id: number;
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
      cover_image: body.cover_image_id,
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
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
    `SELECT adventure_id, name, cover FROM adventure WHERE creator = ?`,
  )
    .bind(accountId)
    .all();

  return new Response(
    JSON.stringify(
      session.results.map((row) => {
        return {
          id: row["adventure_id"],
          name: row["name"],
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
