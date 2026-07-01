import { createStorefrontClient } from '@builderblack/storefront-sdk';

/**
 * Server-side storefront client. Uses the Storefront API token
 * (server-only, never sent to browser) for elevated rate limits +
 * longer CDN cache TTLs. Use this in Server Components,
 * `getServerSideProps`, route handlers, and API routes.
 */
export function getServerStorefront() {
  const tenantSlug = process.env.NEXT_PUBLIC_BB_TENANT_SLUG;
  const apiUrl = process.env.NEXT_PUBLIC_BB_API_URL || 'https://api.builderblack.com';
  const storefrontToken = process.env.BB_STOREFRONT_TOKEN;

  if (!tenantSlug) {
    throw new Error(
      'NEXT_PUBLIC_BB_TENANT_SLUG is not set. Copy .env.example to ' +
      '.env.local and fill in your tenant slug.',
    );
  }

  return createStorefrontClient({
    apiUrl,
    tenantSlug,
    storefrontToken,
    // Cache GETs aggressively — Next.js fetch wrapper handles
    // revalidate based on Cache-Control headers from the API.
    defaultRequestInit: {
      // Next.js: revalidate every 5 minutes by default. Use
      // `next: { revalidate: 0 }` to bypass cache (e.g. cart routes).
      next: { revalidate: 300 } as any,
    },
  });
}

/**
 * Browser-side storefront client. Anonymous endpoints + customer JWT.
 * NEVER pass storefrontToken here — it's a server-only credential.
 */
export function getBrowserStorefront() {
  const tenantSlug = process.env.NEXT_PUBLIC_BB_TENANT_SLUG;
  const apiUrl = process.env.NEXT_PUBLIC_BB_API_URL || 'https://api.builderblack.com';

  if (!tenantSlug) {
    throw new Error('NEXT_PUBLIC_BB_TENANT_SLUG is not set.');
  }

  // Read the cart session UUID we persisted on the previous visit.
  let cartSessionId: string | undefined;
  if (typeof window !== 'undefined') {
    cartSessionId = window.localStorage.getItem('bb_cart_session') ?? undefined;
  }

  return createStorefrontClient({ apiUrl, tenantSlug, cartSessionId });
}
