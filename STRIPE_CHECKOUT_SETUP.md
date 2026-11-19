# See The Truth Supply — Stripe checkout setup

The game and shop are served from GitHub Pages, which is **static hosting**. This implementation keeps the custom arcade UI in `shop.html` and sends card payments to **Stripe-hosted Checkout through Payment Links**. The new "VIEW CHECKOUT TERMINAL" button is a preview until links are installed. No card details are handled or stored in the game.

## Stripe products supplied

- Stripe product **FCSTS** (Forever Changing / Still the Same, according to the supplied dashboard label): `prod_VehQgolIY136o0`.
- Second Stripe product: `prod_VehGbSqG6enzeX`. The owner confirmed that the second Payment Link belongs to **After Dark**; product-to-link association was not independently inspected inside Stripe.

**These are Stripe Dashboard product identifiers, not public checkout URLs.** The owner has now supplied and confirmed the following public links:

- **Forever Changing:** `https://buy.stripe.com/4gM28k4P3a8C3utciabwk00`
- **After Dark:** `https://buy.stripe.com/9B600cchvfsW8ON4PIbwk01`

Both URLs are configured in the preview branch. Checkout URLs could not be independently inspected from here to confirm actual product prices, required size fields, or shipping/taxes. **Verify all of those manually in Stripe before merging the PR.**

## Step 1 — Create customer-facing Payment Links

In [Stripe Payment Links](https://dashboard.stripe.com/payment-links), create one Payment Link for each shirt, using the existing product and its correct Price. Stripe supplies public checkout URLs such as `https://buy.stripe.com/...`.

For each physical-shirt checkout:
- Enable **shipping-address collection** and configure shipping destinations/rates.
- Make **Size** a required **dropdown custom field**, with S / M / L / XL / 2XL, if using a single Payment Link for all sizes. Confirm all offered sizes are in stock.
- Configure taxes, refunds, support contact and any policies applicable to your store.
- Ensure your live Payment Links use the intended live products/prices before publishing.

Stripe custom fields and shipping collection: https://docs.stripe.com/payment-links/customize

## Step 2 — Configure the game store

Edit the `STORE` constant near the bottom of `shop.html`. These are **examples only**:

```js
const STORE = {
  diamond: { price: '', link: 'https://buy.stripe.com/4gM28k4P3a8C3utciabwk00', links: null, confirmed: true, sizes: ['S','M','L','XL','2XL'] },
  onyx:    { price: '', link: 'https://buy.stripe.com/9B600cchvfsW8ON4PIbwk01', links: null, confirmed: true, sizes: ['S','M','L','XL','2XL'] }
};
```

- `diamond` corresponds to the **Forever Changing** T-shirt.
- `onyx` corresponds to the **After Dark** long sleeve.
- The preview and price displays come from these values; BUY goes through the themed terminal then Stripe.
- With a single `link` for each shirt, **size is selected on Stripe's form**, not transferred from the game.
- To choose a size in the game and guarantee the exact variant purchased, provide one link per size in `links:{S:'https://...',M:'https://...',...}` or build a secure server-side Checkout Session integration that can pass selected options. Don't assume a locally selected size will automatically appear in a generic Payment Link.
- The owner has confirmed the mapping and `confirmed:true` now enables the BUY buttons on this preview branch. Prices remain unfilled, so the store says **SEE STRIPE** rather than inventing dollar amounts. Keep this branch off the live site until shipping, size fields, product and taxes are checked.

## Step 3 — Match the Stripe-hosted page to the game

Open [Stripe Checkout branding settings](https://dashboard.stripe.com/account/branding/checkout) and apply available appearance options.

Game palette:

| Token | Hex | Intent |
|---|---|---|
| Background | `#0B0618` | Deep midnight purple |
| Panels | `#120A28` | Dark indigo |
| Accent pink | `#FF5EE8` | Neon/magenta |
| Accent cyan | `#6FE8FF` | Electric cyan |
| Button yellow | `#FFD60A` | Main call to action |
| Red accent | `#FF4D6D` | After Dark |
| Green accent | `#4DFF6A` | System/secure status |

Use the See The Truth logo or eye mark. Select the closest supported font and sharp/rectangular styling when available. Stripe's hosted payment page supports branding choices, but not arbitrary HTML/CSS and not an exact Press Start 2P appearance.

## Security and launch checks

- **Never** paste a Stripe secret key into `shop.html`, a JavaScript file, or a public GitHub repo. Payment Links do not need a secret key in the game.
- Test both products and verify the correct size, real price, shipping address, shipping fees, tax, email receipt, and return route before taking orders.
- Stripe must confirm successful payments. Do **not** unlock in-game content or fulfill physical orders based only on a client-side success URL or `localStorage`.
- To unlock equipment based on real purchases automatically, implement a secure server endpoint/webhook verifying `checkout.session.completed` with Stripe; GitHub Pages alone cannot securely do that.

Stripe Payment Links: https://docs.stripe.com/payment-links/create
Stripe checkout customization: https://docs.stripe.com/payment-links/customize
Stripe fulfillment: https://docs.stripe.com/checkout/fulfillment
