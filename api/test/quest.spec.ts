import {
  env as testEnv,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";
import { IncomingRequest, TOKEN, TOKEN2, initializeDb } from "./utils";

describe("Quest API", () => {
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

  it("serves quest creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/quest", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        adventure_id: 1,
        title: "Test quest",
        description: "This is a test quest",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);

    expect(
      await env.DB.prepare("SELECT * FROM quest WHERE quest_id = 1").first(),
    ).not.toBeNull();
  });

  it("rejects unauthorized quest creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/quest", {
      method: "POST",
      body: JSON.stringify({
        adventure_id: 1,
        title: "Test quest",
        description: "This is a test quest",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(401);
  });

  it("rejects quest creation with missing fields", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/quest", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        adventure_id: 1,
        title: "Test quest",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
  });

  it("rejects quest creation with non-existent adventure", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/quest", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        adventure_id: 2,
        title: "Test quest",
        description: "This is a test quest",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
  });

  it("rejects quest creation from non-owner", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/quest", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN2}` },
      body: JSON.stringify({
        adventure_id: 1,
        title: "Test quest",
        description: "This is a test quest",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(403);
  });

  describe("with quest created", () => {
    beforeEach(async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/quest", {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          adventure_id: 1,
          title: "Test quest",
          description: "This is a test quest",
        }),
      });
      await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
    });

    it("serves quest edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/quest/1", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          title: "Updated title",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      expect(
        (await env.DB.prepare(
          "SELECT title FROM quest WHERE quest_id = 1",
        ).first())!.title,
      ).toBe("Updated title");
    });

    it("rejects unauthorized quest edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/quest/1", {
        method: "PATCH",
        body: JSON.stringify({
          title: "Updated title",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(401);
    });

    it("rejects non-existent quest edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/quest/2", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          title: "Updated title",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(404);
    });

    it("serves quest deletion requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/quest/1", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      expect(
        (await env.DB.prepare(
          "SELECT deleted FROM quest WHERE quest_id = 1",
        ).first())!.deleted,
      ).toBe(1);
    });
  });
});
