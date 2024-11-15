import { IRequest } from "itty-router";

import { AuthError, assertNormal } from "./utils/auth";
import { ImageType } from "./models";
import { ImageType as DbImageType } from "./entities";

export async function handleGetImage(
  request: IRequest,
  env: Env,
): Promise<Response> {
  if (!request.params.id || !parseInt(request.params.id)) {
    return new Response("missing `id`", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const imageId = parseInt(request.params.id);

  const image = await env.DB.prepare(
    "SELECT image_id FROM image WHERE image_id = ?",
  )
    .bind(imageId)
    .first();
  if (!image) {
    throw new Error("failed to fetch image");
  }

  const r2Object = await env.pathfinder_dev.get(`${imageId}.jpg`);

  return new Response(await r2Object?.arrayBuffer(), {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "image/jpeg",
    },
  });
}

export async function handleUploadImage(
  request: IRequest,
  env: Env,
): Promise<Response> {
  let accountId: number;
  try {
    accountId = await assertNormal(request, env);
  } catch (ex) {
    return (ex as AuthError).response;
  }

  // TODO: validate and re-encode image
  let imageType, imageData;
  if (request.params.type === ImageType.AdventureCover) {
    imageType = imageType = DbImageType.AdventureCover;
    imageData = await request.bytes();
  } else if (request.params.type === ImageType.CreatureAvatar) {
    imageType = imageType = DbImageType.CreatureAvatar;
    imageData = await request.bytes();
  } else {
    return new Response("unknown image type", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const newImage = await env.DB.prepare(
    "INSERT INTO image (owner, type) VALUES (?, ?) RETURNING image_id",
  )
    .bind(accountId, imageType)
    .first();
  if (!newImage) {
    throw new Error("failed to insert image");
  }

  await env.pathfinder_dev.put(`${newImage["image_id"]}.jpg`, imageData);

  return new Response(JSON.stringify({ id: newImage["image_id"] }), {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
