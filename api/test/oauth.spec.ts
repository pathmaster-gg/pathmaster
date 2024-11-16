import {
  env as testEnv,
  createExecutionContext,
  waitOnExecutionContext,
} from "cloudflare:test";
import { describe, it, expect, beforeEach } from "vitest";
import worker from "../src/index";
import { IncomingRequest, initializeDb } from "./utils";

describe("Oauth API", () => {
  let env: Env;

  beforeEach(async () => {
    env = testEnv as Env;
    await initializeDb(env);
  });

  it("serves Google oauth requests", async () => {
    const ctx = createExecutionContext();
    (ctx as any).mocked = true;

    const request = new IncomingRequest("http://example.com/api/oauth/google");
    const response = await worker.fetch(request, env, ctx);

    await waitOnExecutionContext(ctx);
    expect(response.status).toBe(200);
  });
});
