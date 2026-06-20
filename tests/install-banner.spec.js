import { test, expect } from "@playwright/test";

// The "Add to Home screen" callout follows three rules:
//  1. It stays hidden on the user's first home visit.
//  2. It appears from the second home visit onward.
//  3. Once dismissed it never appears again, across navigations and reloads.

const banner = "#install-banner";

async function goToSectionAndBack(page) {
  await page.locator("#section-intro").click();
  await page.locator(".wizard-step-card:not(.peek)").waitFor();
  await page.locator("#btn-restart").click();
  await page.locator(".section-grid").waitFor();
}

test.describe("Install callout", () => {
  test("stays hidden on the first home visit", async ({ page }) => {
    await page.goto("/");
    await page.locator(".section-grid").waitFor();
    await expect(page.locator(banner)).toBeHidden();
  });

  test("appears on the second home visit", async ({ page }) => {
    await page.goto("/");
    await page.locator(".section-grid").waitFor();
    await goToSectionAndBack(page);
    await expect(page.locator(banner)).toBeVisible();
  });

  test("stays hidden once dismissed, across navigation and reloads", async ({ page }) => {
    await page.goto("/");
    await page.locator(".section-grid").waitFor();
    await goToSectionAndBack(page);
    await expect(page.locator(banner)).toBeVisible();

    await page.locator("#btn-dismiss-banner").click();
    await expect(page.locator(banner)).toBeHidden();

    // Returning home again must not bring it back.
    await goToSectionAndBack(page);
    await expect(page.locator(banner)).toBeHidden();

    // A full reload must not bring it back either.
    await page.goto("/");
    await page.locator(".section-grid").waitFor();
    await goToSectionAndBack(page);
    await expect(page.locator(banner)).toBeHidden();
  });
});
