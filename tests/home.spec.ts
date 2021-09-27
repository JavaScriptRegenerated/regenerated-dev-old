import { test, expect } from "@playwright/test";

test("has nav", async ({ page }) => {
  await page.goto("https://regenerated.dev/");
  const name = await page.innerText("nav");
  expect(name.trim()).toBe("Home");
});