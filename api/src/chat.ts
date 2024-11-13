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

  const result = (await env.AI.run(
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
          content: body.question,
        },
      ],
    },
  )) as { response?: string };
  if (!result.response) {
    return new Response("AI model execution failed", {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      status: 500,
    });
  }

  // Mock AI response
  return new Response(
    JSON.stringify({
      answer: result.response,
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
