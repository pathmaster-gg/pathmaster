import { SELF } from "cloudflare:test";
import { describe, it, expect } from "vitest";

describe("Backend API worker", () => {
  it("responds 404 for non-existent routes", async () => {
    const response = await SELF.fetch("https://example.com/hello");
    expect(response.status).toBe(404);
    expect(await response.text()).toMatchInlineSnapshot(`"404, not found!"`);
  });
});
