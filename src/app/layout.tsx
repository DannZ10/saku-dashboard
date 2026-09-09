import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import './globals.css';
export const metadata: Metadata = { title: 'Saku — Mini Wallet', description: 'Ruang sederhana untuk saldo, transfer, dan aktivitas uangmu.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  // globals.css sets scroll-behavior: smooth; this opts Next into managing it so
  // route transitions jump instantly instead of animating a slow scroll-to-top.
  return <html lang="id" data-scroll-behavior="smooth"><body><Providers>{children}</Providers></body></html>;
}
