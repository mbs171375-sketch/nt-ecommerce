// Run against a running static server: node scripts/smoke-test.cjs
// Requires Playwright, available in the Codex cloud environment.
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const base = process.env.STORE_TEST_URL || "http://127.0.0.1:8000";
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROMIUM_PATH || "/usr/bin/chromium",
    headless: true,
    args: ["--no-sandbox"],
  });
  let checks = 0;
  try {
    for (const width of [1440, 390, 320]) {
      const context = await browser.newContext({
        viewport: { width, height: 900 },
      });
      const page = await context.newPage();
      const errors = [],
        failed = [];
      page.on("pageerror", (e) => errors.push(e.message));
      page.on("response", (r) => {
        if (r.status() >= 400) failed.push(`${r.status()} ${r.url()}`);
      });
      page.on("requestfailed", (r) => failed.push(r.url()));
      for (const path of [
        "index.html",
        "products.html",
        "product.html?id=sp5der-hoodie",
        "checkout.html",
      ]) {
        await page.goto(`${base}/${path}`, { waitUntil: "networkidle" });
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth <= innerWidth,
          ),
          true,
          `Overflow at ${width}: ${path}`,
        );
        checks++;
      }
      await page.goto(`${base}/index.html`);
      assert.equal(await page.locator("#home-grid .product-card").count(), 10);
      checks++;
      assert.match(
        await page.locator("h1").textContent(),
        /Start your\s*reselling journey/,
      );
      checks++;
      assert.equal(await page.locator(".reseller-intro img").count(), 0);
      checks++;
      assert.equal(
        await page
          .locator("#home-grid .product-card")
          .first()
          .getAttribute("href"),
        "product.html?id=bape-tee",
      );
      checks++;
      const theme = await page.evaluate(() =>
        getComputedStyle(document.documentElement)
          .getPropertyValue("--accent")
          .trim(),
      );
      assert.equal(theme, "#f1f1f1");
      checks++;
      await page.goto(`${base}/products.html`);
      await page.locator('[data-category="Hoodies"]').click();
      assert.equal(await page.locator(".product-card").count(), 4);
      checks++;
      await page.locator('[data-category="All clothing"]').click();
      await page.locator("#sort").selectOption("name");
      assert.match(
        await page.locator(".product-card").first().textContent(),
        /Arc.teryx jacket/,
      );
      checks++;
      await page.locator("[data-search]").click();
      await page.locator("#search-input").fill("BAPE");
      assert.equal(await page.locator(".search-result").count(), 1);
      checks++;
      await page.locator(".search-result").click();
      assert.match(
        await page.locator(".detail-price").textContent(),
        /USD\s*10\.50/,
      );
      checks++;
      assert.match(
        await page.locator(".detail-price").textContent(),
        /AUD\s*15\.00/,
      );
      checks++;
      assert.deepEqual(
        await page
          .locator('[name="variant"]')
          .evaluateAll((es) => es.map((e) => e.value)),
        ["Small", "Medium", "Large", "XL"],
      );
      checks++;
      await page.locator("#product-quantity").fill("1000");
      await page.locator("#product-quantity").dispatchEvent("change");
      assert.equal(await page.locator("#product-quantity").inputValue(), "99");
      checks++;
      await page.locator("#product-quantity").fill("0");
      await page.locator("#product-quantity").dispatchEvent("change");
      assert.equal(await page.locator("#quantity-minus").isDisabled(), true);
      checks++;
      await page.locator("#product-quantity").fill("2");
      await page.locator("#product-quantity").dispatchEvent("change");
      await page.locator(".variant").filter({ hasText: "Medium" }).click();
      assert.equal(
        await page.locator('input[name="variant"][value="Medium"]').isChecked(),
        true,
      );
      checks++;
      await page.locator("#add-bag").click();
      assert.match(await page.locator("#bag-content").textContent(), /Medium/);
      checks++;
      await page.reload();
      await page.locator("[data-bag]").click();
      assert.equal(await page.locator(".bag-quantity span").textContent(), "2");
      checks++;
      await page.locator('[data-adjust][data-delta="1"]').click();
      assert.equal(await page.locator(".bag-quantity span").textContent(), "3");
      checks++;
      await page.locator('#bag-content a[href="checkout.html"]').click();
      await page.locator('[data-step="1"] button[type="submit"]').click();
      assert.equal(await page.locator('[data-step="1"]').isVisible(), true);
      checks++;
      await page.locator('[name="firstName"]').fill("Test");
      await page.locator('[name="lastName"]').fill("Customer");
      await page.locator('[name="email"]').fill("test@example.com");
      await page.locator('[data-step="1"] button[type="submit"]').click();
      await page.locator('[name="address"]').fill("1 Example Street");
      await page.locator('[name="city"]').fill("Sydney");
      await page.locator('[name="state"]').selectOption("NSW");
      await page.locator('[name="postcode"]').fill("2000");
      await page.locator('[data-step="2"] button[type="submit"]').click();
      assert.equal(await page.locator('[data-step="3"]').isVisible(), true);
      assert.equal(await page.locator("#pay-button").isDisabled(), true);
      assert.match(
        await page.locator(".summary-costs .total").textContent(),
        /USD\s*37\.80/,
      );
      checks++;
      assert.match(
        await page.locator("#delivery-review").textContent(),
        /Test Customer/,
      );
      checks += 3;
      const storage = await page.evaluate(() => JSON.stringify(localStorage));
      assert.equal(storage.includes("test@example.com"), false);
      assert.equal(storage.includes("Example Street"), false);
      checks += 2;
      await page.locator('[data-back="2"]').click();
      assert.equal(
        await page.locator('[name="address"]').inputValue(),
        "1 Example Street",
      );
      checks++;
      await page.locator("#edit-bag").click();
      await page.locator("[data-remove]").click();
      await page.locator("#bag-dialog [data-close]").click();
      await page.waitForFunction(() =>
        document
          .querySelector("main")
          .textContent.includes("Your bag is empty"),
      );
      checks++;
      await page.goto(`${base}/product.html?id=not-real`);
      assert.match(
        await page.locator("main").textContent(),
        /Product not found/,
      );
      checks++;
      await page.goto(`${base}/product.html?id=ralph-lauren-bundle`);
      assert.match(
        await page.locator(".detail-description").textContent(),
        /3 Ralph Lauren T-shirts for AUD 40/,
      );
      checks++;
      await page.locator("#quantity-plus").click();
      assert.match(
        await page.locator("#add-total").textContent(),
        /USD\s*56\.00/,
      );
      checks++;
      await page.goto(`${base}/product.html?id=essentials-hoodie`);
      await page.locator("#buy-now").click();
      assert.match(
        await page.locator(".summary-costs .total").textContent(),
        /USD\s*27\.30/,
      );
      checks++;
      assert.deepEqual(errors, []);
      assert.deepEqual(failed, []);
      checks += 2;
      console.log(
        `PASS shopping flow, validation, persistence, privacy and layouts at ${width}px`,
      );
      await context.close();
    }
    // Verify the future Stripe handoff contract without sending customer data to a real service.
    const page = await browser.newPage();
    await page.goto(`${base}/product.html?id=blank-hoodie`);
    await page.locator("#buy-now").click();
    await page.evaluate(() => {
      window.STORE.checkoutEndpoint = "/api/checkout";
    });
    // Page rendering happens on load, so activate the endpoint before application scripts run.
    await page.addInitScript(() => {
      Object.defineProperty(window, "STORE", {
        configurable: true,
        get() {
          return this._store;
        },
        set(v) {
          v.checkoutEndpoint = "/api/checkout";
          // Synthetic price only for the mocked-payment test; never saved in the catalogue.
          v.products.forEach((p) => (p.price = 4900));
          this._store = v;
        },
      });
    });
    await page.reload();
    await page.locator('[name="firstName"]').fill("Test");
    await page.locator('[name="lastName"]').fill("Customer");
    await page.locator('[name="email"]').fill("test@example.com");
    await page.locator('[data-step="1"] button[type="submit"]').click();
    await page.locator('[name="address"]').fill("1 Example Street");
    await page.locator('[name="city"]').fill("Sydney");
    await page.locator('[name="state"]').selectOption("NSW");
    await page.locator('[name="postcode"]').fill("2000");
    await page.locator('[data-step="2"] button[type="submit"]').click();
    let payload;
    await page.route("**/api/checkout", (route) => {
      payload = route.request().postDataJSON();
      return route.fulfill({
        status: 503,
        contentType: "application/json",
        body: "{}",
      });
    });
    await page.locator("#pay-button").click();
    await page.waitForFunction(() =>
      document
        .querySelector("#payment-status")
        .textContent.includes("temporarily unavailable"),
    );
    assert.equal(payload.items[0].id, "blank-hoodie");
    assert.equal("price" in payload.items[0], false);
    assert.equal(await page.locator("#pay-button").isEnabled(), true);
    checks += 3;
    await page.route("**/api/checkout", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({ url: "https://example.com/not-stripe" }),
      }),
    );
    await page.locator("#pay-button").click();
    await page.waitForFunction(() =>
      document
        .querySelector("#payment-status")
        .textContent.includes("could not be created"),
    );
    checks++;
    await page.route("https://checkout.stripe.com/**", (route) =>
      route.fulfill({
        status: 200,
        contentType: "text/html",
        body: "<h1>Mock Stripe session</h1>",
      }),
    );
    await page.route("**/api/checkout", (route) =>
      route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          url: "https://checkout.stripe.com/c/pay/mock-session",
        }),
      }),
    );
    await page.locator("#pay-button").click();
    await page.waitForURL("https://checkout.stripe.com/**");
    checks++;
    console.log(
      `PASS ${checks} assertions. No real payments or orders submitted.`,
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
