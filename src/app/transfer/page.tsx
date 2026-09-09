import type { Metadata } from 'next';
import { DashboardShell } from '@/components/templates/dashboard-shell';
export const metadata: Metadata = { title: 'Transfer — Saku', description: 'Kirim saldo ke pengguna Saku lain melalui email atau nomor HP.' };
export default function Page() { return <DashboardShell view="transfer"/>; }
