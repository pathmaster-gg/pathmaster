import { IRequest } from "itty-router";

export async function handleGetFromAuthor(
  request: IRequest,
  env: Env,
): Promise<Response> {
  if (!request.params.owner || !parseInt(request.params.owner)) {
    return new Response("missing `owner`", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const ownerId = parseInt(request.params.owner);
  const session = await env.DB.prepare(
    `SELECT adventure_id, name FROM adventure WHERE creator = ?`,
  )
    .bind(ownerId)
    .all();

  return new Response(
    JSON.stringify(
      session.results.map((row) => {
        return {
          id: row["adventure_id"],
          name: row["name"],
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
