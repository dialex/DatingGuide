import { test, expect } from "@playwright/test";

test.describe("Rendering", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/#intro/1");
    await page.locator(".wizard-step-card:not(.peek)").waitFor();
  });

  test("renders a step card on load", async ({ page }) => {
    await expect(page.locator(".wizard-step-card:not(.peek)")).toBeVisible();
  });

  test("renders step 1 badge on load", async ({ page }) => {
    await expect(page.locator(".wizard-step-badge")).toContainText("Step 1");
  });
});

test.describe("Deep-link boot", () => {
  test("does not flash the home view while i18n loads", async ({ page }) => {
    // Slow the locale modules so the boot-gate window is observable.
    await page.route("**/i18n/**", async (route) => {
      await new Promise((r) => setTimeout(r, 500));
      await route.continue();
    });

    await page.goto("/#keeping/1", { waitUntil: "commit" });

    // While the dictionary is loading the page is gated: no home grid, no header.
    await expect(page.locator("body")).toHaveClass(/booting/);
    await expect(page.locator(".section-grid")).toHaveCount(0);
    await expect(page.locator("#home-header")).toBeHidden();

    // Once booted, the keeping step shows cleanly and the gate is lifted.
    await page.locator(".wizard-step-card:not(.peek)").waitFor();
    await expect(page.locator("body")).not.toHaveClass(/booting/);
    await expect(page.locator(".wizard-step-badge")).toContainText("Step 1");
    await expect(page.locator(".section-grid")).toHaveCount(0);
    await expect(page.locator("#home-header")).toBeHidden();
  });
});
