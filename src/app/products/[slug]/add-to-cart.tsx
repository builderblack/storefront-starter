'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { getBrowserStorefront } from '@/lib/storefront';

/**
 * Client component — runs in the browser, calls the SDK directly
 * with the buyer's cart session, then navigates to /cart.
 *
 * Note: the cart session UUID is created on the server's first
 * response and captured by the SDK. We persist it to localStorage
 * so the cart survives page reloads.
 */
export function AddToCartButton({ variantId, title }: { variantId: string; title: string }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const onClick = async () => {
    setBusy(true);
    setError(null);
    try {
      const sf = getBrowserStorefront();
      await sf.cart.addItem({ variantId, quantity: 1 });
      // Persist the (possibly newly-issued) session UUID
      const session = sf.getCartSessionId();
      if (session) localStorage.setItem('bb_cart_session', session);
      router.push('/cart');
    } catch (e: any) {
      setError(e?.message || 'Failed to add to cart');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <button className="btn" disabled={busy} onClick={onClick} aria-label={`Add ${title} to cart`}>
        {busy ? 'Adding…' : 'Add to cart'}
      </button>
      {error ? <p style={{ color: '#c00', marginTop: 12 }}>{error}</p> : null}
    </div>
  );
}
