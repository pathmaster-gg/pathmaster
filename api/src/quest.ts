import { IRequest } from "itty-router";

import { AuthError, assertNormal } from "./utils/auth";

interface CreateQuestRequest {
  adventure_id: number;
  title: string;
  description: string;
}

interface UpdateQuestRequest {
  title: string | null;
  description: string | null;
}

export async function handleCreateQuest(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {
    return (ex as AuthError).response;
  }

  const body = (await request.json()) as CreateQuestRequest;

  if (!body.adventure_id || !body.title || !body.description) {
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

  const newQuest = await env.DB.prepare(
    "INSERT INTO quest (adventure_id, title, create_time, description) VALUES (?, ?, ?, ?) RETURNING quest_id",
  )
    .bind(body.adventure_id, body.title, currentTime, body.description)
    .first();
  if (!newQuest) {
    throw new Error("failed to insert quest");
  }

  return new Response(
    JSON.stringify({
      id: newQuest["quest_id"],
      title: body.title,
      description: body.description,
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}

export async function handleUpdateQuest(
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

  const body = (await request.json()) as UpdateQuestRequest;

  const updatingTitle = body.title !== undefined && body.title !== null;
  const updatingDescription =
    body.description !== undefined && body.description !== null;

  const adventureOwner = await env.DB.prepare(
    "SELECT adventure.creator FROM quest JOIN adventure ON (quest.adventure_id=adventure.adventure_id) WHERE quest_id = ?",
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

  if (updatingTitle) {
    setters.push("title=?");
    params.push(body.title);
  }
  if (updatingDescription) {
    setters.push("description=?");
    params.push(body.description);
  }

  const result = await env.DB.prepare(
    `UPDATE quest SET ${setters.join(",")} WHERE quest_id=?`,
  )
    .bind(...params, parseInt(request.params.id))
    .run();
  if (!result.meta.rows_written) {
    throw new Error("failed to update quest");
  }

  return new Response(null, {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
