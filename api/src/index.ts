import { Router } from "itty-router";

import { handleGetInfo, handleOnboard } from "./account";
import { handleGoogle } from "./oauth";
import {
  handleCreateAdventure,
  handleGenerateNpcName,
  handleGetAdventure,
  handleGetAdventureHub,
  handleGetMyAdventures,
  handleUpdateAdventure,
} from "./adventure";
import { handleGetImage, handleUploadImage } from "./image";
import {
  handleCreateGameSession,
  handleFinishQuest,
  handleGetGameSession,
  handleGetMyGameSessions,
  handleSetNpcNote,
  handleUnfinishQuest,
  handleUpdateGameSession,
} from "./session";
import {
  handleCreateQuest,
  handleDeleteQuest,
  handleUpdateQuest,
} from "./quest";
import { handleCreateNpc, handleDeleteNpc, handleUpdateNpc } from "./npc";
import {
  handleCreateCreature,
  handleDeleteCreature,
  handleUpdateCreature,
} from "./creature";
import { handleCreateItem, handleDeleteItem, handleUpdateItem } from "./item";
import {
  handleCreateGameSessionEvent,
  handleUpdateGameSessionEvent,
} from "./session_event";
import { handleCreatePlayer, handleUpdatePlayer } from "./player";
import { handleChatAsk } from "./chat";

export default {
  async fetch(request, env, _ctx): Promise<Response> {
    const router = Router();

    // CORS
    router.options(
      "*",
      () =>
        new Response(null, {
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Headers": "Authorization",
            "Access-Control-Allow-Methods": "POST,PATCH,DELETE,PUT",
          },
        }),
    );

    router.get("/api/oauth/google", (req) => handleGoogle(req, env));
    router.get("/api/account", (req) => handleGetInfo(req, env));
    router.post("/api/account/onboard", (req) => handleOnboard(req, env));
    router.post("/api/adventure", (req) => handleCreateAdventure(req, env));
    router.get("/api/adventure/mine", (req) => handleGetMyAdventures(req, env));
    router.get("/api/adventure/hub", (req) => handleGetAdventureHub(req, env));
    router.get("/api/adventure/:id", (req) => handleGetAdventure(req, env));
    router.patch("/api/adventure/:id", (req) =>
      handleUpdateAdventure(req, env),
    );
    router.post("/api/adventure/:id/ai/npc", (req) =>
      handleGenerateNpcName(req, env),
    );
    router.post("/api/quest", (req) => handleCreateQuest(req, env));
    router.patch("/api/quest/:id", (req) => handleUpdateQuest(req, env));
    router.delete("/api/quest/:id", (req) => handleDeleteQuest(req, env));
    router.post("/api/npc", (req) => handleCreateNpc(req, env));
    router.patch("/api/npc/:id", (req) => handleUpdateNpc(req, env));
    router.delete("/api/npc/:id", (req) => handleDeleteNpc(req, env));
    router.post("/api/creature", (req) => handleCreateCreature(req, env));
    router.patch("/api/creature/:id", (req) => handleUpdateCreature(req, env));
    router.delete("/api/creature/:id", (req) => handleDeleteCreature(req, env));
    router.post("/api/item", (req) => handleCreateItem(req, env));
    router.patch("/api/item/:id", (req) => handleUpdateItem(req, env));
    router.delete("/api/item/:id", (req) => handleDeleteItem(req, env));
    router.post("/api/session", (req) => handleCreateGameSession(req, env));
    router.get("/api/session/mine", (req) => handleGetMyGameSessions(req, env));
    router.get("/api/session/:id", (req) => handleGetGameSession(req, env));
    router.patch("/api/session/:id", (req) =>
      handleUpdateGameSession(req, env),
    );
    router.put("/api/session/:id/finished_quest/:quest_id", (req) =>
      handleFinishQuest(req, env),
    );
    router.delete("/api/session/:id/finished_quest/:quest_id", (req) =>
      handleUnfinishQuest(req, env),
    );
    router.post("/api/session_event", (req) =>
      handleCreateGameSessionEvent(req, env),
    );
    router.patch("/api/session_event/:id", (req) =>
      handleUpdateGameSessionEvent(req, env),
    );
    router.put("/api/session/:id/npc_note/:npc_id", (req) =>
      handleSetNpcNote(req, env),
    );
    router.post("/api/player", (req) => handleCreatePlayer(req, env));
    router.patch("/api/player/:id", (req) => handleUpdatePlayer(req, env));
    router.post("/api/image/:type", (req) => handleUploadImage(req, env));
    router.get("/api/image/:id", (req) => handleGetImage(req, env));
    router.post("/api/chat/ask", (req) => handleChatAsk(req, env));

    // 404 fallback
    router.all("*", () => new Response("404, not found!", { status: 404 }));

    return router.fetch(request);
  },
} satisfies ExportedHandler<Env>;
