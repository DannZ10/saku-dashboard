import type { Metadata } from 'next';
import { Providers } from '@/components/providers';
import './globals.css';
export const metadata: Metadata = { title: 'Saku — Mini Wallet', description: 'Ruang sederhana untuk saldo, transfer, dan aktivitas uangmu.' };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="id"><body><Providers>{children}</Providers></body></html>;
}
