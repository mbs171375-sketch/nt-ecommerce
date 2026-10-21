/* Product catalogue. Prices are integer cents, or null until confirmed.
   Replace placeholder images with verified photos of the exact style/colour.
   Set imagePending to false after adding a matching image. Keep IDs stable.
   Replace variants with actual available sizes; never guess stock availability.
   Stripe secrets belong on the server, never in this file. */
window.STORE = {
  name: "FORME",
  currency: "USD",
  locale: "en-AU",
  shipping: {
    fee: 900,
    freeAbove: 15000,
    country: "Australia",
    currency: "AUD",
  },
  checkoutEndpoint: "",
  products: [
    {
      id: "sp5der-hoodie",
      name: "Sp5der hoodie — pink / black",
      category: "Hoodies",
      brand: "Sp5der",
      price: 3000,
      image: "assets/products/sp5der-pink-black.jpg",
      imagePending: false,
      label: "Sp5der",
      description:
        "Pink / black Sp5der hoodie, part of the upcoming clothing drop. Exact design and stock quantities will be confirmed before orders open.",
      details: [
        "Online reference photo — exact stock style and colour to be confirmed",
        "Sizes: Small, Medium, Large and XL",
      ],
      optionLabel: "Size",
      variants: ["Small", "Medium", "Large", "XL"],
      imageReference: true,
      imageSource:
        "https://kingspider.co/products/pink-og-web-v2-hoodie-black-archive",
    },
    {
      id: "bape-tee",
      name: "BAPE Big Ape Head T-shirt",
      category: "T-shirts",
      brand: "BAPE",
      price: 1500,
      image: "assets/products/bape-big-ape-head.jpg",
      imagePending: false,
      label: "BAPE",
      description:
        "BAPE Big Ape Head T-shirt, part of the upcoming clothing drop. Exact style, colour and stock quantities will be confirmed before orders open.",
      details: [
        "Online reference photo — exact stock style and colour to be confirmed",
        "Sizes: Small, Medium, Large and XL",
      ],
      optionLabel: "Size",
      variants: ["Small", "Medium", "Large", "XL"],
      imageReference: true,
      imageSource: "https://us.bape.com/products/1m30-110-002",
    },
    {
      id: "neovision-hoodie",
      name: "Neovision hoodie",
      category: "Hoodies",
      brand: "Neovision",
      price: 2000,
      image: "assets/products/hoodie-placeholder.svg",
      imagePending: true,
      label: "Neovision",
      description:
        "Neovision hoodie, part of the upcoming clothing drop. Exact style, colour and stock quantities will be confirmed before orders open.",
      details: [
        "Product photo and exact style to be confirmed",
        "Sizes: Small, Medium, Large and XL",
      ],
      optionLabel: "Size",
      variants: ["Small", "Medium", "Large", "XL"],
    },
    {
      id: "blank-hoodie",
      name: "Blank hoodie",
      category: "Hoodies",
      brand: "Unbranded",
      price: 1500,
      image: "assets/products/hoodie-placeholder.svg",
      imagePending: true,
      label: "Unbranded",
      description:
        "Blank hoodie, part of the upcoming clothing drop. Exact style, colour and stock quantities will be confirmed before orders open.",
      details: [
        "Product photo and exact style to be confirmed",
        "Sizes: Small, Medium, Large and XL",
      ],
      optionLabel: "Size",
      variants: ["Small", "Medium", "Large", "XL"],
    },
    {
      id: "ralph-lauren-bundle",
      name: "Ralph Lauren polo bundle — 3 T-shirts",
      category: "Bundles",
      brand: "Ralph Lauren",
      price: 4000,
      image: "assets/products/polo-bundle-placeholder.svg",
      imagePending: true,
      label: "Ralph Lauren",
      description:
        "A bundle of 3 Ralph Lauren T-shirts for USD 40. Choose Small, Medium, Large or XL. Exact designs and colours will be confirmed before orders open.",
      details: [
        "3 T-shirts per bundle — quantity 1 adds one complete bundle",
        "Product photo and exact style to be confirmed",
        "Sizes: Small, Medium, Large and XL",
      ],
      optionLabel: "Size",
      variants: ["Small", "Medium", "Large", "XL"],
      unitsPerBundle: 3,
    },
    {
      id: "north-face-jacket",
      name: "The North Face puffer jacket",
      category: "Outerwear",
      brand: "The North Face",
      price: 3500,
      image: "assets/products/puffer-jacket-placeholder.svg",
      imagePending: true,
      label: "The North Face",
      description:
        "The North Face puffer jacket, part of the upcoming clothing drop. Exact style, colour and stock quantities will be confirmed before orders open.",
      details: [
        "Product photo and exact style to be confirmed",
        "Sizes: Small, Medium, Large and XL",
      ],
      optionLabel: "Size",
      variants: ["Small", "Medium", "Large", "XL"],
    },
    {
      id: "north-face-vest",
      name: "The North Face puffer vest",
      category: "Outerwear",
      brand: "The North Face",
      price: 2500,
      image: "assets/products/puffer-vest-placeholder.svg",
      imagePending: true,
      label: "The North Face",
      description:
        "The North Face puffer vest, part of the upcoming clothing drop. Exact style, colour and stock quantities will be confirmed before orders open.",
      details: [
        "Product photo and exact style to be confirmed",
        "Sizes: Small, Medium, Large and XL",
      ],
      optionLabel: "Size",
      variants: ["Small", "Medium", "Large", "XL"],
    },
    {
      id: "essentials-hoodie",
      name: "Essentials hoodie",
      category: "Hoodies",
      brand: "Essentials",
      price: null,
      image: "assets/products/essentials-hoodie.jpg",
      imagePending: false,
      label: "Essentials",
      description:
        "Essentials hoodie, part of the upcoming clothing drop. Exact style, colour and stock quantities will be confirmed before orders open.",
      details: [
        "Online reference photo — exact stock style and colour to be confirmed",
        "Sizes: Small, Medium, Large and XL",
        "Price will be confirmed before orders open",
      ],
      optionLabel: "Size",
      variants: ["Small", "Medium", "Large", "XL"],
      imageReference: true,
      imageSource:
        "https://fearofgod.com/products/essentials-classic-raglan-hoodie-rw01616-vintage-black",
    },
    {
      id: "essentials-tee",
      name: "Essentials T-shirt",
      category: "T-shirts",
      brand: "Essentials",
      price: null,
      image: "assets/products/essentials-tee.jpg",
      imagePending: false,
      label: "Essentials",
      description:
        "Essentials T-shirt, part of the upcoming clothing drop. Exact style, colour and stock quantities will be confirmed before orders open.",
      details: [
        "Online reference photo — exact stock style and colour to be confirmed",
        "Sizes: Small, Medium, Large and XL",
        "Price will be confirmed before orders open",
      ],
      optionLabel: "Size",
      variants: ["Small", "Medium", "Large", "XL"],
      imageReference: true,
      imageSource:
        "https://fearofgod.com/products/essentials-essential-raglan-tee-rw01612-vintage-black",
    },
    {
      id: "arcteryx-jacket",
      name: "Arc’teryx jacket",
      category: "Outerwear",
      brand: "Arc’teryx",
      price: 7000,
      image: "assets/products/jacket-placeholder.svg",
      imagePending: true,
      label: "Arc’teryx",
      description:
        "Arc’teryx jacket, part of the upcoming clothing drop. Exact model, colour and stock quantities will be confirmed before orders open.",
      details: [
        "Exact jacket model and product photo to be confirmed",
        "Sizes: Small, Medium, Large and XL",
      ],
      optionLabel: "Size",
      variants: ["Small", "Medium", "Large", "XL"],
    },
  ],
  displayCurrency: "AUD",
  exchangeRate: 1.42838714,
  exchangeRateDate: "2026-10-20",
  exchangeRateSource:
    "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json",
};
