import { PlaywrightTestConfig, devices } from "@playwright/test";

// setConfig({
//   testDir: __dirname,  // Search for tests in this directory.
//   timeout: 30000,  // Each test is given 30 seconds.
// });

const config: PlaywrightTestConfig = {
  testDir: 'tests',
  timeout: 30_000,
  projects: [
    {
      name: 'chromium',
      use: {
        browserName: 'chromium',
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'firefox',
      use: {
        browserName: 'firefox',
        viewport: { width: 1280, height: 720 }
      }
    },
    {
      name: 'webkit',
      use: {
        browserName: 'webkit',
        viewport: { width: 1280, height: 720 }
      }
    }
  ]
}
export default config;
