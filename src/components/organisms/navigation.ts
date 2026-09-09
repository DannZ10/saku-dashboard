import { ArrowUpRight, CircleHelp, LayoutGrid, Plus, ReceiptText, UserRound } from 'lucide-react';
import type { NavEntry } from '@/components/molecules/nav-item';

export type View = 'overview' | 'topup' | 'transfer' | 'transactions' | 'detail' | 'account' | 'help';

export const navigation: NavEntry[] = [
  { href: '/', view: 'overview', label: 'Ringkasan', icon: LayoutGrid },
  { href: '/topup', view: 'topup', label: 'Top up', icon: Plus },
  { href: '/transfer', view: 'transfer', label: 'Transfer', icon: ArrowUpRight },
  { href: '/transactions', view: 'transactions', label: 'Riwayat transaksi', icon: ReceiptText },
  { href: '/account', view: 'account', label: 'Akun saya', icon: UserRound },
  { href: '/help', view: 'help', label: 'Panduan', icon: CircleHelp },
];

// eyebrow, title, and subtitle per view. Overview overrides the title with a greeting.
export const headings: Record<View, [string, string, string]> = {
  overview: ['DOMPET PRIBADI', 'Ringkasan', 'Saldo dan aktivitas uangmu, dalam satu pandangan.'],
  topup: ['TAMBAH SALDO', 'Isi dompetmu.', 'Pilih nominal, periksa kembali, lalu tambahkan saldo.'],
  transfer: ['KIRIM SALDO', 'Transfer dengan jelas.', 'Kirim ke sesama pengguna Saku melalui email atau nomor HP.'],
  transactions: ['CATATAN KEUANGAN', 'Riwayat transaksi.', 'Cari aktivitas dan buka rinciannya untuk melihat bukti transaksi.'],
  detail: ['BUKTI TRANSAKSI', 'Detail transaksi.', 'Rincian nominal, pihak terkait, dan saldo setelah transaksi.'],
  account: ['PROFIL & KEAMANAN', 'Akun saya.', 'Informasi akun yang digunakan untuk menerima dan mengirim saldo.'],
  help: ['PUSAT PANDUAN', 'Kenali dompetmu.', 'Cara menggunakan Saku, batas transaksi, dan solusi saat ada kendala.'],
};
