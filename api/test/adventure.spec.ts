import {
  env as testEnv,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";
import {
  Adventure,
  AdventureHub,
  AdventureMetadata,
  GeneratedNpc,
} from "../src/models";
import { IncomingRequest, TOKEN, initializeDb } from "./utils";

describe("Adventure API", () => {
  let env: Env;

  beforeEach(async () => {
    env = testEnv as Env;
    await initializeDb(env);

    // Uploads mock image
    await env.DB.exec("INSERT INTO image (owner, type) VALUES (1, 1);");
    await env.pathfinder_dev.put("1.jpg", "mock");
  });

  it("serves adventure creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/adventure", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        name: "Kingmaker",
        cover_image_id: 1,
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);

    expect(
      await env.DB.prepare(
        "SELECT * FROM adventure WHERE name = 'Kingmaker'",
      ).first(),
    ).not.toBeNull();
  });

  describe("with adventure created", () => {
    beforeEach(async () => {
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

    it("serves user adventures", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/adventure/mine",
        {
          headers: { Authorization: `Bearer ${TOKEN}` },
        },
      );
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      const body = (await response.json()) as AdventureMetadata[];
      expect(body.length).toBe(1);
    });

    it("serves adventures hub", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/adventure/hub",
      );
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      const body = (await response.json()) as AdventureHub;
      expect(body.featured.length).toBe(1);
      expect(body.popular.length).toBe(0);
      expect(body.latest.length).toBe(1);
    });

    it("serves adventure", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/adventure/1");
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      const body = (await response.json()) as Adventure;
      expect(body.name).toBe("Kingmaker");
    });

    it("serves adventure edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/adventure/1",
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${TOKEN}`,
          },
          body: JSON.stringify({
            description: "updated description",
          }),
        },
      );
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      expect(
        (await env.DB.prepare(
          "SELECT description FROM adventure WHERE adventure_id = 1",
        ).first())!.description,
      ).toBe("updated description");
    });

    it("serves NPC name suggestion requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/adventure/1/ai/npc",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${TOKEN}` },
        },
      );
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      const body = (await response.json()) as GeneratedNpc;
      expect(body.name.length).to.be.greaterThan(0);
    });
  });
});
