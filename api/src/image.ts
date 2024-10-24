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

  const image = await env.DB.prepare(
    "SELECT data FROM image WHERE image_id = ?",
  )
    .bind(parseInt(request.params.id))
    .first();
  if (!image) {
    throw new Error("failed to fetch image");
  }

  return new Response(new Uint8Array(image["data"] as any), {
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
  } else {
    return new Response("unknown image type", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const newImage = await env.DB.prepare(
    "INSERT INTO image (owner, type, data) VALUES (?, ?, ?) RETURNING image_id",
  )
    .bind(accountId, imageType, imageData)
    .first();
  if (!newImage) {
    throw new Error("failed to insert image");
  }

  return new Response(JSON.stringify({ id: newImage["image_id"] }), {
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
  });
}
