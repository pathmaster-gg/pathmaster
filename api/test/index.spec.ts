import {
  env as testEnv,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";
import { IncomingRequest, initializeDb } from "./utils";

describe("Backend API", () => {
  let env: Env;

  beforeEach(async () => {
    env = testEnv as Env;
    await initializeDb(env);
  });

  it("responds 404 for non-existent routes", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/hello");
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(404);
    expect(await response.text()).toMatchInlineSnapshot(`"404, not found!"`);
  });

  it("rejects expired sessions", async () => {
    await env.DB.exec(
      "INSERT INTO session (session_id, type, token, create_time, expiration, account_id) VALUES (3, 2, 'mock', 1, 10, 1);",
    );

    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/account", {
      headers: { Authorization: `Bearer mock` },
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(401);
  });

  it("rejects non-existent sessions", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/account", {
      headers: { Authorization: `Bearer mock` },
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(401);
  });

  it("rejects invalid session type", async () => {
    await env.DB.exec(
      "INSERT INTO session (session_id, type, token, create_time, expiration, account_id) VALUES (3, 1, 'mock', 1, 999999999999, 1);",
    );

    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/account", {
      headers: { Authorization: `Bearer mock` },
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(403);
  });

  it("rejects missing authorization", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/account");
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(401);
  });
});
