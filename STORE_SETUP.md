# FORME storefront

A responsive, black storefront built with plain HTML, CSS and JavaScript. No build step, subscription, external CDN or frontend framework is required.

## Run it

From the repository root:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

The entry point is `index.html`. The collection, product details and checkout are `products.html`, `product.html?id=h01`, and `checkout.html`. Use any static host for the storefront; a server-side checkout endpoint is required when accepting payments.

## Your product information

Edit **`js/store-config.js`**. Each product has a `name`, `image`, `price`, category, description, details and finishes. Put your photos in **`assets/products/`** and set each `image` to its relative path. Use square photos (ideally 1200 × 1200) with breathing room around the object. Product names and images are reused automatically throughout the collection, product pages, search, bag and checkout. The first product is featured in the hero; the second illustrates the approach section.

Prices are integer cents: `18900` means AUD $189.00. The six products, descriptions and prices are samples. Change them to match your actual inventory before launch. Keep existing product IDs stable so saved bags remain valid. Add or remove product entries as needed, keeping at least two for the home layout. Finish names describe the selection; upload accurate images of your real products before selling.

At the top of the configuration you can also change the brand, currency and shipping prices. The delivery form currently supports Australia; expand its fields if you intend to ship internationally. The store uses AUD, a $9 delivery fee and complimentary delivery from $150 as editable defaults.

## What already works

- Responsive homepage, category filters, full collection and price sorting.
- Product search, deep links and invalid-product handling.
- Finish selection and quantities from 1 to 99.
- Persistent bag, quantity editing, removal, totals and delivery calculation.
- Buy now shortcut, with existing bag items retained.
- Guest checkout: validated contact information → delivery → payment.
- Editable checkout details and an order summary.
- Keyboard-accessible dialogs, focus states and reduced-motion support.

The bag is saved in localStorage. Contact and address information stay in page memory while payments are disabled; they are not stored in localStorage or sent to an external demo service. Reloading the page clears those details. No analytics, tracking, newsletter signup or account creation is included.

## Connect Stripe later

Payments are deliberately disabled in this preview. There are no pretend card fields, successful-order screens, or real order submissions. A clear message appears at the final step.

A frontend integration point is prepared: `checkoutEndpoint` in `js/store-config.js`. Set it to a same-origin route such as `/api/checkout` **only after** implementing and testing the backend. No Stripe keys belong in browser files.

The frontend sends a JSON POST:

```json
{
  "items": [{ "id": "h01", "variant": "Graphite", "quantity": 2 }],
  "customer": {
    "firstName": "…",
    "lastName": "…",
    "email": "…",
    "address": "…",
    "apartment": "…",
    "city": "…",
    "state": "NSW",
    "postcode": "2000",
    "country": "Australia"
  }
}
```

The endpoint must validate the request, load authoritative products/prices/stock on the server, validate allowed finishes and quantities, calculate shipping/tax and create a Stripe Checkout Session. Never trust browser pricing. Return `{ "url": "https://checkout.stripe.com/…" }`. The frontend validates the redirect destination and displays recoverable errors. Store Stripe secret and webhook signing keys securely on the server.

The Stripe work also includes a success/cancellation return flow, verified payment webhooks, durable orders, idempotency, inventory checks and fulfilment/receipt handling. A redirect alone must never mark an order as paid. Test these with Stripe test mode before accepting payments.

Once payments are implemented, replace preview messages and publish accurate delivery/returns terms, privacy policy and support details. Confirm the sample prices, shipping, currency, taxes and product claims. These are business settings that need your actual values, rather than assumptions made by the template.

## Checks

With the static server running, in the prepared Codex environment:

```sh
node --check js/store.js
node --check js/store-config.js
node scripts/smoke-test.cjs
```

The browser smoke test requires Playwright and Chromium (already present in this environment). Override `STORE_TEST_URL` or `CHROMIUM_PATH` for another environment. It exercises desktop and mobile layouts, filtering, sorting, searching, product selection, saved bags, checkout validation, privacy, empty states and a mocked future Stripe endpoint. It never submits an actual order or payment.

The original Sass and legacy styles remain in the repository but are not used by the new storefront. Edit `css/store.css` for the current design.
