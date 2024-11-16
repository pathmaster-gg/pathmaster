import { defineWorkersConfig } from "@cloudflare/vitest-pool-workers/config";

export default defineWorkersConfig({
  test: {
    coverage: {
      enabled: true,
      provider: "istanbul",
      reporter: ["text", "json", "html"],
    },
    poolOptions: {
      workers: {
        wrangler: { configPath: "./wrangler.toml" },
        miniflare: {
          workers: [
            {
              name: "__WRANGLER_EXTERNAL_AI_WORKER",
              modules: true,
              script: `
export default function run() {
  return {
    run: () => {
      return {
        response: "123"
      };
    },
  };
}
`,
            },
          ],
        },
      },
    },
  },
});
