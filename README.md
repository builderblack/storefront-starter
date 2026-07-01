# BuilderBlack Storefront Starter

A minimal **Next.js 14 (App Router)** headless storefront for [BuilderBlack](https://builderblack.com),
built on [`@builderblack/storefront-sdk`](https://www.npmjs.com/package/@builderblack/storefront-sdk).
Fork it, set two environment variables, and deploy.

> **Use this template** → click the green **"Use this template"** button above to
> create your own storefront repo, then follow Setup below.

## What's in here

- **Home page** (`src/app/page.tsx`) — server component; fetches the product list via the SDK and renders a responsive grid.
- **Product detail** (`src/app/products/[slug]/page.tsx`) — server component fetches by slug; a client component handles add‑to‑cart.
- **Cart page** (`src/app/cart/page.tsx`) — client component that reads + mutates the cart through the SDK with a browser‑side cart session.
- **Layout + minimal CSS** — intentionally plain. The design is yours.

Deliberately **not** included (add what you need):
- Checkout flow — start with `sf.checkout.placeOrder` + your payment provider ([STOREFRONT‑API.md § 8](https://github.com/builderblack/storefront-sdk/blob/main/docs/STOREFRONT-API.md#8-checkout-flow)).
- Customer login / account pages — use `sf.customer.login` etc. (the SDK auto‑stores the JWT).
- Search, filters, collections — the patterns are obvious once you've seen the home page.
- Theming / branding — bring your own design.

## Setup

```bash
cp .env.example .env.local
# edit .env.local — set NEXT_PUBLIC_BB_TENANT_SLUG and (recommended) BB_STOREFRONT_TOKEN

npm install
npm run dev
# open http://localhost:3010
```

## Environment variables

| Var | Required | Example | Notes |
|-----|----------|---------|-------|
| `NEXT_PUBLIC_BB_TENANT_SLUG` | yes | `your-store-slug` | Your store's tenant slug — the part before `.builderblack.com` in your default subdomain. Find it in the dashboard sidebar. |
| `NEXT_PUBLIC_BB_API_URL` | yes | `https://api.builderblack.com` | API base URL. Defaults to production. |
| `BB_STOREFRONT_TOKEN` | recommended | `bb_sft_…` | Server‑only Storefront API token. Issue it from your dashboard at `app.builderblack.com/settings/api-tokens`. **Never prefix with `NEXT_PUBLIC_`** — that would leak it to the browser. Without it, anonymous endpoints still work (rate‑limited per IP); with it you get elevated limits + longer edge cache. |

## Deploy to Vercel

1. Create your repo from this template (**Use this template** button).
2. Import it into Vercel.
3. Add the environment variables above in the Vercel project settings (mark `BB_STOREFRONT_TOKEN` as encrypted).
4. Deploy.

### Custom domain (self‑hosted tenants)

If your tenant is on `deployment_mode='self_hosted'`:
1. Add your domain in the BuilderBlack dashboard under **Domain & SSL** (confirm "Self‑hosted" is on).
2. Point DNS at Vercel (or your host); SSL is issued automatically.
3. CORS works because your domain is registered in the platform when you add it in the dashboard.

If your tenant is `deployment_mode='platform'`, your custom domain points at BuilderBlack's own storefront rendering — switch it to `self_hosted` first to use this starter.

## The SDK pattern

Two helpers in `src/lib/storefront.ts`:
- `getServerStorefront()` — uses the Storefront API token (server only). Use in Server Components, route handlers, `getServerSideProps`.
- `getBrowserStorefront()` — anonymous + a cart‑session UUID from localStorage. Use in client components for cart mutations, customer login, etc.

The SDK handles auth headers, idempotency keys, cart‑session capture, and customer‑JWT storage. Full API: the [SDK README](https://github.com/builderblack/storefront-sdk#readme).

## Caching

Server‑side fetches use Next.js's built‑in cache (a 5‑minute `revalidate` in `getServerStorefront`). The platform sends aggressive `Cache-Control` headers, so token‑authenticated requests can be edge‑cached for up to an hour. For always‑fresh pages, pass `next: { revalidate: 0 }` or move the fetch into a client component.

## License

MIT — see [LICENSE](./LICENSE). PRs welcome.
