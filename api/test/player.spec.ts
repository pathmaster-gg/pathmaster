import {
  env as testEnv,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";
import { IncomingRequest, TOKEN, TOKEN2, initializeDb } from "./utils";

describe("Player API", () => {
  let env: Env;

  beforeEach(async () => {
    env = testEnv as Env;
    await initializeDb(env);

    // Uploads mock image
    await env.DB.exec("INSERT INTO image (owner, type) VALUES (1, 1);");
    await env.pathfinder_dev.put("1.jpg", "mock");

    // Creates mock adventure
    let ctx = createExecutionContext();
    let request = new IncomingRequest("http://example.com/api/adventure", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        name: "Kingmaker",
        cover_image_id: 1,
      }),
    });
    await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);

    // Creates mock session
    ctx = createExecutionContext();
    request = new IncomingRequest("http://example.com/api/session", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        name: "Test session",
        adventure_id: 1,
      }),
    });
    await worker.fetch(request, env, ctx);
    await waitOnExecutionContext(ctx);
  });

  it("serves player creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/player", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        name: "Nick",
        ancestry: "Human",
        level: 1,
        hp: 50,
        hp_max: 100,
        session_id: 1,
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);

    expect(
      await env.DB.prepare("SELECT * FROM player WHERE player_id = 1").first(),
    ).not.toBeNull();
  });

  it("rejects unauthorized player creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/player", {
      method: "POST",
      body: JSON.stringify({
        name: "Nick",
        ancestry: "Human",
        level: 1,
        hp: 50,
        hp_max: 100,
        session_id: 1,
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(401);
  });

  it("rejects player creation with missing fields", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/player", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        name: "Nick",
        ancestry: "Human",
        level: 1,
        hp: 50,
        session_id: 1,
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
  });

  it("rejects player creation with non-existent session", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/player", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        name: "Nick",
        ancestry: "Human",
        level: 1,
        hp: 50,
        hp_max: 100,
        session_id: 2,
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
  });

  it("rejects player creation from non-owner", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/player", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN2}` },
      body: JSON.stringify({
        name: "Nick",
        ancestry: "Human",
        level: 1,
        hp: 50,
        hp_max: 100,
        session_id: 1,
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(403);
  });

  describe("with player created", () => {
    beforeEach(async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/player", {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          name: "Nick",
          ancestry: "Human",
          level: 1,
          hp: 50,
          hp_max: 100,
          session_id: 1,
        }),
      });
      await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
    });

    it("serves player edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/player/1", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          name: "Updated player",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      expect(
        (await env.DB.prepare(
          "SELECT name FROM player WHERE player_id = 1",
        ).first())!.name,
      ).toBe("Updated player");
    });

    it("rejects unauthorized player edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/player/1", {
        method: "PATCH",
        body: JSON.stringify({
          name: "Updated player",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(401);
    });

    it("rejects non-existent player edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/player/2", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          name: "Updated player",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(404);
    });
  });
});
