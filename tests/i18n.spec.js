import { test, expect } from "@playwright/test";

test.describe("i18n general namespace", () => {
  test("defaults to English when browser locale is en", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "en-US" });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.locator(".section-grid").waitFor();
    await expect(page.locator("html")).toHaveAttribute("lang", "en");
    await expect(page.locator(".home-subtitle")).toHaveText(
      "A step-by-step guide, by Adam Something",
    );
    await expect(page.locator(".btn-credits")).toHaveText("Credits");
    await ctx.close();
  });

  test("defaults to Portuguese when browser locale is pt", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "pt-PT" });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.locator(".section-grid").waitFor();
    await expect(page.locator("html")).toHaveAttribute("lang", "pt");
    await expect(page.locator(".home-subtitle")).toHaveText(
      "Um guia passo a passo, por Adam Something",
    );
    await expect(page.locator(".btn-credits")).toHaveText("Créditos");
    await expect(page.locator(".title-word-dating")).toHaveText("Namoro");
    await ctx.close();
  });

  test("persisted locale beats navigator language", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "en-US" });
    const page = await ctx.newPage();
    await page.addInitScript(() => {
      localStorage.setItem("locale", "pt");
    });
    await page.goto("/");
    await page.locator(".section-grid").waitFor();
    await expect(page.locator("html")).toHaveAttribute("lang", "pt");
    await expect(page.locator(".btn-credits")).toHaveText("Créditos");
    await ctx.close();
  });

  test("renders dynamic step count via plural rule", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "en-US" });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.locator(".section-grid").waitFor();
    // Pick a section that has steps; just assert the format matches "{n} steps"
    const stepsTexts = await page
      .locator(".section-card .section-card-footer span")
      .first()
      .allInnerTexts();
    expect(stepsTexts.join(" ")).toMatch(/\d+ steps?/);
    await ctx.close();
  });

  test("locale dropdown switches language and persists", async ({ browser }) => {
    const ctx = await browser.newContext({ locale: "en-US" });
    const page = await ctx.newPage();
    await page.goto("/");
    await page.locator(".section-grid").waitFor();

    const select = page.locator(".locale-select");
    await expect(select).toHaveValue("en");

    await select.selectOption("pt");
    await expect(page.locator("html")).toHaveAttribute("lang", "pt");
    await expect(page.locator(".btn-credits")).toHaveText("Créditos");
    await expect(page.locator(".locale-select")).toHaveValue("pt");

    await page.reload();
    await page.locator(".section-grid").waitFor();
    await expect(page.locator("html")).toHaveAttribute("lang", "pt");
    await expect(page.locator(".btn-credits")).toHaveText("Créditos");
    await expect(page.locator(".locale-select")).toHaveValue("pt");
    await ctx.close();
  });

  test("locale dropdown sits to the right of the Credits link", async ({ page }) => {
    await page.goto("/");
    await page.locator(".section-grid").waitFor();
    const localeBox = await page.locator("#locale-switch").boundingBox();
    const creditsBox = await page.locator(".btn-credits").boundingBox();
    expect(localeBox).not.toBeNull();
    expect(creditsBox).not.toBeNull();
    expect(localeBox.x).toBeGreaterThan(creditsBox.x);
  });

  test("locale options use country flag emoji", async ({ page }) => {
    await page.goto("/");
    await page.locator(".section-grid").waitFor();
    await expect(page.locator(".locale-select option[value='en']")).toHaveText("🇬🇧");
    await expect(page.locator(".locale-select option[value='pt']")).toHaveText("🇵🇹");
  });

  test("locale options are derived from the supported locales", async ({ page }) => {
    await page.goto("/");
    await page.locator(".section-grid").waitFor();
    // Options are rendered from i18n's LOCALES map, not hardcoded in the HTML.
    const supported = await page.evaluate(async () => {
      const m = await import("/js/i18n.js");
      return m.supportedLocales();
    });
    const optionValues = await page
      .locator(".locale-select option")
      .evaluateAll((opts) => opts.map((o) => o.value));
    expect(optionValues).toEqual(supported);
  });

  test("no leftover {key} placeholders on the page", async ({ page }) => {
    await page.goto("/");
    await page.locator(".section-grid").waitFor();
    const body = await page.locator("body").innerText();
    expect(body).not.toMatch(/\{general\.[\w.]+\}/);
  });
});
