import {
  env as testEnv,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";
import { AccountInfo } from "../src/models";
import { IncomingRequest, TOKEN, initializeDb } from "./utils";

describe("Account API", () => {
  let env: Env;

  beforeEach(async () => {
    env = testEnv as Env;
    await initializeDb(env);
  });

  it("serves account info", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/account", {
      headers: { Authorization: `Bearer ${TOKEN}` },
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);

    const body = (await response.json()) as AccountInfo;
    expect(body.username).toBe("pathmaster");
  });

  it("serves onboard requests", async () => {
    await env.DB.exec(
      "INSERT INTO session (session_id, type, token, create_time, expiration, email) VALUES (3, 1, 'mock', 1, 999999999999, 'new@pathmaster.gg');",
    );

    const ctx = createExecutionContext();
    const request = new IncomingRequest(
      "http://example.com/api/account/onboard",
      {
        method: "POST",
        headers: { Authorization: "Bearer mock" },
        body: JSON.stringify({ username: "mock" }),
      },
    );
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);

    expect(
      await env.DB.prepare(
        "SELECT * FROM account WHERE username = 'mock'",
      ).first(),
    ).not.toBeNull();
  });

  it("rejects unauthorized onboard requests", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest(
      "http://example.com/api/account/onboard",
      { method: "POST" },
    );
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(401);
  });

  it("rejects onboard with invalid usernames", async () => {
    await env.DB.exec(
      "INSERT INTO session (session_id, type, token, create_time, expiration, email) VALUES (3, 1, 'mock', 1, 999999999999, 'new@pathmaster.gg');",
    );

    const ctx = createExecutionContext();
    const request = new IncomingRequest(
      "http://example.com/api/account/onboard",
      {
        method: "POST",
        headers: { Authorization: "Bearer mock" },
        body: JSON.stringify({ username: "mo" }),
      },
    );
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(400);
  });
});
