import type { Metadata } from 'next';
import { DashboardShell } from '@/components/templates/dashboard-shell';
export const metadata: Metadata = { title: 'Ringkasan — Saku', description: 'Saldo, arus uang, dan aktivitas terbaru dompetmu dalam satu halaman.' };
export default function Page() { return <DashboardShell/>; }
