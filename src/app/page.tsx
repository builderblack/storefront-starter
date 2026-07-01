import Link from 'next/link';
import { getServerStorefront } from '@/lib/storefront';

// Render on every request rather than prerendering at build time.
// Without this, `next build` fails when env vars aren't set in CI
// because the storefront client throws on missing tenant slug.
// Per-request rendering also means inventory changes / new products
// show up without an explicit revalidation step.
export const dynamic = 'force-dynamic';

/**
 * Home page — fetches a list of products via the SDK and renders
 * a grid. Demonstrates the server-side rendering pattern: we hold
 * the storefront token, fetch from our origin, and the buyer's
 * browser only sees the rendered HTML.
 */
export default async function HomePage() {
  const sf = getServerStorefront();
  let products;
  try {
    const res = await sf.products.list({ limit: 24 });
    products = res.data;
  } catch (err: any) {
    return (
      <div>
        <h1>Couldn't load products</h1>
        <p style={{ color: '#888' }}>
          {err?.message || 'Unknown error'}. Check your environment variables —
          see <code>.env.example</code>.
        </p>
      </div>
    );
  }

  if (!products || products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
        <p>No products yet.</p>
        <p style={{ fontSize: 13 }}>Add products in your BuilderBlack dashboard at <code>app.builderblack.com</code>.</p>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Shop</h1>
      <div className="product-grid">
        {products.map((p) => (
          <Link key={p.id} href={`/products/${encodeURIComponent(p.slug)}`} className="product-card">
            <div className="thumb">
              {p.thumbnail ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img src={p.thumbnail} alt={p.title} />
              ) : null}
            </div>
            <div className="title">{p.title}</div>
            <div className="price">
              {p.min_price ? formatMoney(p.min_price, p.currency) : '—'}
              {p.max_price && p.max_price !== p.min_price ? ` – ${formatMoney(p.max_price, p.currency)}` : ''}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

function formatMoney(amount: string | number, currency: string): string {
  try {
    return new Intl.NumberFormat(undefined, { style: 'currency', currency }).format(Number(amount));
  } catch {
    return `${currency} ${amount}`;
  }
}
