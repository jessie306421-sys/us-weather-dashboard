import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'US Climate Dashboard',
  description: 'Real-time weather analysis across 50 states',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}