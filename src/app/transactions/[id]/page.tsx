import type { Metadata } from 'next';
import { DashboardShell } from '@/components/templates/dashboard-shell';
export const metadata: Metadata = { title: 'Detail transaksi — Saku', description: 'Rincian nominal, pihak terkait, dan saldo setelah transaksi.' };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <DashboardShell view="detail" transactionId={id}/>;
}
