import { Router } from "itty-router";

import { handleGetInfo, handleOnboard } from "./account";
import { handleGoogle } from "./oauth";
import {
  handleCreateAdventure,
  handleGetAdventure,
  handleGetAdventureHub,
  handleGetMyAdventures,
  handleUpdateAdventure,
} from "./adventure";
import { handleGetImage, handleUploadImage } from "./image";
import { handleCreateGameSession, handleGetMyGameSessions } from "./session";
import { handleCreateQuest, handleUpdateQuest } from "./quest";
import { handleCreateNpc } from "./npc";
import { handleCreateCreature } from "./creature";
import { handleCreateItem } from "./item";

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
            "Access-Control-Allow-Methods": "POST,PATCH",
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
    router.post("/api/quest", (req) => handleCreateQuest(req, env));
    router.patch("/api/quest/:id", (req) => handleUpdateQuest(req, env));
    router.post("/api/npc", (req) => handleCreateNpc(req, env));
    router.post("/api/creature", (req) => handleCreateCreature(req, env));
    router.post("/api/item", (req) => handleCreateItem(req, env));
    router.post("/api/session", (req) => handleCreateGameSession(req, env));
    router.get("/api/session/mine", (req) => handleGetMyGameSessions(req, env));
    router.post("/api/image/:type", (req) => handleUploadImage(req, env));
    router.get("/api/image/:id", (req) => handleGetImage(req, env));

    // 404 fallback
    router.all("*", () => new Response("404, not found!", { status: 404 }));

    return router.fetch(request);
  },
} satisfies ExportedHandler<Env>;
