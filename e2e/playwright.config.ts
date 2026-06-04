import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  workers: 1,
  timeout: 60_000,
  use: {
    baseURL: 'http://localhost:5173'
  },
  webServer: [
    {
      command: 'cd .. && rm -f backend/data/e2e-db.json && DB_PATH=backend/data/e2e-db.json npm run dev --workspace=backend',
      port: 3001,
      reuseExistingServer: true,
      timeout: 120_000
    },
    {
      command: 'cd .. && npm run dev --workspace=frontend -- --host 0.0.0.0',
      port: 5173,
      reuseExistingServer: true,
      timeout: 120_000
    }
  ]
});
