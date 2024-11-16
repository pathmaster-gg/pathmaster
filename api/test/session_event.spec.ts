import {
  env as testEnv,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";
import { IncomingRequest, TOKEN, initializeDb } from "./utils";

describe("Session event API", () => {
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

  it("creates default event", async () => {
    expect(
      await env.DB.prepare(
        "SELECT * FROM game_session_event WHERE event_id = 1",
      ).first(),
    ).not.toBeNull();
  });

  it("serves session event creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest(
      "http://example.com/api/session_event",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          name: "Test event",
          session_id: 1,
        }),
      },
    );
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);

    expect(
      await env.DB.prepare(
        "SELECT * FROM game_session_event WHERE event_id = 2",
      ).first(),
    ).not.toBeNull();
  });

  it("rejects unauthorized session event creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest(
      "http://example.com/api/session_event",
      {
        method: "POST",
        body: JSON.stringify({
          name: "Test event",
          session_id: 1,
        }),
      },
    );
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(401);
  });

  it("rejects session event creation with missing fields", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest(
      "http://example.com/api/session_event",
      {
        method: "POST",
        headers: { Authorization: `Bearer ${TOKEN}` },
        body: JSON.stringify({
          session_id: 1,
        }),
      },
    );
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
  });

  describe("with session event created", () => {
    beforeEach(async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/session_event",
        {
          method: "POST",
          headers: { Authorization: `Bearer ${TOKEN}` },
          body: JSON.stringify({
            name: "Test event",
            session_id: 1,
          }),
        },
      );
      await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
    });

    it("serves session event edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/session_event/2",
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${TOKEN}` },
          body: JSON.stringify({
            name: "Updated session event",
          }),
        },
      );
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);

      expect(
        (await env.DB.prepare(
          "SELECT name FROM game_session_event WHERE event_id = 2",
        ).first())!.name,
      ).toBe("Updated session event");
    });

    it("rejects unauthorized session event edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/session_event/1",
        {
          method: "PATCH",
          body: JSON.stringify({
            name: "Updated session event",
          }),
        },
      );
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(401);
    });

    it("rejects non-existent session event edit requests", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/session_event/3",
        {
          method: "PATCH",
          headers: { Authorization: `Bearer ${TOKEN}` },
          body: JSON.stringify({
            name: "Updated session event",
          }),
        },
      );
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(404);
    });
  });
});
