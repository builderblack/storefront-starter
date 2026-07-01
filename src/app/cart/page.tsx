'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getBrowserStorefront } from '@/lib/storefront';
import type { Cart } from '@builderblack/storefront-sdk';

export default function CartPage() {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);

  const sf = typeof window !== 'undefined' ? getBrowserStorefront() : null;

  useEffect(() => {
    if (!sf) return;
    sf.cart
      .get()
      .then((res) => setCart(res.data))
      .catch(() => setCart({ items: [] }))
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const updateQty = async (variantId: string, qty: number) => {
    if (!sf) return;
    setBusy(true);
    try {
      const res = await sf.cart.updateItem(variantId, qty);
      setCart(res.data);
    } finally {
      setBusy(false);
    }
  };

  const removeItem = async (variantId: string) => {
    if (!sf) return;
    setBusy(true);
    try {
      const res = await sf.cart.removeItem(variantId);
      setCart(res.data);
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <p style={{ color: '#888' }}>Loading cart…</p>;

  if (!cart || cart.items.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: 48, color: '#888' }}>
        <p>Your cart is empty.</p>
        <Link href="/" className="btn-secondary" style={{ display: 'inline-block', marginTop: 12, textDecoration: 'none' }}>
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 style={{ marginBottom: 24 }}>Cart</h1>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead style={{ borderBottom: '1px solid #eee', textAlign: 'left' }}>
          <tr>
            <th style={{ padding: '12px 0', fontSize: 12, color: '#888', fontWeight: 500 }}>ITEM</th>
            <th style={{ padding: '12px 0', fontSize: 12, color: '#888', fontWeight: 500 }}>QTY</th>
            <th style={{ padding: '12px 0', fontSize: 12, color: '#888', fontWeight: 500, textAlign: 'right' }}>SUBTOTAL</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {cart.items.map((item) => (
            <tr key={item.variant_id} style={{ borderBottom: '1px solid #f3f3f3' }}>
              <td style={{ padding: '16px 0', display: 'flex', alignItems: 'center', gap: 12 }}>
                {item.image_url ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img src={item.image_url} alt={item.title} style={{ width: 60, height: 60, objectFit: 'cover', borderRadius: 6 }} />
                ) : null}
                <div>
                  <div style={{ fontWeight: 600 }}>{item.title}</div>
                  {item.sku ? <div style={{ fontSize: 12, color: '#888' }}>{item.sku}</div> : null}
                </div>
              </td>
              <td>
                <input
                  type="number"
                  min={1}
                  value={item.quantity}
                  disabled={busy}
                  onChange={(e) => updateQty(item.variant_id, Math.max(1, parseInt(e.target.value || '1', 10)))}
                  style={{ width: 60, padding: '6px 8px', border: '1px solid #ddd', borderRadius: 4 }}
                />
              </td>
              <td style={{ textAlign: 'right' }}>{formatMoney(item.subtotal, cart.currency || 'USD')}</td>
              <td style={{ textAlign: 'right' }}>
                <button onClick={() => removeItem(item.variant_id)} disabled={busy} style={{ background: 'none', border: 0, color: '#c00', cursor: 'pointer', fontSize: 13 }}>
                  Remove
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td colSpan={2} style={{ padding: '24px 0', fontWeight: 600 }}>Subtotal</td>
            <td style={{ padding: '24px 0', textAlign: 'right', fontWeight: 700, fontSize: 20 }}>
              {formatMoney(cart.subtotal || '0', cart.currency || 'USD')}
            </td>
            <td></td>
          </tr>
        </tfoot>
      </table>
      <div style={{ marginTop: 24, textAlign: 'right' }}>
        <Link href="/checkout" className="btn" style={{ display: 'inline-block', textDecoration: 'none' }}>
          Checkout
        </Link>
      </div>
      <p style={{ marginTop: 24, fontSize: 12, color: '#888' }}>
        This starter doesn't ship a full checkout flow — wire up{' '}
        <code>sf.checkout.placeOrder()</code> + your payment provider (Razorpay /
        Stripe) in <code>app/checkout/page.tsx</code>. See{' '}
        <a href="https://github.com/builderblack/storefront-sdk/blob/main/docs/STOREFRONT-API.md#8-checkout-flow" target="_blank" rel="noreferrer">
          STOREFRONT-API.md § 8
        </a>{' '}
        for the full pipeline.
      </p>
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
