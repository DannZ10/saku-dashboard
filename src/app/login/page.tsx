import type { Metadata } from 'next';
import { AuthScreen } from '@/components/organisms/auth-screen';
export const metadata: Metadata = { title: 'Masuk — Saku', description: 'Masuk untuk melanjutkan aktivitas uangmu.' };
export default async function Page({ searchParams }: { searchParams: Promise<{ alasan?: string }> }) {
  const { alasan } = await searchParams;
  return <AuthScreen mode="login" reason={alasan}/>;
}
