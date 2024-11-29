import {
  env as testEnv,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";
import { IncomingRequest, TOKEN, initializeDb } from "./utils";
import { GameSession, GameSessionMetadata } from "../src/models";

describe("Session API", () => {
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

  it("serves session creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/session", {
      method: "POST",
      headers: { Authorization: `Bearer ${TOKEN}` },
      body: JSON.stringify({
        name: "Test session",
        adventure_id: 1,
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);

    expect(
      await env.DB.prepare(
        "SELECT * FROM game_session WHERE session_id = 1",
      ).first(),
    ).not.toBeNull();
  });

  it("rejects unauthorized session creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/session", {
      method: "POST",
      body: JSON.stringify({
        name: "Test session",
        adventure_id: 1,
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(401);
  });

  it("rejects session creation with missing fields", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/session", {
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

  describe("with session created", () => {
    beforeEach(async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/session", {
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

    it("serves user sessions", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/session/mine",
        {
          headers: { Authorization: `Bearer ${TOKEN}` },
        },
      );
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      const body = (await response.json()) as GameSessionMetadata[];
      expect(body.length).toBe(1);
    });

    it("rejects unauthorized user sessions request", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/session/mine",
      );
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(401);
    });

    it("serves session", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/session/1", {
        headers: { Authorization: `Bearer ${TOKEN}` },
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      const body = (await response.json()) as GameSession;
      expect(body.name).toBe("Test session");
    });

    it("rejects session request with invalid id", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/session/abc",
        {
          headers: { Authorization: `Bearer ${TOKEN}` },
        },
      );
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(400);
    });

    it("serves udpate session requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/session/1", {
        method: "PATCH",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({ notes: "Updated notes" }),
      });
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      expect(
        (await env.DB.prepare(
          "SELECT notes FROM game_session WHERE session_id = 1",
        ).first())!.notes,
      ).toBe("Updated notes");
    });

    describe("with quest created", () => {
      beforeEach(async () => {
        const ctx = createExecutionContext();
        const request = new IncomingRequest("http://example.com/api/quest", {
          method: "POST",
          headers: { Authorization: `Bearer ${TOKEN}` },
          body: JSON.stringify({
            adventure_id: 1,
            title: "Quest",
            description: "This is a quest",
          }),
        });
        await worker.fetch(request, env, ctx);
        await waitOnExecutionContext(ctx);
      });

      it("serves quest completion requests", async () => {
        const ctx = createExecutionContext();
        const request = new IncomingRequest(
          "http://example.com/api/session/1/finished_quest/1",
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${TOKEN}` },
          },
        );
        const response = await worker.fetch(request, env, ctx);

        await waitOnExecutionContext(ctx);
        expect(response.status).toBe(200);

        expect(
          await env.DB.prepare(
            "SELECT * FROM game_session_finished_quest WHERE session_id = 1 AND quest_id = 1",
          ).first(),
        ).not.toBeNull();
      });

      describe("with quest completed", () => {
        beforeEach(async () => {
          const ctx = createExecutionContext();
          const request = new IncomingRequest(
            "http://example.com/api/session/1/finished_quest/1",
            {
              method: "PUT",
              headers: { Authorization: `Bearer ${TOKEN}` },
            },
          );
          await worker.fetch(request, env, ctx);
          await waitOnExecutionContext(ctx);
        });

        it("serves quest uncompletion requests", async () => {
          const ctx = createExecutionContext();
          const request = new IncomingRequest(
            "http://example.com/api/session/1/finished_quest/1",
            {
              method: "DELETE",
              headers: { Authorization: `Bearer ${TOKEN}` },
            },
          );
          const response = await worker.fetch(request, env, ctx);

          await waitOnExecutionContext(ctx);
          expect(response.status).toBe(200);

          expect(
            await env.DB.prepare(
              "SELECT * FROM game_session_finished_quest WHERE session_id = 1 AND quest_id = 1",
            ).first(),
          ).toBeNull();
        });
      });
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

      it("serves set NPC note requests", async () => {
        const ctx = createExecutionContext();
        const request = new IncomingRequest(
          "http://example.com/api/session/1/npc_note/1",
          {
            method: "PUT",
            headers: { Authorization: `Bearer ${TOKEN}` },
            body: JSON.stringify({
              note: "Note",
            }),
          },
        );
        const response = await worker.fetch(request, env, ctx);

        await waitOnExecutionContext(ctx);
        expect(response.status).toBe(200);

        expect(
          (await env.DB.prepare(
            "SELECT * FROM game_session_npc_note WHERE session_id = 1 AND npc_id = 1",
          ).first())!.note,
        ).toBe("Note");
      });
    });

    it("reject set NPC note requests with invalid npc id", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/session/1/npc_note/abc",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${TOKEN}` },
          body: JSON.stringify({
            note: "Note",
          }),
        },
      );
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(400);
    });

    it("reject set NPC note requests with non-existent npc id", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/session/1/npc_note/2",
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${TOKEN}` },
          body: JSON.stringify({
            note: "Note",
          }),
        },
      );
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(404);
    });
  });
});
