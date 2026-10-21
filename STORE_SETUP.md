# FORME storefront

A responsive, black storefront built with plain HTML, CSS and JavaScript. No build step, subscription, external CDN or frontend framework is required.

## Run it

From the repository root:

```sh
python3 -m http.server 8000 --bind 0.0.0.0
```

The entry point is `index.html`. The collection, product details and checkout are `products.html`, `product.html?id=sp5der-hoodie`, and `checkout.html`. Use any static host for the storefront; a server-side checkout endpoint is required when accepting payments.

## Public hosting

GitHub Pages is configured to publish the `main` branch from the repository root.
The deployment address is https://mbs171375-sketch.github.io/nt-ecommerce/.
Updates pushed to `main` trigger deployment; allow the Pages build to complete before checking the public site.
The `.nojekyll` file keeps the storefront as static files without a Jekyll build.

## Your product information

Edit **`js/store-config.js`**. Each product has a `name`, `image`, `price`, category, description, details and finishes. Put your photos in **`assets/products/`** and set each `image` to its relative path. Use square photos (ideally 1200 × 1200) with breathing room around the object. Product names and images are reused automatically throughout the collection, product pages, search, bag and checkout. All ten products appear on the home collection. The first product is featured in the hero; the second illustrates the approach section.

Prices are integer **USD cents**: `1500` means USD 15.00. Eight prices have been supplied. The Essentials hoodie and T-shirt remain `null` and display “Price coming soon”; an unpriced bag cannot proceed to live payment. Every product has Small, Medium, Large and XL options, as requested. `imagePending` identifies illustrated placeholders; `imageReference` identifies online photos whose exact match to the stock is not yet confirmed. The `variants` field defines available size options; confirm stock counts separately before launch. Keep IDs stable so saved bags remain valid.

At the top of the configuration you can also change the brand, currency and shipping prices. The delivery form currently supports Australia; expand its fields if you intend to ship internationally. Product pricing is USD, with approximate AUD values shown alongside it. Shipping retains the original sample AUD 9 fee and AUD 150 free-delivery threshold; these are converted to USD for totals using the same dated rate. Confirm delivery fees before launch.

## What already works

- Responsive homepage, category filters, full collection and price sorting.
- Product search, deep links and invalid-product handling.
- Size selection and quantities from 1 to 99.
- Persistent bag, quantity editing, removal, totals and delivery calculation.
- Buy now shortcut, with existing bag items retained.
- Guest checkout: validated contact information → delivery → payment.
- USD prices plus clearly labelled AUD estimates on cards, product details, search, bag and checkout.
- All ten products displayed on the homepage, with Small, Medium, Large and XL options.
- Editable checkout details and an order summary.
- Keyboard-accessible dialogs, focus states and reduced-motion support.

The bag is saved in localStorage. Contact and address information stay in page memory while payments are disabled; they are not stored in localStorage or sent to an external demo service. Reloading the page clears those details. No analytics, tracking, newsletter signup or account creation is included.

## Connect Stripe later

Payments are deliberately disabled in this preview. There are no pretend card fields, successful-order screens, or real order submissions. A clear message appears at the final step.

A frontend integration point is prepared: `checkoutEndpoint` in `js/store-config.js`. Set it to a same-origin route such as `/api/checkout` **only after** implementing and testing the backend. No Stripe keys belong in browser files.

The frontend sends a JSON POST:

```json
{
  "items": [{ "id": "sp5der-hoodie", "variant": "M", "quantity": 2 }],
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

## Current catalogue and pricing

The homepage headline is **Start your reselling journey.** The storefront uses black, white and neutral greys, with no green accents. All ten products appear on the homepage.

| Product                               |     USD price |
| ------------------------------------- | ------------: |
| BAPE Big Ape Head T-shirt             |            15 |
| Arc’teryx jacket                      |            70 |
| Sp5der hoodie — pink / black          |            30 |
| Neovision hoodie                      |            20 |
| Blank hoodie                          |            15 |
| The North Face puffer vest            |            25 |
| The North Face puffer jacket          |            35 |
| Ralph Lauren polo bundle — 3 T-shirts | 40 per bundle |
| Essentials hoodie                     |  Not supplied |
| Essentials T-shirt                    |  Not supplied |

Quantity 1 on the Ralph Lauren listing means one bundle of three T-shirts. Size selection applies to the bundle. No mixed-size composition has been specified.

The USD→AUD conversion snapshot is **1 USD = 1.42838714 AUD**, dated **20 October 2026**, retrieved from the public currency-api dataset via jsDelivr. `exchangeRate`, `exchangeRateDate` and `exchangeRateSource` in the configuration store the snapshot. This is an indicative display conversion, not a live quote; calculations and future checkout sessions use USD. Changing the snapshot updates displayed estimates without altering the supplied USD prices.

## Current product photos

Four official online reference photos are stored locally: BAPE Big Ape Head tee, Sp5der pink/black Legacy hoodie, Essentials black hoodie and Essentials black tee. Source URLs are recorded in `PRODUCT_PHOTOS.md` and on each product. These are labelled online reference images, not verified photos of the user's actual inventory.

The other six items retain labelled illustrations. Exact Neovision branding/model and the other stock styles/colours remain unconfirmed. Some additional official image hosts are blocked by cloud network policy; the required domain additions are saved in the environment draft for review. Do not claim photos have been sourced or matched until downloaded and inspected.

When sourcing photos, prefer clear front-on product images on a neutral background and match the exact model, graphic and colour. Record the source URL with each downloaded image. Do not substitute an arbitrary garment from the same brand as a confirmed stock photo.
