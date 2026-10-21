/* Edit this file to personalise your store. Prices are in cents.
   Replace image paths with your own photos in assets/products/.
   Stripe must use a server endpoint that validates product IDs and prices.
   Never put Stripe secret keys in this file or in browser code. */
window.STORE = {
  name: "FORME",
  currency: "AUD",
  locale: "en-AU",
  shipping: { fee: 900, freeAbove: 15000, country: "Australia" },
  // Set to your backend endpoint when Stripe is connected. See STORE_SETUP.md.
  checkoutEndpoint: "",
  products: [
    {
      id: "h01",
      name: "Over-ear headphones",
      category: "Sound",
      price: 18900,
      image: "assets/products/headphones.svg",
      label: "The everyday favourite",
      description:
        "A little less noise. A little more you. A sculptural over-ear silhouette made for the moments between everything.",
      details: [
        "Soft, over-ear cushions",
        "Adjustable, considered fit",
        "A clean, understated finish",
      ],
      variants: ["Graphite", "Stone"],
    },
    {
      id: "l01",
      name: "Mushroom table lamp",
      category: "Living",
      price: 12900,
      image: "assets/products/lamp.svg",
      label: "A softer kind of light",
      description:
        "Set the mood without saying a word. A rounded silhouette that brings a quiet, warm presence to your favourite corner.",
      details: [
        "Sculptural dome silhouette",
        "Compact bedside proportions",
        "Soft, ambient character",
      ],
      variants: ["Graphite", "Stone"],
    },
    {
      id: "s01",
      name: "Portable speaker",
      category: "Sound",
      price: 8900,
      image: "assets/products/speaker.svg",
      label: "Good company, anywhere",
      description:
        "Your daily soundtrack, beautifully contained. A simple, tactile object that feels at home wherever you take it.",
      details: [
        "Compact cylindrical form",
        "Tactile controls",
        "Understated woven finish",
      ],
      variants: ["Graphite"],
    },
    {
      id: "b01",
      name: "Everyday bottle",
      category: "Everyday",
      price: 3900,
      image: "assets/products/bottle.svg",
      label: "Keep the good habits",
      description:
        "A considered companion for the everyday. Clean lines, a reassuring feel, and a place in your daily routine.",
      details: [
        "Reusable everyday design",
        "Easy-carry profile",
        "Minimal matte finish",
      ],
      variants: ["Graphite", "Stone"],
    },
    {
      id: "c01",
      name: "Studio chair",
      category: "Living",
      price: 24900,
      image: "assets/products/chair.svg",
      label: "Room to slow down",
      description:
        "An inviting shape with nothing extra. A versatile piece for slow mornings, long dinners, and everything in between.",
      details: [
        "Contoured seat and back",
        "Slender architectural frame",
        "Made for versatile spaces",
      ],
      variants: ["Graphite"],
    },
    {
      id: "t01",
      name: "Quiet wall clock",
      category: "Living",
      price: 6900,
      image: "assets/products/clock.svg",
      label: "Take your time",
      description:
        "A softer approach to keeping time. A balanced face and restrained details that sit quietly in your space.",
      details: [
        "Minimal analogue face",
        "Easy-to-read contrasting hands",
        "Refined circular frame",
      ],
      variants: ["Graphite", "Stone"],
    },
  ],
};
