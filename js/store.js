(() => {
  "use strict";
  const S = window.STORE;
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const money = (n) =>
    new Intl.NumberFormat(S.locale, {
      style: "currency",
      currency: S.currency,
      maximumFractionDigits: 2,
    }).format(n / 100);
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
      new URLSearchParams(location.search).get("category") || "All objects",
    sort = "featured";
  const subtotal = () =>
    cart.reduce((n, x) => n + getProduct(x.id).price * x.quantity, 0);
  const shipping = () =>
    subtotal() >= S.shipping.freeAbove || !cart.length ? 0 : S.shipping.fee;
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
    return `<a class="product-card" href="product.html?id=${encodeURIComponent(p.id)}"><div class="product-image"><span class="product-index">0${index + 1} / FORME</span><img src="${esc(p.image)}" alt="${esc(p.name)} in Graphite" loading="lazy" width="800" height="800"><span class="card-add" aria-hidden="true"><svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></div><div class="product-meta"><div><h3>${esc(p.name)}</h3><span>${esc(p.category)} essentials</span></div><span>${money(p.price)}</span></div></a>`;
  }
  function home() {
    document.title = `${S.name} — Less, but better.`;
    $("#main").innerHTML =
      `<section class="hero"><div class="hero-copy"><div class="eyebrow"><span class="status-dot"></span> The considered collection — 001</div><h1>Less, but<br><span>better.</span></h1><p>Objects with purpose. Design with feeling.<br>Discover the things that make everyday<br class="desktop-break"> a little more extraordinary.</p><a class="button button-light" href="products.html">Explore the collection ${arrow}</a><div class="hero-footnote"><span class="small-mark">✳</span><span>Thoughtfully selected.<br>Made for your everyday.</span></div></div><div class="hero-visual"><div class="hero-orbit"></div><span class="vertical-note">ESSENTIALS, RECONSIDERED.</span><img src="${esc(S.products[0].image)}" alt="${esc(S.products[0].name)}" width="800" height="800" fetchpriority="high"><a class="hero-product" href="product.html?id=${encodeURIComponent(S.products[0].id)}"><span><small>THE ART OF TUNING OUT</small>${esc(S.products[0].name)} <span class="muted">/ ${money(S.products[0].price)}</span></span><span class="round-arrow"><svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></a><span class="hero-edition">01 — 06</span></div></section>
 <div class="value-strip"><span>Considered, not complicated</span><span>✳</span><span>Good design. Everyday purpose.</span><span>✳</span><span>Fewer things. Better things.</span><span>✳</span><span>Considered, not complicated</span></div>
 <section class="collection section-wrap" id="collection"><div class="section-heading"><div><span class="eyebrow">YOUR EVERYDAY, ELEVATED</span><h2>Meet your new essentials<span class="serif">.</span></h2></div><a class="text-link" href="products.html">Shop all objects ${arrow}</a></div><div class="filter-row" aria-label="Filter collection">${filters()}</div><div class="product-grid" id="home-grid">${S.products
   .filter((p) => category === "All objects" || p.category === category)
   .slice(0, 4)
   .map(card)
   .join("")}</div></section>
 <section class="philosophy section-wrap" id="philosophy"><div class="philosophy-art"><div class="art-grid"></div><img src="${esc(S.products[1].image)}" alt="${esc(S.products[1].name)}" loading="lazy" width="800" height="800"><span>THE BEAUTY OF ENOUGH.</span></div><div class="philosophy-copy"><span class="eyebrow">A LITTLE LESS. A LOT MORE.</span><h2>Not more things.<br><span class="serif">More meaning.</span></h2><p>We believe the things you surround yourself with should earn their place. Not by being the loudest. By making your day a little better.</p><p>A collection of thoughtful essentials. Nothing unnecessary. Just objects you'll keep coming back to.</p><a class="text-link" href="products.html">Find your everyday ${arrow}</a><div class="philosophy-sign">FORME<span>®</span><small>GOOD THINGS. LESS NOISE.</small></div></div></section>
 <section class="service-grid section-wrap"><div><span>01 /</span><h3>Considered design</h3><p>Useful shapes. Quiet details.<br>Objects that feel right at home.</p></div><div><span>02 /</span><h3>A simpler experience</h3><p>Find your favourite. Choose your amount.<br>Make room for something good.</p></div><div><span>03 /</span><h3>Room for the everyday</h3><p>For your space, your soundtrack,<br>and the small rituals in between.</p></div></section>`;
    bindFilters(true);
  }
  function filters() {
    return ["All objects", "Sound", "Living", "Everyday"]
      .map(
        (c) =>
          `<button class="filter ${category === c ? "active" : ""}" data-category="${c}" aria-pressed="${category === c}">${c}${c === "All objects" ? ` <small>${S.products.length}</small>` : ""}</button>`,
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
              (p) => category === "All objects" || p.category === category,
            )
            .slice(0, 4)
            .map(card)
            .join("");
        else {
          const url = new URL(location.href);
          if (category === "All objects") url.searchParams.delete("category");
          else url.searchParams.set("category", category);
          history.replaceState(null, "", url);
          renderCatalog();
        }
      }),
    );
  }
  function catalog() {
    if (!["All objects", "Sound", "Living", "Everyday"].includes(category))
      category = "All objects";
    document.title = "The collection — " + S.name;
    $("#main").innerHTML =
      `<section class="catalog section-wrap"><div class="breadcrumbs"><a href="index.html">Home</a><span>/</span>The collection</div><div class="catalog-heading"><span class="eyebrow">GOOD THINGS. LESS NOISE.</span><h1>The collection<span class="serif">.</span></h1><p>Thoughtfully selected objects for the way you live.</p></div><div class="catalog-controls"><div class="filter-row">${filters()}</div><label class="sort-label">Sort by <select id="sort"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option></select></label></div><p class="result-count" id="result-count"></p><div class="product-grid catalog-grid" id="catalog-grid"></div></section>`;
    bindFilters();
    $("#sort").addEventListener("change", (e) => {
      sort = e.target.value;
      renderCatalog();
    });
    renderCatalog();
  }
  function renderCatalog() {
    let products = S.products.filter(
      (p) => category === "All objects" || p.category === category,
    );
    if (sort !== "featured")
      products.sort((a, b) =>
        sort === "low" ? a.price - b.price : b.price - a.price,
      );
    $("#catalog-grid").innerHTML = products.map(card).join("");
    $("#result-count").textContent = `${products.length} considered objects`;
  }
  function productPage() {
    const id =
        new URLSearchParams(location.search).get("id") || S.products[0].id,
      p = getProduct(id);
    if (!p) {
      $("#main").innerHTML =
        '<section class="empty-page"><span class="eyebrow">A SMALL DETOUR</span><h1>Object not found.</h1><a class="button button-light" href="products.html">Back to the collection <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></a></section>';
      return;
    }
    document.title = `${p.name} — ${S.name}`;
    variant = p.variants[0];
    $("#main").innerHTML =
      `<section class="product-page section-wrap"><div class="breadcrumbs"><a href="index.html">Home</a><span>/</span><a href="products.html">The collection</a><span>/</span>${esc(p.name)}</div><div class="product-layout"><div class="detail-image"><span class="eyebrow">FORME / ${esc(p.category).toUpperCase()}</span><img src="${esc(p.image)}" alt="${esc(p.name)}" width="800" height="800"><span class="image-note">CONSIDERED FROM EVERY ANGLE.</span></div><div class="detail-copy"><span class="eyebrow">${esc(p.label)}</span><h1>${esc(p.name)}</h1><div class="detail-price">${money(p.price)} <small>${S.currency}</small></div><p class="detail-description">${esc(p.description)}</p><fieldset class="variant-options"><legend>Finish <span id="selected-variant">${esc(variant)}</span></legend>${p.variants.map((v, i) => `<label class="variant"><input type="radio" name="variant" value="${esc(v)}" ${!i ? "checked" : ""}><span class="swatch ${v.toLowerCase()}"></span><span>${esc(v)}</span></label>`).join("")}</fieldset><div class="quantity-label"><label for="product-quantity">How many?</label><small>Make it yours.</small></div><div class="purchase-row"><div class="quantity-control"><button id="quantity-minus" aria-label="Decrease quantity">−</button><input id="product-quantity" aria-label="Quantity" type="number" min="1" max="99" value="1" inputmode="numeric"><button id="quantity-plus" aria-label="Increase quantity">+</button></div><button class="button button-light" id="add-bag">Add to bag <span id="add-total">${money(p.price)}</span> +</button></div><button class="button button-outline full" id="buy-now">Buy now ${arrow}</button><p class="shipping-note">${arrow} Complimentary delivery on orders ${money(S.shipping.freeAbove)}+</p><details open><summary>The details <span>+</span></summary><ul>${p.details.map((d) => `<li>${esc(d)}</li>`).join("")}</ul></details><details><summary>Delivery & returns <span>+</span></summary><p>Delivery within ${esc(S.shipping.country)} is ${money(S.shipping.fee)}, or free from ${money(S.shipping.freeAbove)}. This preview does not accept orders. Final delivery times and returns terms will be confirmed before launch.</p></details></div></div></section><section class="section-wrap related"><div class="section-heading"><div><span class="eyebrow">GOOD COMPANY</span><h2>Better together.</h2></div><a href="products.html" class="text-link">Explore all ${arrow}</a></div><div class="product-grid">${S.products
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
      $("#add-total").textContent = money(p.price * quantity);
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
          toast("You can add up to 99 of each finish.");
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
      root.innerHTML = `<div class="empty-bag"><span class="empty-symbol">✳</span><h3>A little room for<br>something good.</h3><p>Your bag is waiting for its first favourite.</p><a class="button button-light" href="products.html">Explore the collection ${arrow}</a></div>`;
      return;
    }
    root.innerHTML = `<div class="bag-progress"><p>${subtotal() >= S.shipping.freeAbove ? "Your delivery is on us." : `${money(S.shipping.freeAbove - subtotal())} away from complimentary delivery.`}</p><div><span style="width:${Math.min(100, (subtotal() / S.shipping.freeAbove) * 100)}%"></span></div></div><div class="bag-items">${cart
      .map((x, i) => {
        const p = getProduct(x.id);
        return `<article class="bag-item"><a href="product.html?id=${p.id}"><img src="${esc(p.image)}" alt="${esc(p.name)}" width="100" height="100"></a><div><a href="product.html?id=${p.id}">${esc(p.name)}</a><small>${esc(x.variant)}</small><div class="bag-quantity"><button data-adjust="${i}" data-delta="-1" aria-label="Decrease ${esc(p.name)} quantity" ${x.quantity === 1 ? "disabled" : ""}>−</button><span>${x.quantity}</span><button data-adjust="${i}" data-delta="1" aria-label="Increase ${esc(p.name)} quantity" ${x.quantity === 99 ? "disabled" : ""}>+</button></div></div><div class="bag-item-right"><span>${money(p.price * x.quantity)}</span><button data-remove="${i}">Remove</button></div></article>`;
      })
      .join(
        "",
      )}</div><div class="bag-summary"><div><span>Subtotal</span><strong>${money(subtotal())}</strong></div><p>Delivery calculated at checkout. Prices in ${S.currency}.</p><a class="button button-light full" href="checkout.html">Continue to checkout ${arrow}</a><button class="continue-shopping" data-continue>Keep exploring</button></div>`;
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
      `<section class="checkout section-wrap"><div class="breadcrumbs"><a href="products.html">The collection</a><span>/</span>Checkout</div><div class="checkout-heading"><span class="eyebrow">A FEW SIMPLE STEPS</span><h1>Make it yours<span class="serif">.</span></h1></div><div class="checkout-layout"><div><ol class="checkout-steps"><li class="current" data-step-label="1"><span>01</span>Details</li><li data-step-label="2"><span>02</span>Delivery</li><li data-step-label="3"><span>03</span>Payment</li></ol><div class="preview-note">Store preview · Orders and payments are not live yet.</div><form id="checkout-form"><section data-step="1"><h2>Your details</h2><p class="muted">Just the essentials. No account needed.</p><div class="field-grid"><label>First name<input name="firstName" autocomplete="given-name" required maxlength="80"></label><label>Last name<input name="lastName" autocomplete="family-name" required maxlength="80"></label><label class="full-field">Email address<input name="email" type="email" autocomplete="email" required maxlength="254" placeholder="you@example.com"></label></div><button class="button button-light full" type="submit">Continue to delivery ${arrow}</button></section><section data-step="2" hidden><h2>Where to?</h2><p class="muted">A place for your next favourite.</p><div class="field-grid"><label class="full-field">Street address<input name="address" autocomplete="address-line1" required maxlength="200"></label><label class="full-field">Apartment, suite, etc. <span class="muted">(optional)</span><input name="apartment" autocomplete="address-line2" maxlength="100"></label><label>Suburb / city<input name="city" autocomplete="address-level2" required maxlength="100"></label><label>State / territory<select name="state" autocomplete="address-level1" required><option value="">Select state</option>${["ACT", "NSW", "NT", "QLD", "SA", "TAS", "VIC", "WA"].map((x) => `<option>${x}</option>`).join("")}</select></label><label>Postcode<input name="postcode" autocomplete="postal-code" required inputmode="numeric" pattern="[0-9]{4}" maxlength="4" title="Enter a four-digit Australian postcode"></label><label>Country<input name="country" value="${esc(S.shipping.country)}" readonly autocomplete="country-name"></label></div><div class="delivery-choice"><div><strong>Standard delivery</strong><small>Delivery timing confirmed when orders open.</small></div><strong>${shipping() ? money(shipping()) : "Complimentary"}</strong></div><button class="button button-light full" type="submit">Continue to payment ${arrow}</button><button class="back-step" type="button" data-back="1">← Back to details</button></section><section data-step="3" hidden><h2>The final little step.</h2><p class="muted">Review your details before payment.</p><div id="delivery-review" class="delivery-review"></div><div class="payment-placeholder"><span class="payment-icon"><svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span><h3>Good things are on their way.</h3><p>Online payments will be available soon. Your bag is saved, and no order has been placed.</p><p>When payments open, you’ll complete your purchase securely through Stripe.</p></div><button type="button" class="button button-light full" id="pay-button" ${S.checkoutEndpoint ? "" : "disabled"}>${S.checkoutEndpoint ? `Continue to secure payment ${arrow}` : "Payments opening soon"}</button><p id="payment-status" role="status" class="payment-status"></p><button class="back-step" type="button" data-back="2">← Edit delivery details</button></section></form></div><aside class="order-summary"><div class="summary-heading"><h2>In good company.</h2><button type="button" id="edit-bag">Edit bag <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></button></div><div id="checkout-items">${cart
        .map((x) => {
          const p = getProduct(x.id);
          return `<div class="summary-item"><img src="${esc(p.image)}" alt="${esc(p.name)}" width="80" height="80"><div><strong>${esc(p.name)}</strong><small>${esc(x.variant)} · Qty ${x.quantity}</small></div><span>${money(p.price * x.quantity)}</span></div>`;
        })
        .join(
          "",
        )}</div><div class="summary-costs"><div><span>Subtotal</span><span>${money(subtotal())}</span></div><div><span>Delivery</span><span>${shipping() ? money(shipping()) : "Complimentary"}</span></div><div class="total"><strong>Total</strong><strong><small>${S.currency}</small> ${money(subtotal() + shipping())}</strong></div></div><p class="summary-note">A considered collection. A simpler experience.</p></aside></div></section>`;
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
      if (!S.checkoutEndpoint) return;
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
      `<p>Standard delivery within ${esc(S.shipping.country)} is ${money(S.shipping.fee)}. Delivery is complimentary on orders of ${money(S.shipping.freeAbove)} or more.</p><p>This store is currently a preview. Orders are not being accepted. Delivery estimates, returns terms and support details will be published before launch.</p>`,
    ],
    help: [
      "A little more clarity.",
      "<p>Explore a product to choose its finish and quantity, then add it to your bag or go straight to checkout.</p><p>Payments are not live yet. No order is placed in this preview. Customer support details will be added before the store opens.</p>",
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
              `<a class="search-result" href="product.html?id=${p.id}"><img src="${esc(p.image)}" alt="" width="72" height="72"><span>${esc(p.name)}<small>${esc(p.category)}</small></span><span>${money(p.price)} <svg class="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M5 19 19 5M5 5h14v14"/></svg></span></a>`,
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
  $("[data-year]").textContent = new Date().getFullYear();
  save();
  const page = location.pathname.split("/").pop();
  if (page === "products.html") catalog();
  else if (page === "product.html") productPage();
  else if (page === "checkout.html") checkout();
  else home();
})();
