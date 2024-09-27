import { Router } from "itty-router";

import { handleGoogle } from "./oauth";

export default {
  async fetch(request, env, _ctx): Promise<Response> {
    const router = Router();

    router.get("/api/oauth/google", (req) => handleGoogle(req, env));

    // 404 fallback
    router.all("*", () => new Response("404, not found!", { status: 404 }));

    return router.fetch(request);
  },
} satisfies ExportedHandler<Env>;
