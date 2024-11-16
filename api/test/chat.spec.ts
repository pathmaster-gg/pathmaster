import {
  env as testEnv,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";
import { IncomingRequest, initializeDb } from "./utils";

describe("Chat API", () => {
  let env: Env;

  beforeEach(async () => {
    env = testEnv as Env;
    await initializeDb(env);
  });

  it("serves chat creation", async () => {
    const ctx = createExecutionContext();
    const request = new IncomingRequest("http://example.com/api/chat/ask", {
      method: "POST",
      body: JSON.stringify({
        question: "What is a module?",
      }),
    });
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);

    expect(
      await env.DB.prepare(
        "SELECT * FROM chat_prompt WHERE prompt_id = 1",
      ).first(),
    ).not.toBeNull();
  });

  describe("with chat created", () => {
    beforeEach(async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest("http://example.com/api/chat/ask", {
        method: "POST",
        body: JSON.stringify({
          question: "What is a module?",
        }),
      });
      await worker.fetch(request, env, ctx);
      await waitOnExecutionContext(ctx);
    });

    it("serves chat answer", async () => {
      const ctx = createExecutionContext();
      const request = new IncomingRequest(
        "http://example.com/api/chat/answer/1",
      );
      const response = await worker.fetch(request, env, ctx);

      await waitOnExecutionContext(ctx);
      expect(response.status).toBe(200);
    });
  });
});
