import { defineConfig, devices } from "@playwright/test";

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
    command: `npm run build && DATABASE_PATH=:memory: PORT=${port} npm start`,
    url: `http://localhost:${port}`,
    reuseExistingServer: false,
    timeout: 120 * 1000,
  },
});
