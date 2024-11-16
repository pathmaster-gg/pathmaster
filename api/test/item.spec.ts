import {
  env as testEnv,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";
import { IncomingRequest, TOKEN, TOKEN2, initializeDb } from "./utils";

describe("Item API", () => {
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

  it("serves item creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/item", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        adventure_id: 1,
        name: "Test item",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);

    expect(
      await env.DB.prepare("SELECT * FROM item WHERE item_id = 1").first(),
    ).not.toBeNull();
  });

  it("rejects unauthorized item creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/item", {
      method: "POST",
      body: JSON.stringify({
        adventure_id: 1,
        name: "Test item",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(401);
  });

  it("rejects item creation with missing fields", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/item", {
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

  it("rejects item creation with non-existent adventure", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/item", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        adventure_id: 2,
        name: "Test item",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
  });

  it("rejects item creation from non-owner", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/item", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN2}` },
      body: JSON.stringify({
        adventure_id: 1,
        name: "Test item",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(403);
  });

  describe("with item created", () => {
    beforeEach(async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/item", {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          adventure_id: 1,
          name: "Test item",
        }),
      });
      await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
    });

    it("serves item edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/item/1", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          name: "Updated item",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      expect(
        (await env.DB.prepare(
          "SELECT name FROM item WHERE item_id = 1",
        ).first())!.name,
      ).toBe("Updated item");
    });

    it("rejects unauthorized item edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/item/1", {
        method: "PATCH",
        body: JSON.stringify({
          name: "Updated item",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(401);
    });

    it("rejects non-existent item edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/item/2", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          name: "Updated item",
        }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(404);
    });

    it("serves item deletion requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/item/1", {
        method: "DELETE",
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      expect(
        (await env.DB.prepare(
          "SELECT deleted FROM item WHERE item_id = 1",
        ).first())!.deleted,
      ).toBe(1);
    });

    it("serves image generation requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/item/1/ai/image",
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
