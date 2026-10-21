(() => {
  "use strict";
  const S = window.STORE;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const formatCurrency = (n, currency) =>
    new Intl.NumberFormat(S.locale, {
      style: "currency",
      currency,
      currencyDisplay: "code",
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(n / 100);
  const money = (n) =>
    !Number.isInteger(n)
      ? "Price coming soon"
      : formatCurrency(n, S.currency) +
        " / ≈ " +
        formatCurrency(Math.round(n * S.exchangeRate), S.displayCurrency);
  const priceMarkup = (n) =>
    !Number.isInteger(n)
      ? '<span class="price-pending">Price coming soon</span>'
      : '<span class="price-pair"><span class="price-primary">' +
        formatCurrency(n, S.currency) +
        '</span><span class="price-secondary">≈ ' +
        formatCurrency(Math.round(n * S.exchangeRate), S.displayCurrency) +
        "</span></span>";
  const shippingAmount = (amount) =>
    S.shipping.currency === S.currency
      ? amount
      : Math.round(amount / S.exchangeRate);
  const shippingThreshold = shippingAmount(S.shipping.freeAbove);
  const shippingFee = shippingAmount(S.shipping.fee);
  const esc = (s) =>
    String(s).replace(
      /[&<>"']/g,
      (c) =>
        ({
          "&": "&amp;",
          "<": "&lt;",
          ">": "&gt;",
          '"': "&quot;",
          "'": "&#39;",
        })[c],
    );
  const getProduct = (id) => S.products.find((p) => p.id === id);
  let cart = [];
  try {
    const saved = JSON.parse(localStorage.getItem("forme-bag-v1") || "[]");
    if (Array.isArray(saved))
      cart = saved
        .filter(
          (x) =>
            x &&
            getProduct(x.id)?.variants.includes(x.variant) &&
            Number.isInteger(x.quantity) &&
            x.quantity > 0 &&
            x.quantity <= 99,
        )
        .slice(0, 100);
  } catch {}
  let checkoutDraft = {};
  let quantity = 1,
    variant = "",
    category =
      new URLSearchParams(location.search).get("category") || "All clothing",
    sort = "featured";
  const lineTotal = (p, quantity) =>
    Number.isInteger(p.price) ? p.price * quantity : null;
  const subtotal = () =>
    cart.some((x) => !Number.isInteger(getProduct(x.id).price))
      ? null
      : cart.reduce((n, x) => n + lineTotal(getProduct(x.id), x.quantity), 0);
  const total = () => (subtotal() === null ? null : subtotal() + shipping());
  const deliveryLabel = () =>
    shipping() === null
      ? "To be confirmed"
      : shipping() === 0
        ? "Complimentary"
        : money(shipping());
  const categories = [
    "All clothing",
    ...new Set(S.products.map((p) => p.category)),
  ];
  const shipping = () =>
    subtotal() === null
      ? null
      : subtotal() >= shippingThreshold || !cart.length
        ? 0
        : shippingFee;
  const count = () => cart.reduce((n, x) => n + x.quantity, 0);
  const arrow =
    '<span aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span>';
  let toastTimer;
  function toast(message) {
    const el = $(".toast");
    el.textContent = message;
    el.classList.add("visible");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => el.classList.remove("visible"), 2800);
  }
  function save() {
    try {
      localStorage.setItem("forme-bag-v1", JSON.stringify(cart));
    } catch {
      toast("Your browser cannot save your bag between visits.");
    }
    $$("[data-bag-count]").forEach((el) => (el.textContent = count()));
  }
  function openDialog(id) {
    const d = $(id);
    if (!d.open) d.showModal();
    document.body.classList.add("dialog-open");
  }
  function closeDialog(d) {
    d.close();
    document.body.classList.remove("dialog-open");
  }
  function card(p, index = 0) {
    return `<a class="product-card" href="product.html?id=${encodeURIComponent(p.id)}"><div class="product-image ${p.imagePending ? "" : "has-photo"}"><span class="product-index">0${index + 1} / FORME</span><img src="${esc(p.image)}" alt="${esc(p.name)} — ${p.imagePending ? "photo coming soon" : p.imageReference ? "online reference photo" : "product photo"}" loading="lazy" width="800" height="800"><span class="card-add" aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></div><div class="product-meta"><div><h3>${esc(p.name)}</h3><span>${esc(p.brand || p.category)}</span></div><span>${priceMarkup(p.price)}</span></div></a>`;
  }
  function home() {
    document.title = `${S.name} — Start your reselling journey.`;
    $("#main").innerHTML =
      `<section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="status-dot"></span> YOUR FIRST FLIP STARTS HERE</div><h1>Start your<br><span>reselling</span><br>journey.</h1><p>Start small. Build your inventory.<br>Shop hoodies, tees, outerwear and bundles<br class="desktop-break"> from the brands your buyers know.</p><a class="button button-light" href="#collection">Shop all clothing ${arrow}</a><div class="hero-footnote"><span class="small-mark"><svg class="sparkle-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 2v28M2 16h28M6 6l20 20M6 26 26 6"/></svg></span><span>Big names. Everyday favourites.<br>One place for your next pick.</span></div></div><div class="hero-visual ${S.products[0].imagePending ? "" : "has-photo"}"><div class="hero-orbit"></div><span class="vertical-note">START YOUR RESELLING JOURNEY.</span><img src="${esc(S.products[0].image)}" alt="${esc(S.products[0].name)}" width="800" height="800" fetchpriority="high"><a class="hero-product" href="product.html?id=${encodeURIComponent(S.products[0].id)}"><span><small>IN THE LINE-UP</small>${esc(S.products[0].name)} <span class="muted">/ ${priceMarkup(S.products[0].price)}</span></span><span class="round-arrow"><svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></a><span class="hero-edition">01 — ${String(S.products.length).padStart(2, "0")}</span></div></section>
 <div class="value-strip"><span>Considered, not complicated</span><span><svg class="sparkle-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 2v28M2 16h28M6 6l20 20M6 26 26 6"/></svg></span><span>Good design. Everyday purpose.</span><span><svg class="sparkle-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 2v28M2 16h28M6 6l20 20M6 26 26 6"/></svg></span><span>Fewer things. Better things.</span><span><svg class="sparkle-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 2v28M2 16h28M6 6l20 20M6 26 26 6"/></svg></span><span>Considered, not complicated</span></div>
 <section class="collection section-wrap" id="collection"><div class="section-heading"><div><span class="eyebrow">YOUR EVERYDAY, ELEVATED</span><h2>Meet your new essentials<span class="serif">.</span></h2></div><a class="text-link" href="products.html">Shop all clothing ${arrow}</a></div><div class="filter-row" aria-label="Filter collection">${filters()}</div><div class="product-grid" id="home-grid">${S.products
   .filter((p) => category === "All clothing" || p.category === category)

   .map(card)
   .join("")}</div></section>
 <section class="philosophy section-wrap" id="philosophy"><div class="philosophy-art"><div class="art-grid"></div><img src="${esc(S.products[1].image)}" alt="${esc(S.products[1].name)}" loading="lazy" width="800" height="800"><span>THE EVERYDAY LINE-UP.</span></div><div class="philosophy-copy"><span class="eyebrow">THE BRANDS. THE BASICS. THE ROTATION.</span><h2>Big names.<br><span class="serif">Easy choices.</span></h2><p>From statement hoodies to everyday tees, explore a clothing line-up built around the brands you know and the basics you reach for.</p><p>Sp5der, BAPE, Neovision, Ralph Lauren, The North Face and Essentials. Browse the range, choose your quantity, and keep your favourites together in one bag.</p><a class="text-link" href="products.html">Find your next fit ${arrow}</a><div class="philosophy-sign">FORME<span>®</span><small>GOOD THINGS. LESS NOISE.</small></div></div></section>
 <section class="service-grid section-wrap"><div><span>01 /</span><h3>The clothing line-up</h3><p>Hoodies, tees and outerwear.<br>Plus polos by the bundle.</p></div><div><span>02 /</span><h3>A simpler experience</h3><p>Find your favourite. Choose your amount.<br>Make room for something good.</p></div><div><span>03 /</span><h3>Built around your rotation</h3><p>Big-name pieces and blank basics.<br>Find the ones that work for you.</p></div></section>`;
    bindFilters(true);
  }
  function filters() {
    return categories
      .map(
        (c) =>
          `<button class="filter ${category === c ? "active" : ""}" data-category="${c}" aria-pressed="${category === c}">${c}${c === "All clothing" ? ` <small>${S.products.length}</small>` : ""}</button>`,
      )
      .join("");
  }
  function bindFilters(isHome = false) {
    $$("[data-category]").forEach((btn) =>
      btn.addEventListener("click", () => {
        category = btn.dataset.category;
        $$("[data-category]").forEach((b) => {
          b.classList.toggle("active", b === btn);
          b.setAttribute("aria-pressed", b === btn);
        });
        if (isHome)
          $("#home-grid").innerHTML = S.products
            .filter(
              (p) => category === "All clothing" || p.category === category,
            )

            .map(card)
            .join("");
        else {
          const url = new URL(location.href);
          if (category === "All clothing") url.searchParams.delete("category");
          else url.searchParams.set("category", category);
          history.replaceState(null, "", url);
          renderCatalog();
        }
      }),
    );
  }
  function catalog() {
    if (!categories.includes(category)) category = "All clothing";
    document.title = "The collection — " + S.name;
    $("#main").innerHTML =
      `<section class="catalog section-wrap"><div class="breadcrumbs"><a href="index.html">Home</a><span>/</span>The collection</div><div class="catalog-heading"><span class="eyebrow">GOOD THINGS. LESS NOISE.</span><h1>The collection<span class="serif">.</span></h1><p>Hoodies, tees, outerwear and polo bundles. Build your next drop.</p></div><div class="catalog-controls"><div class="filter-row">${filters()}</div><label class="sort-label">Sort by <select id="sort"><option value="featured">Featured</option><option value="name">Name: A to Z</option><option value="low" ${S.products.some((p) => Number.isInteger(p.price)) ? "" : "disabled"}>Price: low to high</option><option value="high" ${S.products.some((p) => Number.isInteger(p.price)) ? "" : "disabled"}>Price: high to low</option></select></label></div><p class="result-count" id="result-count"></p><div class="product-grid catalog-grid" id="catalog-grid"></div></section>`;
    bindFilters();
    $("#sort").addEventListener("change", (e) => {
      sort = e.target.value;
      renderCatalog();
    });
    renderCatalog();
  }
  function renderCatalog() {
    let products = S.products.filter(
      (p) => category === "All clothing" || p.category === category,
    );
    if (sort !== "featured")
      products.sort((a, b) =>
        sort === "name"
          ? a.name.localeCompare(b.name)
          : !Number.isInteger(a.price)
            ? Number.isInteger(b.price)
              ? 1
              : 0
            : !Number.isInteger(b.price)
              ? -1
              : sort === "low"
                ? a.price - b.price
                : b.price - a.price,
      );
    $("#catalog-grid").innerHTML = products.map(card).join("");
    $("#result-count").textContent = `${products.length} clothing styles`;
  }
  function productPage() {
    const id =
        new URLSearchParams(location.search).get("id") || S.products[0].id,
      p = getProduct(id);
    if (!p) {
      $("#main").innerHTML =
        '<section class="empty-page"><span class="eyebrow">A SMALL DETOUR</span><h1>Product not found.</h1><a class="button button-light" href="products.html">Back to the collection <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></a></section>';
      return;
    }
    document.title = `${p.name} — ${S.name}`;
    variant = p.variants[0];
    $("#main").innerHTML =
      `<section class="product-page section-wrap"><div class="breadcrumbs"><a href="index.html">Home</a><span>/</span><a href="products.html">The collection</a><span>/</span>${esc(p.name)}</div><div class="product-layout"><div class="detail-image ${p.imagePending ? "" : "has-photo"}"><span class="eyebrow">FORME / ${esc(p.category).toUpperCase()}</span><img src="${esc(p.image)}" alt="${esc(p.name)}" width="800" height="800"><span class="image-note">${p.imagePending ? "ILLUSTRATION ONLY · PHOTO COMING SOON" : p.imageReference ? "ONLINE REFERENCE PHOTO · STYLE TO BE CONFIRMED" : "THE CLOTHING DROP"}</span></div><div class="detail-copy"><span class="eyebrow">${esc(p.label)}</span><h1>${esc(p.name)}</h1><div class="detail-price">${priceMarkup(p.price)} </div><p class="detail-description">${esc(p.description)}</p>${p.imageReference ? `<p class="reference-note">Online reference image. Exact stock style and colour will be confirmed. <a href="${esc(p.imageSource)}" target="_blank" rel="noopener noreferrer">Photo source</a></p>` : ""}<fieldset class="variant-options"><legend>${esc(p.optionLabel || "Finish")} <span id="selected-variant">${esc(variant)}</span></legend>${p.variants.map((v, i) => `<label class="variant size-option"><input type="radio" name="variant" value="${esc(v)}" ${!i ? "checked" : ""}><span class="size-chip">${esc(v)}</span></label>`).join("")}</fieldset><div class="quantity-label"><label for="product-quantity">${p.unitsPerBundle ? "How many bundles?" : "How many?"}</label><small>${p.unitsPerBundle ? p.unitsPerBundle + " T-shirts per bundle" : "Make it yours."}</small></div><div class="purchase-row"><div class="quantity-control"><button id="quantity-minus" aria-label="Decrease quantity">−</button><input id="product-quantity" aria-label="Quantity" type="number" min="1" max="99" value="1" inputmode="numeric"><button id="quantity-plus" aria-label="Increase quantity">+</button></div><button class="button button-light" id="add-bag">Add to bag <span id="add-total">${priceMarkup(p.price)}</span> +</button></div><button class="button button-outline full" id="buy-now">Buy now ${arrow}</button><p class="shipping-note">${arrow} Exact style and stock quantities confirmed before orders open.</p><details open><summary>The details <span>+</span></summary><ul>${p.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></details><details><summary>Delivery & returns <span>+</span></summary><p>Delivery within ${esc(S.shipping.country)} is ${priceMarkup(shippingFee)}, or free from ${priceMarkup(shippingThreshold)}. This preview does not accept orders. Final delivery times and returns terms will be confirmed before launch.</p></details></div></div></section><section class="section-wrap related"><div class="section-heading"><div><span class="eyebrow">GOOD COMPANY</span><h2>Better together.</h2></div><a href="products.html" class="text-link">Explore all ${arrow}</a></div><div class="product-grid">${S.products
        .filter((x) => x.id !== id)
        .slice(0, 3)
        .map(card)
        .join("")}</div></section>`;
    const input = $("#product-quantity");
    const sync = () => {
      quantity = Math.max(
        1,
        Math.min(99, Math.floor(Number(input.value) || 1)),
      );
      input.value = quantity;
      $("#add-total").innerHTML = priceMarkup(lineTotal(p, quantity));
      $("#quantity-minus").disabled = quantity === 1;
      $("#quantity-plus").disabled = quantity === 99;
    };
    $("#quantity-minus").onclick = () => {
      input.value = quantity - 1;
      sync();
    };
    $("#quantity-plus").onclick = () => {
      input.value = quantity + 1;
      sync();
    };
    input.onchange = sync;
    sync();
    $$('[name="variant"]').forEach(
      (i) =>
        (i.onchange = () => {
          variant = i.value;
          $("#selected-variant").textContent = variant;
        }),
    );
    const add = () => {
      sync();
      const existing = cart.find((x) => x.id === p.id && x.variant === variant);
      if (existing) {
        if (existing.quantity + quantity > 99) {
          toast("You can add up to 99 of each size.");
          return false;
        }
        existing.quantity += quantity;
      } else cart.push({ id: p.id, variant, quantity });
      save();
      return true;
    };
    $("#add-bag").onclick = () => {
      if (add()) {
        renderBag();
        openDialog("#bag-dialog");
      }
    };
    $("#buy-now").onclick = () => {
      if (add()) location.href = "checkout.html";
    };
  }
  function renderBag() {
    const root = $("#bag-content");
    if (!cart.length) {
      root.innerHTML = `<div class="empty-bag"><span class="empty-symbol"><svg class="sparkle-icon" viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M16 2v28M2 16h28M6 6l20 20M6 26 26 6"/></svg></span><h3>A little room for<br>something good.</h3><p>Your bag is waiting for its first favourite.</p><a class="button button-light" href="products.html">Explore the collection ${arrow}</a></div>`;
      return;
    }
    root.innerHTML = `<div class="bag-progress"><p>${subtotal() === null ? "Pricing and delivery will be confirmed before orders open." : subtotal() >= shippingThreshold ? "Your delivery is on us." : `${priceMarkup(shippingThreshold - subtotal())} away from complimentary delivery.`}</p><div><span style="width:${subtotal() === null ? 0 : Math.min(100, (subtotal() / shippingThreshold) * 100)}%"></span></div></div><div class="bag-items">${cart
      .map((x, i) => {
        const p = getProduct(x.id);
        return `<article class="bag-item"><a href="product.html?id=${p.id}"><img src="${esc(p.image)}" alt="${esc(p.name)}" width="100" height="100"></a><div><a href="product.html?id=${p.id}">${esc(p.name)}</a><small>${esc(x.variant)}</small><div class="bag-quantity"><button data-adjust="${i}" data-delta="-1" aria-label="Decrease ${esc(p.name)} quantity" ${x.quantity === 1 ? "disabled" : ""}>−</button><span>${x.quantity}</span><button data-adjust="${i}" data-delta="1" aria-label="Increase ${esc(p.name)} quantity" ${x.quantity === 99 ? "disabled" : ""}>+</button></div></div><div class="bag-item-right"><span>${priceMarkup(lineTotal(p, x.quantity))}</span><button data-remove="${i}">Remove</button></div></article>`;
      })
      .join(
        "",
      )}</div><div class="bag-summary"><div><span>Subtotal</span><strong>${priceMarkup(subtotal())}</strong></div><p>Delivery calculated at checkout. USD prices; AUD values are estimates.</p><a class="button button-light full" href="checkout.html">Continue to checkout ${arrow}</a><button class="continue-shopping" data-continue>Keep exploring</button></div>`;
    $$("[data-adjust]", root).forEach(
      (btn) =>
        (btn.onclick = () => {
          const x = cart[Number(btn.dataset.adjust)];
          x.quantity = Math.min(
            99,
            Math.max(1, x.quantity + Number(btn.dataset.delta)),
          );
          save();
          renderBag();
        }),
    );
    $$("[data-remove]", root).forEach(
      (btn) =>
        (btn.onclick = () => {
          cart.splice(Number(btn.dataset.remove), 1);
          save();
          renderBag();
        }),
    );
    $("[data-continue]", root).onclick = () => closeDialog($("#bag-dialog"));
  }
  function checkout() {
    document.title = "Checkout — " + S.name;
    if (!cart.length) {
      $("#main").innerHTML =
        `<section class="empty-page"><span class="eyebrow">YOUR NEXT FAVOURITE IS WAITING</span><h1>Your bag is empty.</h1><p>Choose something good before heading to checkout.</p><a href="products.html" class="button button-light">Explore the collection ${arrow}</a></section>`;
      return;
    }
    $("#main").innerHTML =
      `<section class="checkout section-wrap"><div class="breadcrumbs"><a href="products.html">The collection</a><span>/</span>Checkout</div><div class="checkout-heading"><span class="eyebrow">A FEW SIMPLE STEPS</span><h1>Make it yours<span class="serif">.</span></h1></div><div class="checkout-layout"><div><ol class="checkout-steps"><li class="current" data-step-label="1"><span>01</span>Details</li><li data-step-label="2"><span>02</span>Delivery</li><li data-step-label="3"><span>03</span>Payment</li></ol><div class="preview-note">Store preview · Orders and payments are not live yet.</div><form id="checkout-form"><section data-step="1"><h2>Your details</h2><p class="muted">Just the essentials. No account needed.</p><div class="field-grid"><label>First name<input name="firstName" autocomplete="given-name" required maxlength="80"></label><label>Last name<input name="lastName" autocomplete="family-name" required maxlength="80"></label><label class="full-field">Email address<input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@example.com"></label></div><button class="button button-light full" type="submit">Continue to delivery ${arrow}</button></section><section data-step="2" hidden><h2>Where to?</h2><p class="muted">A place for your next favourite.</p><div class="field-grid"><label class="full-field">Street address<input name="address" autocomplete="address-line1" required maxlength="200"></label><label class="full-field">Apartment, suite, etc. <span class="muted">(optional)</span><input name="apartment" autocomplete="address-line2" maxlength="100"></label><label>Suburb / city<input name="city" autocomplete="address-level2" required maxlength="100"></label><label>State / territory<select name="state" autocomplete="address-level1" required><option value="">Select state</option>${["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"].map((x) => `<option>${x}</option>`).join("")}</select></label><label>Postcode<input name="postcode" autocomplete="postal-code" required inputmode="numeric" pattern="[0-9]{4}" maxlength="4" title="Enter a four-digit Australian postcode"></label><label>Country<input name="country" value="${esc(S.shipping.country)}" readonly autocomplete="country-name"></label></div><div class="delivery-choice"><div><strong>Standard delivery</strong><small>Delivery timing confirmed when orders open.</small></div><strong>${deliveryLabel()}</strong></div><button class="button button-light full" type="submit">Continue to payment ${arrow}</button><button class="back-step" type="button" data-back="1">← Back to details</button></section><section data-step="3" hidden><h2>The final little step.</h2><p class="muted">Review your details before payment.</p><div id="delivery-review" class="delivery-review"></div><div class="payment-placeholder"><span class="payment-icon"><svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span><h3>Good things are on their way.</h3><p>Online payments will be available soon. Your bag is saved, and no order has been placed.</p><p>When payments open, you’ll complete your purchase securely through Stripe.</p></div><button type="button" class="button button-light full" id="pay-button" ${S.checkoutEndpoint && subtotal() !== null ? "" : "disabled"}>${S.checkoutEndpoint && subtotal() !== null ? `Continue to secure payment ${arrow}` : "Payments opening soon"}</button><p id="payment-status" role="status" class="payment-status"></p><button class="back-step" type="button" data-back="2">← Edit delivery details</button></section></form></div><aside class="order-summary"><div class="summary-heading"><h2>In good company.</h2><button type="button" id="edit-bag">Edit bag <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button></div><div id="checkout-items">${cart
        .map((x) => {
          const p = getProduct(x.id);
          return `<div class="summary-item"><img src="${esc(p.image)}" alt="${esc(p.name)}" width="80" height="80"><div><strong>${esc(p.name)}</strong><small>${esc(x.variant)} · Qty ${x.quantity}</small></div><span>${priceMarkup(lineTotal(p, x.quantity))}</span></div>`;
        })
        .join(
          "",
        )}</div><div class="summary-costs"><div><span>Subtotal</span><span>${priceMarkup(subtotal())}</span></div><div><span>Delivery</span><span>${deliveryLabel()}</span></div><div class="total"><strong>Total</strong><strong><small>${S.currency}</small> ${priceMarkup(total())}</strong></div></div><p class="summary-note">A considered collection. A simpler experience.</p></aside></div></section>`;
    let step = 1;
    const form = $("#checkout-form");
    Object.entries(checkoutDraft).forEach(([name, value]) => {
      if (form.elements.namedItem(name))
        form.elements.namedItem(name).value = value;
    });
    function showStep(next, shouldScroll = true) {
      step = next;
      $$("[data-step]").forEach((el) => {
        el.hidden = Number(el.dataset.step) !== step;
        $$("input,select", el).forEach((i) => (i.disabled = el.hidden));
      });
      $$("[data-step-label]").forEach((el) => {
        el.classList.toggle("current", Number(el.dataset.stepLabel) === step);
        el.classList.toggle("completed", Number(el.dataset.stepLabel) < step);
      });
      const heading = $(`[data-step="${step}"] h2`);
      heading.tabIndex = -1;
      heading.focus({ preventScroll: true });
      if (shouldScroll)
        heading.scrollIntoView({
          block: "start",
          behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
            ? "instant"
            : "smooth",
        });
      if (step === 3) {
        const data = Object.fromEntries(
          [...form.elements]
            .filter((e) => e.name)
            .map((e) => [e.name, e.value]),
        );
        $("#delivery-review").innerHTML =
          `<span class="eyebrow">DELIVERING TO</span><p>${esc(data.firstName)} ${esc(data.lastName)}<br>${esc(data.email)}<br>${esc(data.address)}${data.apartment ? `, ${esc(data.apartment)}` : ""}<br>${esc(data.city)}, ${esc(data.state)} ${esc(data.postcode)}<br>${esc(data.country)}</p><button type="button" data-edit-contact>Edit details <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button>`;
        $("[data-edit-contact]").onclick = () => showStep(1);
      }
    }
    form.onsubmit = (e) => {
      e.preventDefault();
      $$("input:not([readonly])", form).forEach((i) => {
        i.value = i.value.trim();
      });
      if (form.reportValidity() && step < 3) showStep(step + 1);
    };
    $$("[data-back]").forEach(
      (b) => (b.onclick = () => showStep(Number(b.dataset.back))),
    );
    showStep(1, false);
    $("#edit-bag").onclick = () => {
      renderBag();
      openDialog("#bag-dialog");
    };
    const bagAtRender = JSON.stringify(cart);
    $("#bag-dialog").onclose = () => {
      document.body.classList.remove("dialog-open");
      if (
        location.pathname.endsWith("checkout.html") &&
        JSON.stringify(cart) !== bagAtRender
      ) {
        checkoutDraft = Object.fromEntries(
          [...form.elements]
            .filter((e) => e.name)
            .map((e) => [e.name, e.value]),
        );
        checkout();
      }
    };
    $("#pay-button").onclick = async () => {
      if (!S.checkoutEndpoint || subtotal() === null) return;
      const button = $("#pay-button");
      button.disabled = true;
      $("#payment-status").textContent = "Opening secure checkout…";
      try {
        const endpoint = new URL(S.checkoutEndpoint, location.origin);
        if (endpoint.origin !== location.origin)
          throw Error("Checkout endpoint must be on this store’s server.");
        const customer = Object.fromEntries(
          [...form.elements]
            .filter((e) => e.name)
            .map((e) => [e.name, e.value]),
        );
        const response = await fetch(endpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cart.map((x) => ({
              id: x.id,
              variant: x.variant,
              quantity: x.quantity,
            })),
            customer,
          }),
        });
        if (!response.ok)
          throw Error("Checkout is temporarily unavailable. Please try again.");
        const data = await response.json();
        const redirect = new URL(data.url);
        if (
          redirect.protocol !== "https:" ||
          redirect.hostname !== "checkout.stripe.com"
        )
          throw Error("A secure payment session could not be created.");
        location.assign(redirect.href);
      } catch (e) {
        $("#payment-status").textContent = e.message;
        button.disabled = false;
      }
    };
  }
  const info = {
    delivery: [
      "Delivery & returns",
      `<p>Standard delivery within ${esc(S.shipping.country)} is ${priceMarkup(shippingFee)}. Delivery is complimentary on orders of ${priceMarkup(shippingThreshold)} or more.</p><p>This store is currently a preview. Orders are not being accepted. Delivery estimates, returns terms and support details will be published before launch.</p>`,
    ],
    help: [
      "A little more clarity.",
      "<p>Explore a product to choose its size and quantity, then add it to your bag or go straight to checkout.</p><p>Payments are not live yet. No order is placed in this preview. Customer support details will be added before the store opens.</p>",
    ],
    privacy: [
      "Your privacy, considered.",
      "<p>Your bag is stored in this browser so it is there when you return. We do not store checkout contact or address details in browser storage.</p><p>While payments are disabled, checkout details stay in this page and are not submitted. If you clear your browser storage, your bag will be removed.</p><p>A complete privacy policy will be available before the store opens.</p>",
    ],
  };
  $$("[data-info]").forEach(
    (b) =>
      (b.onclick = () => {
        const [title, body] = info[b.dataset.info];
        $("#info-title").textContent = title;
        $("#info-body").innerHTML = body;
        openDialog("#info-dialog");
      }),
  );
  $$("[data-bag]").forEach(
    (b) =>
      (b.onclick = () => {
        renderBag();
        openDialog("#bag-dialog");
      }),
  );
  $$("[data-close]").forEach(
    (b) => (b.onclick = () => closeDialog(b.closest("dialog"))),
  );
  $$("dialog").forEach((d) => {
    d.addEventListener("click", (e) => {
      if (e.target === d) {
        const r = d.getBoundingClientRect();
        if (
          e.clientX < r.left ||
          e.clientX > r.right ||
          e.clientY < r.top ||
          e.clientY > r.bottom
        )
          closeDialog(d);
      }
    });
    d.addEventListener("close", () =>
      document.body.classList.remove("dialog-open"),
    );
  });
  function search() {
    const term = $("#search-input").value.trim().toLowerCase();
    const matches = S.products.filter((p) =>
      `${p.name} ${p.category}`.toLowerCase().includes(term),
    );
    $("#search-results").innerHTML = matches.length
      ? matches
          .map(
            (p) =>
              `<a class="search-result" href="product.html?id=${p.id}"><img src="${esc(p.image)}" alt="" width="72" height="72"><span>${esc(p.name)}<small>${esc(p.category)}</small></span><span>${priceMarkup(p.price)} <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></a>`,
          )
          .join("")
      : '<p class="search-empty">No objects found. Try a different word.</p>';
  }
  $("[data-search]").onclick = () => {
    search();
    openDialog("#search-dialog");
    $("#search-input").focus();
  };
  $("#search-input").oninput = search;
  $$(".wordmark").forEach((el) => {
    el.innerHTML = esc(S.name) + "<span>®</span>";
    if (el.hasAttribute("aria-label"))
      el.setAttribute("aria-label", S.name + " home");
  });
  const currencyNote = document.createElement("p");
  currencyNote.className = "currency-note";
  currencyNote.textContent =
    "Prices in USD. AUD equivalents are estimates at 1 USD = " +
    S.exchangeRate.toFixed(4) +
    " AUD (rate dated " +
    S.exchangeRateDate +
    "). Final payment will be in USD.";
  $(".footer-bottom").before(currencyNote);
  $("[data-year]").textContent = new Date().getFullYear();
  save();
  const page = location.pathname.split("/").pop();
  if (page === "products.html") catalog();
  else if (page === "product.html") productPage();
  else if (page === "checkout.html") checkout();
  else home();
})();
