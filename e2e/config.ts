import { ChromiumEnv, FirefoxEnv, WebKitEnv, test, setConfig } from "@playwright/test";

setConfig({
  testDir: __dirname,  // Search for tests in this directory.
  timeout: 30000,  // Each test is given 30 seconds.
});

const options = {
  headless: true,  // Run tests in headless browsers.
  viewport: { width: 1280, height: 720 },
};

// Run tests in three browsers.
test.runWith(new ChromiumEnv(options), { tag: 'chromium' });
test.runWith(new FirefoxEnv(options), { tag: 'firefox' });
test.runWith(new WebKitEnv(options), { tag: 'webkit' });