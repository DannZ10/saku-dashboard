import type { Metadata } from 'next';
import { DashboardShell } from '@/components/templates/dashboard-shell';
export const metadata: Metadata = { title: 'Top up — Saku', description: 'Tambah saldo dompet Saku, mulai Rp1 sampai Rp10.000.000 per transaksi.' };
export default function Page() { return <DashboardShell view="topup"/>; }
