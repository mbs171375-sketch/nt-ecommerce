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

Edit **`js/store-config.js`**. Each product has a `name`, `image`, `price`, category, description, details and finishes. Put your photos in **`assets/products/`** and set each `image` to its relative path. Use square photos (ideally 1200 × 1200) with breathing room around the object. Product names and images are reused automatically throughout the collection, product pages, search, bag and checkout. All ten products appear on the home collection. The opening is a compact, image-free editorial header, followed by all ten products. The Sp5der hoodie appears lower in the collection rather than as an oversized opening feature.

All ten source prices are in AUD, including Essentials T-shirt AUD 15 and hoodie AUD 30. `audPrice` stores the exact source amount in AUD cents; `price` stores the converted USD amount rounded to cents. USD is the primary display and future checkout currency. Original AUD prices remain visible alongside it. An unpriced bag still cannot proceed to live payment. Every product has Small, Medium, Large and XL options, as requested. `imagePending` identifies illustrated placeholders; `imageReference` identifies online photos whose exact match to the stock is not yet confirmed. The `variants` field defines available size options; confirm stock counts separately before launch. Keep IDs stable so saved bags remain valid.

At the top of the configuration you can also change the brand, currency and shipping prices. The delivery form currently supports Australia; expand its fields if you intend to ship internationally. User-supplied pricing is AUD and is converted to USD for the primary display. The original AUD values remain exact on product, bag and checkout displays. Shipping retains the original sample AUD 9 fee and AUD 150 free-delivery threshold; these are converted to USD for totals using the same dated rate. Confirm delivery fees before launch.

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

The headline is **Start your reselling journey.** A compact black-and-white introduction brings the collection closer to the top of the page. There is no oversized Sp5der hero. All ten items appear on the homepage, with a five-column desktop grid and two-column mobile layout. The Sp5der item appears lower in the grid.

| Product                               | Original AUD |    Converted USD |
| ------------------------------------- | -----------: | ---------------: |
| BAPE Big Ape Head T-shirt             |        15.00 |            10.50 |
| Arc’teryx jacket                      |        70.00 |            49.01 |
| Sp5der hoodie — pink / black          |        30.00 |            21.00 |
| Neovision hoodie                      |        20.00 |            14.00 |
| Blank hoodie                          |        15.00 |            10.50 |
| The North Face puffer vest            |        25.00 |            17.50 |
| The North Face puffer jacket          |        35.00 |            24.50 |
| Ralph Lauren polo bundle — 3 T-shirts |        40.00 | 28.00 per bundle |
| Essentials hoodie                     |        30.00 |            21.00 |
| Essentials T-shirt                    |        15.00 |            10.50 |

Every listing offers Small, Medium, Large and XL, as supplied by the user. Stock quantities have not been supplied. Quantity 1 on the Ralph Lauren listing means one bundle of three T-shirts. Size selection applies to the bundle; no mixed-size composition has been specified. Its reference photo depicts one example tee, with the bundle quantity shown separately.

Source conversion: **1 AUD = 0.70009031 USD**, dated **20 October 2026**, retrieved from the public currency-api dataset via jsDelivr. `sourceToUsdRate`, `sourceExchangeRateDate` and each product's `audPrice` retain the source price list and rate. `price` is a rounded USD unit price; cart USD totals add those rounded unit prices so quantities remain arithmetically consistent. The original AUD subtotals are retained independently rather than reconstructed from rounded USD amounts. Final payment is planned in USD.

`exchangeRate` remains the reverse USD→AUD snapshot for converted amounts without an original AUD value. Shipping retains the editable sample AUD 9 fee and AUD 150 free-delivery threshold, converted to USD for checkout. Confirm actual delivery terms before launch. No live payment backend exists.

## Current product photos

Nine online reference photos are stored locally: BAPE, Sp5der, both Essentials items, AS Colour plain black hoodie, Ralph Lauren men's black tee, both North Face black puffers and Arc’teryx Beta jacket. Source URLs are recorded in `PRODUCT_PHOTOS.md` and on product pages. These are labelled reference images, not verified photos of the actual stock.

The Neovision hoodie remains the only illustration. The user’s Google link resolved to the Neovision Cosmic Widecut Hoodie Black at https://www.universalstore.com/products/neovision-cosmic-widecut-hoodie-black. Brand/model identification is complete; fetching the final product image is currently blocked by the environment egress policy for www.universalstore.com. This hostname is saved in the network draft for review. No further brand link is needed; retry the real product page after the settings apply. Do not substitute another brand’s hoodie.

The user requested YouTube design references. YouTube/Google requests are blocked by the current cloud egress policy. Access requirements have been saved in the environment draft, but no videos have been watched or claimed as watched. Current layout improvements were made directly and verified with browser tests and screenshots.

When sourcing photos, match the exact model, graphic and colour where possible. Record the source with each downloaded image and preserve its original content. Do not describe a representative image as a verified photo of the stock.
