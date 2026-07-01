import { notFound } from 'next/navigation';
import { getServerStorefront } from '@/lib/storefront';
import { AddToCartButton } from './add-to-cart';

// Per-request rendering — see comment in src/app/page.tsx.
export const dynamic = 'force-dynamic';

interface PageProps {
  params: { slug: string };
}

export default async function ProductPage({ params }: PageProps) {
  const sf = getServerStorefront();

  let product;
  try {
    const res = await sf.products.getBySlug(params.slug);
    product = res.data;
  } catch (err: any) {
    if (err?.status === 404) notFound();
    throw err;
  }

  const variants = product.variants || [];
  const firstAvailable = variants.find((v) => (v.inventory_quantity ?? 0) > 0) ?? variants[0];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 480px)', gap: 48 }}>
      <div>
        {product.images && product.images.length > 0 ? (
          <div style={{ borderRadius: 12, overflow: 'hidden', background: '#f5f5f5' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={product.images[0].url} alt={product.title} />
          </div>
        ) : (
          <div style={{ background: '#f5f5f5', height: 400, borderRadius: 12 }} />
        )}
      </div>
      <div>
        <h1 style={{ marginTop: 0, marginBottom: 8 }}>{product.title}</h1>
        {product.vendor ? <p style={{ color: '#888', marginTop: 0 }}>{product.vendor}</p> : null}
        {firstAvailable ? (
          <div style={{ fontSize: 24, fontWeight: 700, marginBottom: 24 }}>
            {formatMoney(firstAvailable.price, product.currency)}
          </div>
        ) : null}

        {product.description ? (
          <div
            style={{ color: '#444', marginBottom: 24, lineHeight: 1.6 }}
            // Server-sanitised by the API (P17). Still review your tenant's
            // content if you don't trust internal users.
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
        ) : null}

        {firstAvailable ? (
          <AddToCartButton variantId={firstAvailable.id} title={product.title} />
        ) : (
          <p style={{ color: '#c00' }}>Out of stock.</p>
        )}
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
