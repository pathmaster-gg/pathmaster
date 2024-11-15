import { IRequest } from "itty-router";

import { AuthError, assertNormal } from "./utils/auth";
import { ImageType } from "./entities";

interface CreateCreatureRequest {
  adventure_id: number;
  name: string;
}

interface UpdateCreatureRequest {
  name: string | null;
  avatar_image: number | null;
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
    "INSERT INTO creature (adventure_id, name, create_time, deleted) VALUES (?, ?, ?, FALSE) RETURNING creature_id",
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

export async function handleUpdateCreature(
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

  const body = (await request.json()) as UpdateCreatureRequest;

  const updatingName = body.name !== undefined && body.name !== null;
  const updatingAvatarImage =
    body.avatar_image !== undefined && body.avatar_image !== null;

  const adventureOwner = await env.DB.prepare(
    "SELECT adventure.creator FROM creature JOIN adventure ON (creature.adventure_id=adventure.adventure_id) WHERE creature_id = ?",
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
  if (updatingAvatarImage) {
    setters.push("avatar=?");
    params.push(body.avatar_image);
  }

  const result = await env.DB.prepare(
    `UPDATE creature SET ${setters.join(",")} WHERE creature_id=?`,
  )
    .bind(...params, parseInt(request.params.id))
    .run();
  if (!result.meta.rows_written) {
    throw new Error("failed to update creature");
  }

  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function handleDeleteCreature(
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
    "SELECT adventure.creator FROM creature JOIN adventure ON (creature.adventure_id=adventure.adventure_id) WHERE creature_id = ?",
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
    `UPDATE creature SET deleted=TRUE WHERE creature_id = ? AND deleted = FALSE`,
  )
    .bind(parseInt(request.params.id))
    .run();
  if (!result.meta.rows_written) {
    throw new Error("failed to delete creature");
  }

  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}

export async function handleGenerateCreatureImage(
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

  const creatureId = parseInt(request.params.id);

  const creature = await env.DB.prepare(
    "SELECT creature.name, creator FROM creature JOIN adventure ON (creature.adventure_id=adventure.adventure_id) WHERE creature_id = ?",
  )
    .bind(creatureId)
    .first();
  if (!creature) {
    return new Response("creature not found", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 404,
    });
  }
  if (accountId !== creature["creator"]) {
    return new Response("not adventure owner", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 403,
    });
  }

  const creatureName = creature["name"] as string;

  const prompt = `pathfinder 2e,hostile creature,fantasy background,${creatureName.toLowerCase()}`;

  const result = await env.AI.run(
    "@cf/stabilityai/stable-diffusion-xl-base-1.0" as BaseAiTextToImageModels,
    { prompt } as any,
  );

  const reader = result.getReader();
  let rawBytes = new Uint8Array(0);
  while (true) {
    const segment = await reader.read();
    if (segment.value) {
      rawBytes = new Uint8Array([...rawBytes, ...segment.value]);
    }

    if (segment.done) {
      break;
    }
  }

  const newImage = await env.DB.prepare(
    "INSERT INTO image (owner, type) VALUES (?, ?) RETURNING image_id",
  )
    .bind(accountId, ImageType.CreatureAvatar)
    .first();
  if (!newImage) {
    throw new Error("failed to insert image");
  }

  await env.pathfinder_dev.put(`${newImage["image_id"]}.jpg`, rawBytes);

  return new Response(JSON.stringify({ id: newImage["image_id"] }), {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
