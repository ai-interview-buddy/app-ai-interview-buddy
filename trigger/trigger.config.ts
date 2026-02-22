import { defineConfig } from "@trigger.dev/sdk/v3";

export default defineConfig({
  // Cloud: proj_ffkivnmyaprdczrshfos | Local: create at http://localhost:8030
  project: process.env.TRIGGER_PROJECT_REF || "proj_ffkivnmyaprdczrshfos",
  dirs: ["./src/trigger"],
  maxDuration: 300,
  retries: {
    enabledInDev: false,
    default: {
      maxAttempts: 3,
      minTimeoutInMs: 1000,
      maxTimeoutInMs: 30000,
      factor: 2,
      randomize: true,
    },
  },
});
