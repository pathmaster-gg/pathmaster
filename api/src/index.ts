import { Router } from "itty-router";

import { handleGetInfo, handleOnboard } from "./account";
import { handleGoogle } from "./oauth";
import { handleGetFromAuthor } from "./adventure";

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
    router.get("/api/adventure/owner/:owner", (req) =>
      handleGetFromAuthor(req, env),
    );

    // 404 fallback
    router.all("*", () => new Response("404, not found!", { status: 404 }));

    return router.fetch(request);
  },
} satisfies ExportedHandler<Env>;
