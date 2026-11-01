import { defineConfig, devices } from "@playwright/test";
import path from "node:path";

const databasePath = path.resolve("/tmp/opencode/jazz-like-me-e2e.db");
const port = 3001;

export default defineConfig({
  testDir: "./tests/e2e",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: "list",
  use: {
    baseURL: `http://localhost:${port}`,
    trace: "on-first-retry",
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],
  webServer: {
    command: `npm run build && DATABASE_PATH=${databasePath} PORT=${port} npm start`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
});
