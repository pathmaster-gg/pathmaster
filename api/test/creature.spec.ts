import {
  env as testEnv,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";
import { IncomingRequest, TOKEN, TOKEN2, initializeDb } from "./utils";

describe("Creature API", () => {
  let env: Env;

  beforeEach(async () => {
    env = testEnv as Env;
    await initializeDb(env);

    // Uploads mock image
    await env.DB.exec("INSERT INTO image (owner, type) VALUES (1, 1);");
    await env.pathfinder_dev.put("1.jpg", "mock");

    // Creates mock adventure
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/adventure", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        name: "Kingmaker",
        cover_image_id: 1,
      }),
    });
    await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
  });

  it("serves creature creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/creature", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        adventure_id: 1,
        name: "Test creature",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);

    expect(
      await env.DB.prepare(
        "SELECT * FROM creature WHERE creature_id = 1",
      ).first(),
    ).not.toBeNull();
  });

  it("rejects unauthorized creature creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/creature", {
      method: "POST",
      body: JSON.stringify({
        adventure_id: 1,
        name: "Test creature",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(401);
  });

  it("rejects creature creation with missing fields", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/creature", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        adventure_id: 1,
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
  });

  it("rejects creature creation with non-existent adventure", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/creature", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        adventure_id: 2,
        name: "Test creature",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
  });

  it("rejects creature creation from non-owner", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/creature", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN2}` },
      body: JSON.stringify({
        adventure_id: 1,
        name: "Test creature",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(403);
  });

  describe("with creature created", () => {
    beforeEach(async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/creature", {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          adventure_id: 1,
          name: "Test creature",
        }),
      });
      await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
    });

    it("serves creature edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/creature/1", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          name: "Updated creature",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      expect(
        (await env.DB.prepare(
          "SELECT name FROM creature WHERE creature_id = 1",
        ).first())!.name,
      ).toBe("Updated creature");
    });

    it("rejects unauthorized creature edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/creature/1", {
        method: "PATCH",
        body: JSON.stringify({
          name: "Updated creature",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(401);
    });

    it("rejects non-existent creature edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/creature/2", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          name: "Updated creature",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(404);
    });

    it("serves creature deletion requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/creature/1", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      expect(
        (await env.DB.prepare(
          "SELECT deleted FROM creature WHERE creature_id = 1",
        ).first())!.deleted,
      ).toBe(1);
    });

    it("serves image generation requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/creature/1/ai/avatar",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${TOKEN}` },
        },
      );
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);
    });
  });
});
