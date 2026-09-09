import type { Metadata } from 'next';
import { DashboardShell } from '@/components/templates/dashboard-shell';
export const metadata: Metadata = { title: 'Akun saya — Saku', description: 'Informasi akun untuk menerima dan mengirim saldo.' };
export default function Page() { return <DashboardShell view="account"/>; }
