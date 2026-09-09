import type { Metadata } from 'next';
import { AuthScreen } from '@/components/organisms/auth-screen';
export const metadata: Metadata = { title: 'Buat akun — Saku', description: 'Buat akun Saku dan mulai mengatur saldo, transfer, serta riwayat transaksi.' };
export default function Page() { return <AuthScreen mode="register"/>; }
