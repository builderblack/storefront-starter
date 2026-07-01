import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'BuilderBlack Storefront Starter',
  description: 'Reference Next.js storefront for BuilderBlack',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header style={{ borderBottom: '1px solid #eee', padding: '16px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Link href="/" style={{ fontSize: 18, fontWeight: 700, textDecoration: 'none', color: '#111' }}>
            Store
          </Link>
          <nav style={{ display: 'flex', gap: 16 }}>
            <Link href="/" style={{ color: '#555', textDecoration: 'none' }}>Shop</Link>
            <Link href="/cart" style={{ color: '#555', textDecoration: 'none' }}>Cart</Link>
          </nav>
        </header>
        <main style={{ maxWidth: 1100, margin: '0 auto', padding: '32px 24px' }}>
          {children}
        </main>
        <footer style={{ marginTop: 64, padding: '24px', textAlign: 'center', color: '#888', fontSize: 13, borderTop: '1px solid #eee' }}>
          Powered by BuilderBlack
        </footer>
      </body>
    </html>
  );
}
