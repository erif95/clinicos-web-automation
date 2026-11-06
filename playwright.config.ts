import { defineConfig, devices } from '@playwright/test';
import { pathToFileURL } from 'node:url';
import path from 'node:path';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    ...devices['Desktop Chrome'],
    timezoneId: 'Europe/Berlin',
    baseURL: pathToFileURL(path.resolve(__dirname, 'booking-app.html')).href,
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure',
  },
});
