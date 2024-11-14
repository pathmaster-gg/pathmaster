import { IRequest } from "itty-router";

interface ChatAskRequest {
  question: string;
}

export async function handleChatAsk(
  request: IRequest,
  env: Env,
): Promise<Response> {
  const body = (await request.json()) as ChatAskRequest;

  if (!body.question) {
    return new Response("invalid request", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 400,
    });
  }

  const newPrompt = await env.DB.prepare(
    "INSERT INTO chat_prompt (content) VALUES (?) RETURNING prompt_id",
  )
    .bind(body.question)
    .first();
  if (!newPrompt) {
    throw new Error("failed to insert prompt");
  }

  return new Response(
    JSON.stringify({
      sessionId: newPrompt["prompt_id"],
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}

export async function handleChatGetAnswer(
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

  const chatPrompt = await env.DB.prepare(
    `SELECT content FROM chat_prompt WHERE prompt_id = ?`,
  )
    .bind(parseInt(request.params.id))
    .first();
  if (!chatPrompt) {
    return new Response("prompt not found", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 404,
    });
  }

  const result = await env.AI.run(
    "@hf/meta-llama/meta-llama-3-8b-instruct" as BaseAiTextGenerationModels,
    {
      messages: [
        {
          role: "system",
          content:
            "You're an experienced game master in game mastering the tabletop role playing game Pathfinder 2e.",
        },
        {
          role: "user",
          content: chatPrompt["content"] as string,
        },
      ],
      stream: true,
    },
  );

  return new Response(result as ReadableStream<Uint8Array>, {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "text/event-stream",
    },
  });
}
