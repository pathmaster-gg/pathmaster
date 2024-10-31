import { IRequest } from "itty-router";

interface ChatAskRequest {
  question: string;
}

export async function handleChatAsk(
  request: IRequest,
  _env: Env,
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

  // Mock AI response
  return new Response(
    JSON.stringify({
      answer:
        "In Pathfinder 2e, a module is a published adventure that takes you and your party through a self-contained story with a clear beginning, middle, and end. Modules are designed to guide you through a specific narrative, providing a setting, NPCs, plot, and obstacles to overcome.\nPathfinder 2e modules are often structured into several key components:\n1. Synopsis: A brief summary of the adventure's plot and setting.\n2. Setting: The world, environment, and details about the location and climate.\n3. Plot: The main storyline, including key events, NPCs, and plot twists.\n4. NPCs: Non-player characters, including stat blocks, personalities, and motivations.\n5. Adventures: The specific events and encounters that make up the adventure's main arc.\n6. Game Mechanics: Optional rules and mechanics that can be used to make the adventure more engaging.\n7. Conclusion: The resolution of the adventure, including any epilogue or wrap-up sections.\nModules can range from small, one-shot adventures to epic, multichapter quests. They're a great way for new players and new Game Masters (GMs) to experience the Pathfinder 2e game system, or for veteran players and GMs to enjoy a new storyline and challenges.",
    }),
    {
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
  );
}
