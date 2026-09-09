import type { Metadata } from 'next';
import { DashboardShell } from '@/components/templates/dashboard-shell';
export const metadata: Metadata = { title: 'Panduan — Saku', description: 'Cara menggunakan Saku, batas transaksi, dan solusi saat ada kendala.' };
export default function Page() { return <DashboardShell view="help"/>; }
