import { Router } from "itty-router";

import { handleGetInfo, handleOnboard } from "./account";
import { handleGoogle } from "./oauth";
import { handleCreateAdventure, handleGetMyAdventures } from "./adventure";
import { handleGetImage, handleUploadImage } from "./image";

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
          },
        }),
    );

    router.get("/api/oauth/google", (req) => handleGoogle(req, env));
    router.get("/api/account", (req) => handleGetInfo(req, env));
    router.post("/api/account/onboard", (req) => handleOnboard(req, env));
    router.post("/api/adventure", (req) => handleCreateAdventure(req, env));
    router.get("/api/adventure/mine", (req) => handleGetMyAdventures(req, env));
    router.post("/api/image/:type", (req) => handleUploadImage(req, env));
    router.get("/api/image/:id", (req) => handleGetImage(req, env));

    // 404 fallback
    router.all("*", () => new Response("404, not found!", { status: 404 }));

    return router.fetch(request);
  },
} satisfies ExportedHandler<Env>;
