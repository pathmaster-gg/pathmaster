import {
  env as testEnv,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";
import { IncomingRequest, TOKEN, TOKEN2, initializeDb } from "./utils";

describe("NPC API", () => {
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

  it("serves NPC creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/npc", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        adventure_id: 1,
        name: "Test npc",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);

    expect(
      await env.DB.prepare("SELECT * FROM npc WHERE npc_id = 1").first(),
    ).not.toBeNull();
  });

  it("rejects unauthorized NPC creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/npc", {
      method: "POST",
      body: JSON.stringify({
        adventure_id: 1,
        name: "Test npc",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(401);
  });

  it("rejects NPC creation with missing fields", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/npc", {
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

  it("rejects NPC creation with non-existent adventure", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/npc", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        adventure_id: 2,
        name: "Test npc",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
  });

  it("rejects NPC creation from non-owner", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/npc", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN2}` },
      body: JSON.stringify({
        adventure_id: 1,
        name: "Test npc",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(403);
  });

  describe("with NPC created", () => {
    beforeEach(async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/npc", {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          adventure_id: 1,
          name: "Test npc",
        }),
      });
      await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
    });

    it("serves NPC edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/npc/1", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          name: "Updated npc",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      expect(
        (await env.DB.prepare("SELECT name FROM npc WHERE npc_id = 1").first())!
          .name,
      ).toBe("Updated npc");
    });

    it("rejects unauthorized NPC edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/npc/1", {
        method: "PATCH",
        body: JSON.stringify({
          name: "Updated npc",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(401);
    });

    it("rejects non-existent NPC edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/npc/2", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          name: "Updated npc",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(404);
    });

    it("serves NPC deletion requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/npc/1", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      expect(
        (await env.DB.prepare(
          "SELECT deleted FROM npc WHERE npc_id = 1",
        ).first())!.deleted,
      ).toBe(1);
    });
  });
});
