import {
  env as testEnv,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";
import { IncomingRequest, TOKEN, initializeDb } from "./utils";

describe("Image API", () => {
  let env: Env;

  beforeEach(async () => {
    env = testEnv as Env;
    await initializeDb(env);
  });

  it("serves image upload ", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest(
      "http://example.com/api/image/adventure_cover",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: new Uint8Array([1, 2, 3]),
      },
    );
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);

    expect(
      await env.DB.prepare("SELECT * FROM image WHERE image_id = 1").first(),
    ).not.toBeNull();
  });

  describe("with image uploaded", () => {
    beforeEach(async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/image/adventure_cover",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${TOKEN}` },
          body: new Uint8Array([1, 2, 3]),
        },
      );
      await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
    });

    it("serves image retrival ", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/image/1");
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      expect(await response.bytes()).toStrictEqual(new Uint8Array([1, 2, 3]));
    });
  });
});
