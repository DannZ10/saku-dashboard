import type { Metadata } from 'next';
import { DashboardShell } from '@/components/templates/dashboard-shell';
export const metadata: Metadata = { title: 'Riwayat transaksi — Saku', description: 'Telusuri uang masuk dan keluar, lalu buka bukti transaksinya.' };
export default function Page() { return <DashboardShell view="transactions"/>; }
